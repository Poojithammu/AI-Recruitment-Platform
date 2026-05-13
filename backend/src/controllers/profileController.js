const RecruiterProfile = require('../models/RecruiterProfile');
const AnalystProfile = require('../models/AnalystProfile');
const CandidateProfile = require('../models/CandidateProfile');

// @desc    Get current user's profile
// @route   GET /api/profiles/me
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    let profile;
    const role = req.user.role;

    if (role === 'recruiter') {
      profile = await RecruiterProfile.findOne({ userId: req.user._id });
    } else if (role === 'analyst') {
      profile = await AnalystProfile.findOne({ userId: req.user._id });
    } else if (role === 'user') {
      profile = await CandidateProfile.findOne({ userId: req.user._id });
    }

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create or update current user's profile
// @route   POST /api/profiles
// @access  Private
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const role = req.user.role;
    let profileFields = { ...req.body, userId: req.user._id };
    let profile;

    if (role === 'recruiter') {
      profile = await RecruiterProfile.findOneAndUpdate(
        { userId: req.user._id },
        { $set: profileFields },
        { returnDocument: 'after', upsert: true, runValidators: true }
      );
    } else if (role === 'analyst') {
      profile = await AnalystProfile.findOneAndUpdate(
        { userId: req.user._id },
        { $set: profileFields },
        { returnDocument: 'after', upsert: true, runValidators: true }
      );
    } else if (role === 'user') {
      profile = await CandidateProfile.findOneAndUpdate(
        { userId: req.user._id },
        { $set: profileFields },
        { returnDocument: 'after', upsert: true, runValidators: true }
      );
    } else {
      return res.status(400).json({ message: 'Invalid role for profile creation' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
