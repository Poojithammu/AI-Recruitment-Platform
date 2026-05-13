class NormalizationService {
  static normalizeExperience(rawExp) {
    if (!rawExp) return { min: 0, max: 0, raw: '' };
    
    const text = rawExp.toLowerCase();
    let min = 0;
    let max = 0;

    // Handle ranges like "3-5 years", "3 to 5", "3 - 5"
    const rangeMatch = text.match(/(\d+)\s*(?:-|to)\s*(\d+)/);
    if (rangeMatch) {
      min = parseInt(rangeMatch[1]);
      max = parseInt(rangeMatch[2]);
    } else {
      // Handle "3+ years", "> 3 years"
      const plusMatch = text.match(/(\d+)\s*\+/);
      if (plusMatch) {
        min = parseInt(plusMatch[1]);
        max = min + 5; // Default max if unspecified
      } else {
        // Single number
        const singleMatch = text.match(/(\d+)/);
        if (singleMatch) {
          min = parseInt(singleMatch[1]);
          max = min;
        }
      }
    }

    // Keyword based
    if (text.includes('fresher') || text.includes('entry level')) {
      min = 0;
      max = 1;
    } else if (text.includes('mid') || text.includes('intermediate')) {
      if (min === 0) min = 3;
      if (max === 0) max = 6;
    } else if (text.includes('senior') || text.includes('sr.')) {
      if (min === 0) min = 6;
      if (max === 0) max = 15;
    }

    return { min, max, raw: rawExp };
  }

  static normalizeLocation(rawLoc) {
    if (!rawLoc) return { city: '', state: '', country: '', remote: false };

    const text = rawLoc.toLowerCase();
    const result = {
      city: '',
      state: '',
      country: '',
      remote: text.includes('remote') || text.includes('anywhere')
    };

    // Simple splitting logic, can be improved with a library or API
    const parts = rawLoc.split(',').map(p => p.trim());
    if (parts.length >= 1) result.city = parts[0];
    if (parts.length >= 2) result.country = parts[parts.length - 1];
    if (parts.length === 3) result.state = parts[1];

    return result;
  }

  static normalizeEmploymentType(rawType) {
    if (!rawType) return 'full-time';
    
    const text = rawType.toLowerCase();
    if (text.includes('contract')) return 'contract';
    if (text.includes('intern')) return 'internship';
    if (text.includes('freelance')) return 'freelance';
    if (text.includes('hybrid')) return 'hybrid';
    
    return 'full-time';
  }
}

module.exports = NormalizationService;
