/**
 * Utility to safely parse and repair JSON from AI responses
 */
const safeJsonParse = (text) => {
  try {
    // 1. Clean up markdown code blocks if present
    const cleanedText = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    
    return JSON.parse(cleanedText);
  } catch (error) {
    // 2. Simple repair: find the first '{' and last '}'
    try {
      const startIndex = text.indexOf('{');
      const endIndex = text.lastIndexOf('}');
      if (startIndex !== -1 && endIndex !== -1) {
        const jsonOnly = text.substring(startIndex, endIndex + 1);
        return JSON.parse(jsonOnly);
      }
    } catch (innerError) {
      console.error('JSON Repair failed:', innerError);
    }
    throw new Error('Invalid JSON format from AI response');
  }
};

module.exports = { safeJsonParse };
