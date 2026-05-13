const OpenAI = require('openai');
const { safeJsonParse } = require('../../utils/jsonParser');
const logger = require('../../utils/logger');

class AIRequirementService {
  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey: apiKey,
        baseURL: 'https://api.groq.com/openai/v1'
      });
    }
  }

  async extractRequirements(jobDescription, provider = 'groq') {
    const startTime = Date.now();
    try {
      if (!this.openai) {
        throw new Error('GROQ_API_KEY is not configured');
      }

      const response = await this.openai.chat.completions.create({
        model: "llama-3.3-70b-versatile", // Ultra fast 70B model on Groq
        messages: [
          {
            role: "system",
            content: "You are an expert hiring requirements analyst. Extract structured hiring requirements from the provided job description. Return ONLY a valid JSON object."
          },
          {
            role: "user",
            content: `Extract structured requirements from this JD:
            
            ${jobDescription}

            REQUIRED JSON SCHEMA:
            {
              "role": "string",
              "skills": ["array of strings"],
              "preferredSkills": ["array of strings"],
              "experience": {
                "min": number or null,
                "max": number or null,
                "text": "original experience text"
              },
              "location": "string",
              "salary": {
                "min": number or null,
                "max": number or null,
                "currency": "string"
              },
              "employmentType": "string",
              "education": ["array of strings"],
              "certifications": ["array of strings"],
              "responsibilities": ["array of strings"],
              "industry": "string"
            }`
          }
        ],
        response_format: { type: "json_object" }
      });

      const text = response.choices[0].message.content;
      const extractedData = JSON.parse(text);
      const processingTime = Date.now() - startTime;

      return {
        success: true,
        data: this.normalizeExtraction(extractedData),
        processingTime
      };
    } catch (error) {
      logger.error('AI Requirement Extraction failed:', error);
      return {
        success: false,
        error: error.message,
        processingTime: Date.now() - startTime
      };
    }
  }

  normalizeExtraction(data) {
    return {
      role: data.role || 'Unknown Role',
      skills: Array.isArray(data.skills) ? data.skills : [],
      preferredSkills: Array.isArray(data.preferredSkills) ? data.preferredSkills : [],
      experience: {
        min: data.experience?.min || null,
        max: data.experience?.max || null,
        text: data.experience?.text || ''
      },
      location: data.location || 'Not Specified',
      salary: {
        min: data.salary?.min || null,
        max: data.salary?.max || null,
        currency: data.salary?.currency || ''
      },
      employmentType: data.employmentType || '',
      education: Array.isArray(data.education) ? data.education : [],
      certifications: Array.isArray(data.certifications) ? data.certifications : [],
      responsibilities: Array.isArray(data.responsibilities) ? data.responsibilities : [],
      industry: data.industry || ''
    };
  }
}

module.exports = new AIRequirementService();
