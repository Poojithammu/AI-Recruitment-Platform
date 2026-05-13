const HiringJob = require('../models/HiringJob');
const Company = require('../models/Company');
const Resume = require('../models/Resume');
const OpenAI = require('openai');
const pdf = require('pdf-parse');

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
});

// @desc    Get jobs for user dashboard
// @route   GET /api/user/jobs
// @access  Private/User
exports.getJobs = async (req, res) => {
  try {
    const { search, location, type } = req.query;
    let query = { isActive: true };

    if (search) {
      query.$or = [
        { jobRole: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { requiredSkills: { $regex: search, $options: 'i' } }
      ];
    }

    if (location) {
      query.$or = [
        { 'hiringLocation.city': { $regex: location, $options: 'i' } },
        { 'hiringLocation.country': { $regex: location, $options: 'i' } }
      ];
    }

    if (type && type !== 'all') {
      query.employmentType = type;
    }

    const jobs = await HiringJob.find(query).sort('-createdAt').limit(50);
    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get companies for user dashboard
// @route   GET /api/user/companies
// @access  Private/User
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort('-hiringScore').limit(30);
    res.status(200).json({ success: true, count: companies.length, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Scrutinize Resume
// @route   POST /api/user/scrutinize-resume
// @access  Private/User
exports.scrutinizeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a resume file (PDF)' });
    }

    const dataBuffer = req.file.buffer;
    let pdfData;
    try {
      pdfData = await pdf(dataBuffer);
    } catch (pdfError) {
      console.error('PDF parsing error:', pdfError);
      return res.status(400).json({ success: false, message: 'Failed to read PDF file. Please ensure it is a valid PDF.' });
    }
    
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length < 100) {
      return res.status(400).json({ success: false, message: 'Could not extract enough text from resume. Please ensure it contains readable text.' });
    }

    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert technical recruiter and resume analyst. Analyze the following resume text and provide a detailed scrutiny report in JSON format."
        },
        {
          role: "user",
          content: `Analyze this resume:
          
          ${resumeText}

          Return JSON with:
          {
            "overallScore": number (1-100),
            "summary": "short professional summary",
            "strengths": ["list of strings"],
            "weaknesses": ["list of strings"],
            "skillsFound": ["list of strings"],
            "recommendations": ["list of strings"],
            "marketFit": "string describing industry fit",
            "improvementTips": ["list of strings"]
          }`
        }
      ],
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(response.choices[0].message.content);

    // Optionally save to database
    await Resume.create({
      userId: req.user._id,
      fileUrl: 'uploaded_file', 
      parsedSkills: analysis.skillsFound,
      compatibilityScores: analysis
    });

    res.status(200).json({ success: true, data: analysis });
  } catch (error) {
    console.error('Resume scrutiny error:', error);
    res.status(500).json({ success: false, message: 'AI Analysis failed: ' + (error.message || 'Unknown error') });
  }
};

// @desc    Get stats for user dashboard
// @route   GET /api/user/dashboard/stats
// @access  Private/User
exports.getStats = async (req, res) => {
  try {
    const totalJobs = await HiringJob.countDocuments({ isActive: true });
    const totalCompanies = await Company.countDocuments();
    
    // Jobs by Domain (Top 5)
    const jobsByDomain = await HiringJob.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$domain', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { name: '$_id', value: '$count', _id: 0 } }
    ]);

    // Job Trends (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const jobTrends = await HiringJob.aggregate([
      { $match: { isActive: true, createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', jobs: '$count', _id: 0 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalJobs,
        totalCompanies,
        jobsByDomain,
        jobTrends,
        topSkills: ['React', 'Node.js', 'Python', 'AI/ML', 'AWS'] // Placeholder or could be aggregated
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
