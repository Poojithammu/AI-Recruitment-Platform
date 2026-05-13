const CareerPageCollector = require('../../collectors/CareerPageCollector');
const StartupPlatformCollector = require('../../collectors/StartupPlatformCollector');
const IndeedCollector = require('../../collectors/IndeedCollector');
const InstahyreCollector = require('../../collectors/InstahyreCollector');
const LinkedInCollector = require('../../collectors/LinkedInCollector');

const NormalizationService = require('../../parsers/NormalizationService');
const SkillExtractor = require('../../parsers/SkillExtractor');
const DeduplicationService = require('./DeduplicationService');
const ResilienceService = require('./ResilienceService');
const HiringJob = require('../../models/HiringJob');
const Job = require('../../models/Job');
const Company = require('../../models/Company');
const TrendAnalysisService = require('../analytics/trendAnalysisService');
const LeadScoringService = require('../scoring/leadScoringService');
const logger = require('../../utils/logger');

class CrawlerOrchestrator {
  constructor() {
    this.collectors = [
      new CareerPageCollector(),
      new StartupPlatformCollector(),
      new IndeedCollector(),
      new InstahyreCollector(),
      new LinkedInCollector()
    ];
    this.isCrawling = false;
  }

  async runAll() {
    if (this.isCrawling) {
      logger.warn('Crawler is already running. Skipping this execution.');
      return null;
    }

    this.isCrawling = true;
    logger.info('--- CRAWLER ORCHESTRATION START ---');
    
    const summary = {
      totalCollected: 0,
      inserted: 0,
      duplicates: 0,
      failed: 0,
      sourceBreakdown: {}
    };

    const existingJobs = await HiringJob.find({}, 'hash');
    const existingHashes = new Set(existingJobs.map(j => j.hash));

    for (const collector of this.collectors) {
      try {
        const rawJobs = await ResilienceService.retry(
          () => collector.collect(), 
          collector.sourceName
        );

        summary.sourceBreakdown[collector.sourceName] = {
          collected: rawJobs.length,
          inserted: 0,
          duplicates: 0,
          failed: 0
        };

        for (const rawJob of rawJobs) {
          summary.totalCollected++;
          try {
            // 1. Normalize
            const normalizedJob = this.normalizeJob(rawJob);
            
            // 2. Extract Skills
            normalizedJob.requiredSkills = SkillExtractor.extract(normalizedJob.jobDescription);
            
            // 3. Deduplicate
            const hash = DeduplicationService.generateHash(normalizedJob);
            normalizedJob.hash = hash;

            if (DeduplicationService.isDuplicate(existingHashes, hash)) {
              summary.duplicates++;
              summary.sourceBreakdown[collector.sourceName].duplicates++;
              continue;
            }

            // 4. Resolve Company
            const company = await this.resolveCompany(normalizedJob.companyName);
            normalizedJob.companyId = company._id;

            // 5. Store in HiringJob (Detailed/Raw)
            await HiringJob.create(normalizedJob);
            
            // 6. Store in Job (Normalized for Analytics)
            await Job.create({
              companyId: company._id,
              role: normalizedJob.jobRole,
              skills: normalizedJob.requiredSkills,
              experience: normalizedJob.experienceRequired?.raw || '',
              location: normalizedJob.hiringLocation?.city || '',
              salary: normalizedJob.salary?.raw || '',
              jobDescription: normalizedJob.jobDescription,
              jobUrl: normalizedJob.sourceUrl,
              postedDate: normalizedJob.postedDate,
              source: normalizedJob.source
            });

            existingHashes.add(hash);
            
            summary.inserted++;
            summary.sourceBreakdown[collector.sourceName].inserted++;

            // 7. Calculate Lead Score for this company (Async)
            LeadScoringService.calculateLeadScore(company._id).catch(err => {
              logger.error(`Lead scoring failed for ${company.companyName}: ${err.message}`);
            });

          } catch (err) {
            logger.error(`Error processing job from ${collector.sourceName}: ${err.message}`);
            summary.failed++;
            summary.sourceBreakdown[collector.sourceName].failed++;
          }
        }
      } catch (err) {
        logger.error(`Collector ${collector.sourceName} failed completely: ${err.message}`);
      }
    }

    this.isCrawling = false;
    logger.info('--- CRAWLER ORCHESTRATION COMPLETE ---');
    logger.info('Summary: %o', summary);

    // 8. Trigger Trend Analysis after collection
    try {
      logger.info('Starting post-crawl trend analysis...');
      await TrendAnalysisService.analyzeHiringTrends();
      logger.info('Trend analysis completed.');
    } catch (err) {
      logger.error(`Post-crawl trend analysis failed: ${err.message}`);
    }

    return summary;
  }

  async resolveCompany(companyName) {
    let company = await Company.findOne({ companyName: new RegExp(`^${companyName}$`, 'i') });
    
    if (!company) {
      logger.info(`Creating new company entry for: ${companyName}`);
      company = await Company.create({
        companyName,
        description: `Company information for ${companyName}`
      });
    }
    
    return company;
  }

  normalizeJob(rawJob) {
    return {
      ...rawJob,
      experienceRequired: NormalizationService.normalizeExperience(rawJob.experienceRequired),
      hiringLocation: NormalizationService.normalizeLocation(rawJob.hiringLocation),
      employmentType: NormalizationService.normalizeEmploymentType(rawJob.employmentType),
      scrapedAt: new Date(),
      isActive: true
    };
  }
}

module.exports = new CrawlerOrchestrator();
