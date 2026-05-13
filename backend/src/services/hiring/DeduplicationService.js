const crypto = require('crypto');

class DeduplicationService {
  static generateHash(job) {
    const { companyName, jobRole, hiringLocation, source } = job;
    const locationStr = hiringLocation ? `${hiringLocation.city || ''}-${hiringLocation.state || ''}` : '';
    
    const input = `${companyName.toLowerCase()}|${jobRole.toLowerCase()}|${locationStr.toLowerCase()}|${source}`;
    
    return crypto.createHash('sha256').update(input).digest('hex');
  }

  static isDuplicate(existingHashes, currentHash) {
    return existingHashes.has(currentHash);
  }
}

module.exports = DeduplicationService;
