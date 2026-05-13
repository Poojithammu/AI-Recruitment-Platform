const NormalizationService = require('../parsers/NormalizationService');
const SkillExtractor = require('../parsers/SkillExtractor');
const DeduplicationService = require('../services/hiring/DeduplicationService');

const runTests = () => {
  console.log('--- STARTING MODULE 3 UNIT TESTS ---');

  // 1. Normalization Test
  console.log('\nTesting NormalizationService:');
  const exp1 = NormalizationService.normalizeExperience('3-5 years');
  console.log(`'3-5 years' -> min: ${exp1.min}, max: ${exp1.max}`);
  
  const exp2 = NormalizationService.normalizeExperience('2+ years');
  console.log(`'2+ years' -> min: ${exp2.min}, max: ${exp2.max}`);

  const loc1 = NormalizationService.normalizeLocation('Hyderabad, India');
  console.log(`'Hyderabad, India' -> city: ${loc1.city}, country: ${loc1.country}, remote: ${loc1.remote}`);

  const loc2 = NormalizationService.normalizeLocation('USA (Remote)');
  console.log(`'USA (Remote)' -> city: ${loc2.city}, remote: ${loc2.remote}`);

  // 2. Skill Extraction Test
  console.log('\nTesting SkillExtractor:');
  const skills = SkillExtractor.extract('We need a MERN stack developer with AWS and Docker experience.');
  console.log(`Text: 'MERN stack developer with AWS and Docker' -> Skills: [${skills.join(', ')}]`);

  // 3. Deduplication Test
  console.log('\nTesting DeduplicationService:');
  const job1 = {
    companyName: 'Google',
    jobRole: 'Software Engineer',
    hiringLocation: { city: 'Mountain View' },
    source: 'indeed'
  };
  const hash1 = DeduplicationService.generateHash(job1);
  const hash2 = DeduplicationService.generateHash({...job1, source: 'linkedin'});
  console.log(`Google SE (Indeed) Hash: ${hash1}`);
  console.log(`Google SE (LinkedIn) Hash: ${hash2}`);
  console.log(`Hashes are ${hash1 === hash2 ? 'SAME' : 'DIFFERENT'} (Expected: DIFFERENT)`);

  console.log('\n--- MODULE 3 UNIT TESTS COMPLETE ---');
};

if (require.main === module) {
  runTests();
}

module.exports = runTests;
