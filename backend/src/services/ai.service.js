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
              max_tokens: 2000, // Reduced to avoid token limit errors
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

  // Helper function to simplify course data for AI processing
  static simplifyCourseData(courses) {
    return courses.map(course => ({
      _id: course._id?.toString(),
      name: course.name,
      university: course.university?.name || 'N/A',
      country: course.university?.location?.country || 'N/A',
      fees: course.fees?.amount ? `${course.fees.currency} ${course.fees.amount}` : 'N/A',
      ranking: course.university?.ranking || null,
      acceptanceRate: course.university?.acceptanceRate || null,
      ieltsMin: course.requirements?.ieltsMin || null,
      minMarks: course.requirements?.minMarks || null,
      category: course.category || 'N/A',
      level: course.level || 'N/A'
    }));
  }

  static async filterCourses(userProfile, courses) {
    // Limit to 10 courses and simplify data to reduce token usage
    const limitedCourses = courses.slice(0, 10);
    const simplifiedCourses = this.simplifyCourseData(limitedCourses);
    
    const prompt = `Analyze student profile and recommend best-fit courses.

Student:
- Country: ${userProfile.country || 'Any'}
- Level: ${userProfile.educationLevel || 'N/A'}
- Marks: 10th:${userProfile.marks?.tenth || 'N/A'}, 12th:${userProfile.marks?.twelfth || 'N/A'}, Degree:${userProfile.marks?.degree || 'N/A'}
- IELTS: ${userProfile.ieltsScore || 'N/A'}
- Budget: ${userProfile.budget || 'N/A'} ${userProfile.budgetCurrency || 'USD'}
- Course: ${userProfile.preferredCourse || 'Any'}

Courses (${simplifiedCourses.length}):
${JSON.stringify(simplifiedCourses)}

For each course, return JSON:
{
  "recommendations": [
    {
      "courseId": "course _id",
      "acceptanceProbability": "high|medium|low",
      "fitScore": 8,
      "justification": "one sentence",
      "strengths": ["strength1", "strength2"]
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
    // Simplify course data to minimize token usage
    const simplifiedCourse1 = {
      name: course1.name,
      university: course1.university?.name,
      ranking: course1.university?.ranking,
      acceptanceRate: course1.university?.acceptanceRate,
      fees: course1.fees?.amount ? `${course1.fees.currency} ${course1.fees.amount}` : 'N/A',
      country: course1.university?.location?.country,
      salary: course1.jobOutcomes?.averageSalary || null,
      ieltsMin: course1.requirements?.ieltsMin || null
    };

    const simplifiedCourse2 = {
      name: course2.name,
      university: course2.university?.name,
      ranking: course2.university?.ranking,
      acceptanceRate: course2.university?.acceptanceRate,
      fees: course2.fees?.amount ? `${course2.fees.currency} ${course2.fees.amount}` : 'N/A',
      country: course2.university?.location?.country,
      salary: course2.jobOutcomes?.averageSalary || null,
      ieltsMin: course2.requirements?.ieltsMin || null
    };

    const prompt = `Compare 2 courses and recommend.

Student: Country:${userProfile?.country || 'Any'}, Budget:${userProfile?.budget || 'N/A'}

Course 1: ${simplifiedCourse1.name} @ ${simplifiedCourse1.university}
- Fees: ${simplifiedCourse1.fees}
- Rank: ${simplifiedCourse1.ranking || 'N/A'}
- Acceptance: ${simplifiedCourse1.acceptanceRate || 'N/A'}%
- Country: ${simplifiedCourse1.country || 'N/A'}
- Salary: ${simplifiedCourse1.salary || 'N/A'}
- IELTS: ${simplifiedCourse1.ieltsMin || 'N/A'}

Course 2: ${simplifiedCourse2.name} @ ${simplifiedCourse2.university}
- Fees: ${simplifiedCourse2.fees}
- Rank: ${simplifiedCourse2.ranking || 'N/A'}
- Acceptance: ${simplifiedCourse2.acceptanceRate || 'N/A'}%
- Country: ${simplifiedCourse2.country || 'N/A'}
- Salary: ${simplifiedCourse2.salary || 'N/A'}
- IELTS: ${simplifiedCourse2.ieltsMin || 'N/A'}

Return JSON only:
{
  "comparison": {
    "fees": "brief",
    "ranking": "brief",
    "acceptanceRate": "brief",
    "courseContent": "brief",
    "jobOutcomes": "brief",
    "companyTieUps": "brief",
    "campusLife": "brief",
    "roiScore": "brief",
    "visaSuccessRate": "brief"
  },
  "verdict": "which is better",
  "recommendation": "final rec"
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

