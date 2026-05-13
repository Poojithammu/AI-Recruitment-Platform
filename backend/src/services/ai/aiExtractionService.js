const OpenAI = require('openai');

class AIExtractionService {
  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey: apiKey,
        baseURL: 'https://api.groq.com/openai/v1'
      });
    }
  }

  async extractRequirements(jobDescription) {
    try {
      if (!this.openai) {
        throw new Error('GROQ_API_KEY is not configured');
      }

      const response = await this.openai.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a hiring intelligence AI. Extract structured data from the following job description. Return ONLY a JSON object."
          },
          {
            role: "user",
            content: `Extract from this JD:
            
            ${jobDescription}

            JSON STRUCTURE:
            {
              "role": "string",
              "skills": ["array of strings"],
              "experience": "string",
              "employment_type": "string",
              "seniority_level": "string",
              "domain": "string",
              "tools": ["array of strings"],
              "responsibilities": ["array of strings"]
            }`
          }
        ],
        response_format: { type: "json_object" }
      });

      const text = response.choices[0].message.content;
      const parsedJSON = JSON.parse(text);
      return parsedJSON;
    } catch (error) {
      console.error('Error in AI extraction:', error);
      throw new Error('Failed to extract requirements from JD');
    }
  }
}

module.exports = new AIExtractionService();
