import OpenAI from 'openai';
import axios from 'axios';
import { logger } from '../config/logger.js';

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

// Groq API client (free alternative)
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export class AIService {
  static async callAI(messages, useGroq = true) {
    try {
      if (useGroq && process.env.GROQ_API_KEY) {
        if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.trim() === '') {
          throw new Error('GROQ_API_KEY is not set or empty');
        }
        return await this.callGroq(messages);
      } else if (openai && process.env.OPENAI_API_KEY) {
        return await this.callOpenAI(messages);
      } else {
        logger.warn('No AI service configured, using fallback');
        throw new Error('No AI service configured. Please set GROQ_API_KEY or OPENAI_API_KEY');
      }
    } catch (error) {
      logger.error('AI service error:', error.response?.data || error.message);
      throw error;
    }
  }

  static async callGroq(messages) {
    try {
      // Use available Groq models - try different ones if one fails
      // Note: mixtral-8x7b-32768 was decommissioned on March 20, 2025
      // Replaced with mistral-saba-24b and llama-3.3-70b-versatile
      const models = [
        'llama-3.3-70b-versatile',      // Recommended replacement
        'mistral-saba-24b',              // New recommended model
        'llama-3.1-70b-versatile',       // Fallback option
        'llama-3.1-8b-instant'           // Fast fallback option
      ];

      let lastError = null;
      
      for (const model of models) {
        try {
          const response = await axios.post(
            GROQ_API_URL,
            {
              model: model,
              messages: messages,
              temperature: 0.7,
              max_tokens: 4000,
              stream: false
            },
            {
              headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
              },
              timeout: 30000 // 30 second timeout
            }
          );

          if (response.data && response.data.choices && response.data.choices[0]) {
            return response.data.choices[0].message.content;
          }
        } catch (error) {
          lastError = error;
          logger.warn(`Groq model ${model} failed, trying next...`);
          continue;
        }
      }

      throw lastError || new Error('All Groq models failed');
    } catch (error) {
      logger.error('Groq API error:', error.response?.data || error.message);
      throw new Error(`Groq API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  static async callOpenAI(messages) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.7,
      max_tokens: 2000
    });

    return response.choices[0].message.content;
  }

  static async filterCourses(userProfile, courses) {
    const prompt = `You are an AI education counselor. Analyze this student profile and recommend the best-fit courses from the provided list.

Student Profile:
- Country Preference: ${userProfile.country}
- Education Level: ${userProfile.educationLevel}
- Marks: 10th: ${userProfile.marks?.tenth || 'N/A'}, 12th: ${userProfile.marks?.twelfth || 'N/A'}, Degree: ${userProfile.marks?.degree || 'N/A'}
- IELTS Score: ${userProfile.ieltsScore || 'N/A'}
- Budget: ${userProfile.budget || 'N/A'} ${userProfile.budgetCurrency || 'USD'}
- Preferred Course: ${userProfile.preferredCourse}
- Status: ${userProfile.passedStatus}

Available Courses:
${JSON.stringify(courses.slice(0, 20), null, 2)}

For each course, provide:
1. Acceptance Probability (low/medium/high)
2. Fit Score (1-10)
3. One-sentence justification
4. Key strengths for this student

Return JSON format:
{
  "recommendations": [
    {
      "courseId": "...",
      "acceptanceProbability": "high|medium|low",
      "fitScore": 8,
      "justification": "...",
      "strengths": ["...", "..."]
    }
  ]
}`;

    const messages = [
      { role: 'system', content: 'You are an expert education counselor helping students find the best courses.' },
      { role: 'user', content: prompt }
    ];

    const response = await this.callAI(messages);
    
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { recommendations: [] };
    } catch (error) {
      logger.error('Failed to parse AI response:', error);
      return { recommendations: [] };
    }
  }

  static async compareCourses(course1, course2, userProfile) {
    // Simplify course data to avoid token limits
    const simplifiedCourse1 = {
      name: course1.name,
      university: course1.university?.name,
      ranking: course1.university?.ranking,
      acceptanceRate: course1.university?.acceptanceRate,
      fees: course1.fees,
      location: course1.university?.location,
      category: course1.category,
      requirements: course1.requirements,
      jobOutcomes: course1.jobOutcomes,
      duration: course1.duration
    };

    const simplifiedCourse2 = {
      name: course2.name,
      university: course2.university?.name,
      ranking: course2.university?.ranking,
      acceptanceRate: course2.university?.acceptanceRate,
      fees: course2.fees,
      location: course2.university?.location,
      category: course2.category,
      requirements: course2.requirements,
      jobOutcomes: course2.jobOutcomes,
      duration: course2.duration
    };

    const prompt = `Compare these two university courses and provide a recommendation.

Student Profile:
- Country: ${userProfile?.country || 'Any'}
- Education Level: ${userProfile?.educationLevel || 'N/A'}
- Budget: ${userProfile?.budget || 'N/A'}

Course 1: ${simplifiedCourse1.name} at ${simplifiedCourse1.university}
Course 2: ${simplifiedCourse2.name} at ${simplifiedCourse2.university}

Compare:
1. Fees
2. Ranking
3. Acceptance Rate
4. Job Outcomes
5. Location
6. Overall Recommendation

Return ONLY valid JSON:
{
  "comparison": {
    "fees": "Brief comparison",
    "ranking": "Brief comparison",
    "acceptanceRate": "Brief comparison",
    "courseContent": "Brief comparison",
    "jobOutcomes": "Brief comparison",
    "companyTieUps": "Brief comparison",
    "campusLife": "Brief comparison",
    "roiScore": "Brief comparison",
    "visaSuccessRate": "Brief comparison"
  },
  "verdict": "Which course is better and why",
  "recommendation": "Final recommendation"
}`;

    const messages = [
      { role: 'system', content: 'You are an expert education counselor. Always respond with valid JSON only.' },
      { role: 'user', content: prompt }
    ];

    try {
      const response = await this.callAI(messages);
      
      if (!response) {
        return this.generateFallbackComparison(course1, course2);
      }

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      logger.warn('No JSON found in comparison response');
      return this.generateFallbackComparison(course1, course2);
    } catch (error) {
      logger.error('Failed to parse AI comparison response:', error);
      return this.generateFallbackComparison(course1, course2);
    }
  }

  static generateFallbackComparison(course1, course2) {
    // Fallback comparison if AI fails
    const comparison = {
      fees: `Course 1: ${course1.fees?.currency} ${course1.fees?.amount || 'N/A'}. Course 2: ${course2.fees?.currency} ${course2.fees?.amount || 'N/A'}`,
      ranking: `Course 1: Rank #${course1.university?.ranking || 'N/A'}. Course 2: Rank #${course2.university?.ranking || 'N/A'}`,
      acceptanceRate: `Course 1: ${course1.university?.acceptanceRate || 'N/A'}%. Course 2: ${course2.university?.acceptanceRate || 'N/A'}%`,
      courseContent: 'Both courses offer comprehensive curriculum in their respective fields.',
      jobOutcomes: `Course 1: ${course1.jobOutcomes?.averageSalary || 'N/A'} avg salary. Course 2: ${course2.jobOutcomes?.averageSalary || 'N/A'} avg salary`,
      companyTieUps: 'Both universities have strong industry connections.',
      campusLife: `Course 1: ${course1.university?.location?.country}. Course 2: ${course2.university?.location?.country}`,
      roiScore: 'Both offer good return on investment.',
      visaSuccessRate: 'Both have good visa success rates for international students.'
    };

    const verdict = course1.university?.ranking < course2.university?.ranking 
      ? `${course1.university?.name} is ranked higher and may offer better opportunities.`
      : `${course2.university?.name} is ranked higher and may offer better opportunities.`;

    return {
      comparison,
      verdict,
      recommendation: 'Consider factors like location preference, budget, and career goals when making your decision.'
    };
  }

  static async generateRecommendations(userProfile, courses) {
    return await this.filterCourses(userProfile, courses);
  }
}

