import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.model.js';
import { connectDB } from '../config/database.js';

dotenv.config();

const sampleCourses = [
  {
    name: 'Master of Science in Artificial Intelligence',
    university: {
      name: 'University of Toronto',
      location: {
        city: 'Toronto',
        country: 'Canada',
        coordinates: { lat: 43.6532, lng: -79.3832 }
      },
      ranking: 18,
      acceptanceRate: 43,
      website: 'https://www.utoronto.ca'
    },
    description: 'Comprehensive AI program covering machine learning, deep learning, and neural networks.',
    duration: '2 years',
    fees: {
      currency: 'CAD',
      amount: 45000,
      per: 'year'
    },
    requirements: {
      educationLevel: 'degree',
      minMarks: 75,
      ieltsMin: 7.0,
      toeflMin: 100
    },
    courseContent: [
      'Machine Learning Fundamentals',
      'Deep Learning',
      'Natural Language Processing',
      'Computer Vision',
      'Reinforcement Learning'
    ],
    jobOutcomes: {
      averageSalary: 120000,
      currency: 'CAD',
      topCompanies: ['Google', 'Microsoft', 'Amazon', 'Shopify'],
      placementRate: 92
    },
    category: 'AI',
    level: 'graduate',
    intake: ['Fall', 'Spring'],
    visaSuccessRate: 85,
    studentSatisfaction: 4.5,
    aiFitScore: 8.5,
    source: {
      api: 'manual',
      externalId: 'utoronto-ai-msc'
    }
  },
  {
    name: 'Master of Business Administration',
    university: {
      name: 'Harvard Business School',
      location: {
        city: 'Boston',
        country: 'USA',
        coordinates: { lat: 42.3736, lng: -71.1189 }
      },
      ranking: 1,
      acceptanceRate: 12,
      website: 'https://www.hbs.edu'
    },
    description: 'World-renowned MBA program focusing on leadership and business strategy.',
    duration: '2 years',
    fees: {
      currency: 'USD',
      amount: 73440,
      per: 'year'
    },
    requirements: {
      educationLevel: 'degree',
      minMarks: 85,
      ieltsMin: 7.5,
      toeflMin: 109
    },
    courseContent: [
      'Financial Accounting',
      'Leadership and Organizational Behavior',
      'Marketing',
      'Strategy',
      'Entrepreneurship'
    ],
    jobOutcomes: {
      averageSalary: 150000,
      currency: 'USD',
      topCompanies: ['McKinsey', 'Goldman Sachs', 'Google', 'Amazon'],
      placementRate: 95
    },
    category: 'MBA',
    level: 'graduate',
    intake: ['Fall'],
    visaSuccessRate: 90,
    studentSatisfaction: 4.8,
    aiFitScore: 9.2,
    source: {
      api: 'manual',
      externalId: 'harvard-mba'
    }
  },
  {
    name: 'Bachelor of Computer Science',
    university: {
      name: 'University of Waterloo',
      location: {
        city: 'Waterloo',
        country: 'Canada',
        coordinates: { lat: 43.4723, lng: -80.5449 }
      },
      ranking: 25,
      acceptanceRate: 53,
      website: 'https://uwaterloo.ca'
    },
    description: 'Co-op program with strong industry connections and practical experience.',
    duration: '4 years',
    fees: {
      currency: 'CAD',
      amount: 35000,
      per: 'year'
    },
    requirements: {
      educationLevel: '12th',
      minMarks: 85,
      ieltsMin: 6.5,
      toeflMin: 90
    },
    courseContent: [
      'Data Structures and Algorithms',
      'Software Engineering',
      'Database Systems',
      'Operating Systems',
      'Computer Networks'
    ],
    jobOutcomes: {
      averageSalary: 95000,
      currency: 'CAD',
      topCompanies: ['Google', 'Shopify', 'Amazon', 'Microsoft'],
      placementRate: 96
    },
    category: 'CS',
    level: 'undergraduate',
    intake: ['Fall', 'Spring'],
    visaSuccessRate: 88,
    studentSatisfaction: 4.6,
    aiFitScore: 8.8,
    source: {
      api: 'manual',
      externalId: 'waterloo-cs-bsc'
    }
  }
];

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing courses
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    // Insert sample courses
    const inserted = await Course.insertMany(sampleCourses);
    console.log(`Inserted ${inserted.length} sample courses`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();

