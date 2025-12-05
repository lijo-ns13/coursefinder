import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.model.js';
import { connectDB } from '../config/database.js';
import { logger } from '../config/logger.js';

dotenv.config();

const accurateCourses = [
  // AI & Machine Learning Courses
  {
    name: 'Master of Science in Artificial Intelligence',
    university: {
      name: 'Massachusetts Institute of Technology',
      location: {
        city: 'Cambridge',
        country: 'USA',
        coordinates: { lat: 42.3601, lng: -71.0942 }
      },
      ranking: 1,
      acceptanceRate: 7,
      website: 'https://www.mit.edu'
    },
    description: 'Comprehensive AI program covering machine learning, deep learning, neural networks, and AI ethics.',
    duration: '2 years',
    fees: {
      currency: 'USD',
      amount: 53790,
      per: 'year'
    },
    requirements: {
      educationLevel: 'degree',
      minMarks: 90,
      ieltsMin: 7.0,
      toeflMin: 100,
      other: ['GRE required', 'Strong math background']
    },
    courseContent: [
      'Machine Learning Fundamentals',
      'Deep Learning and Neural Networks',
      'Natural Language Processing',
      'Computer Vision',
      'Reinforcement Learning',
      'AI Ethics and Society'
    ],
    jobOutcomes: {
      averageSalary: 150000,
      currency: 'USD',
      topCompanies: ['Google', 'OpenAI', 'Microsoft', 'Amazon', 'Meta'],
      placementRate: 98
    },
    images: [],
    category: 'AI',
    level: 'graduate',
    intake: ['Fall'],
    applicationDeadline: new Date('2024-12-15'),
    visaSuccessRate: 95,
    studentSatisfaction: 4.8,
    aiFitScore: 9.5,
    source: {
      api: 'manual',
      externalId: 'mit-ai-msc'
    }
  },
  {
    name: 'Master of Science in Computer Science - AI Specialization',
    university: {
      name: 'Stanford University',
      location: {
        city: 'Stanford',
        country: 'USA',
        coordinates: { lat: 37.4275, lng: -122.1697 }
      },
      ranking: 2,
      acceptanceRate: 5,
      website: 'https://www.stanford.edu'
    },
    description: 'World-renowned CS program with AI specialization, featuring cutting-edge research opportunities.',
    duration: '2 years',
    fees: {
      currency: 'USD',
      amount: 56159,
      per: 'year'
    },
    requirements: {
      educationLevel: 'degree',
      minMarks: 88,
      ieltsMin: 7.0,
      toeflMin: 100,
      other: ['GRE required', 'Research experience preferred']
    },
    courseContent: [
      'Introduction to Artificial Intelligence',
      'Machine Learning',
      'Deep Learning',
      'Natural Language Understanding',
      'Robotics',
      'Computer Vision'
    ],
    jobOutcomes: {
      averageSalary: 145000,
      currency: 'USD',
      topCompanies: ['Google', 'Apple', 'Tesla', 'NVIDIA', 'Amazon'],
      placementRate: 97
    },
    category: 'AI',
    level: 'graduate',
    intake: ['Fall'],
    visaSuccessRate: 93,
    studentSatisfaction: 4.7,
    aiFitScore: 9.3,
    source: {
      api: 'manual',
      externalId: 'stanford-cs-ai'
    }
  },
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
    description: 'Leading AI program in Canada with strong industry connections and co-op opportunities.',
    duration: '2 years',
    fees: {
      currency: 'CAD',
      amount: 45000,
      per: 'year'
    },
    requirements: {
      educationLevel: 'degree',
      minMarks: 80,
      ieltsMin: 7.0,
      toeflMin: 93,
      other: ['Strong programming background']
    },
    courseContent: [
      'Machine Learning',
      'Deep Learning',
      'Natural Language Processing',
      'Computer Vision',
      'Reinforcement Learning'
    ],
    jobOutcomes: {
      averageSalary: 120000,
      currency: 'CAD',
      topCompanies: ['Google', 'Microsoft', 'Amazon', 'Shopify', 'Uber'],
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
  // Computer Science Courses
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
    description: 'Co-op program with strong industry connections. 96% placement rate with top tech companies.',
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
      toeflMin: 90,
      other: ['Strong math and programming background']
    },
    courseContent: [
      'Data Structures and Algorithms',
      'Software Engineering',
      'Database Systems',
      'Operating Systems',
      'Computer Networks',
      'Web Development'
    ],
    jobOutcomes: {
      averageSalary: 95000,
      currency: 'CAD',
      topCompanies: ['Google', 'Shopify', 'Amazon', 'Microsoft', 'Meta'],
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
  },
  {
    name: 'Master of Science in Computer Science',
    university: {
      name: 'Carnegie Mellon University',
      location: {
        city: 'Pittsburgh',
        country: 'USA',
        coordinates: { lat: 40.4426, lng: -79.9459 }
      },
      ranking: 3,
      acceptanceRate: 17,
      website: 'https://www.cmu.edu'
    },
    description: 'Top-ranked CS program with emphasis on research and innovation.',
    duration: '2 years',
    fees: {
      currency: 'USD',
      amount: 52000,
      per: 'year'
    },
    requirements: {
      educationLevel: 'degree',
      minMarks: 85,
      ieltsMin: 7.0,
      toeflMin: 100,
      other: ['GRE required']
    },
    courseContent: [
      'Advanced Algorithms',
      'Distributed Systems',
      'Machine Learning',
      'Computer Graphics',
      'Software Engineering'
    ],
    jobOutcomes: {
      averageSalary: 140000,
      currency: 'USD',
      topCompanies: ['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta'],
      placementRate: 95
    },
    category: 'CS',
    level: 'graduate',
    intake: ['Fall'],
    visaSuccessRate: 90,
    studentSatisfaction: 4.7,
    aiFitScore: 9.0,
    source: {
      api: 'manual',
      externalId: 'cmu-cs-msc'
    }
  },
  // MBA Courses
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
    description: 'World-renowned MBA program focusing on leadership, strategy, and global business.',
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
      toeflMin: 109,
      other: ['GMAT/GRE required', 'Work experience preferred']
    },
    courseContent: [
      'Financial Accounting',
      'Leadership and Organizational Behavior',
      'Marketing',
      'Strategy',
      'Entrepreneurship',
      'Global Business'
    ],
    jobOutcomes: {
      averageSalary: 150000,
      currency: 'USD',
      topCompanies: ['McKinsey', 'Goldman Sachs', 'Google', 'Amazon', 'Bain'],
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
    name: 'Master of Business Administration',
    university: {
      name: 'London Business School',
      location: {
        city: 'London',
        country: 'UK',
        coordinates: { lat: 51.5200, lng: -0.1586 }
      },
      ranking: 2,
      acceptanceRate: 25,
      website: 'https://www.london.edu'
    },
    description: 'Premier European MBA with strong global network and London location advantage.',
    duration: '21 months',
    fees: {
      currency: 'GBP',
      amount: 95000,
      per: 'total'
    },
    requirements: {
      educationLevel: 'degree',
      minMarks: 80,
      ieltsMin: 7.5,
      toeflMin: 110,
      other: ['GMAT required', 'Minimum 3 years work experience']
    },
    courseContent: [
      'Global Business Strategy',
      'Financial Management',
      'Marketing Management',
      'Leadership',
      'Entrepreneurship',
      'Operations Management'
    ],
    jobOutcomes: {
      averageSalary: 120000,
      currency: 'GBP',
      topCompanies: ['McKinsey', 'BCG', 'Goldman Sachs', 'Amazon', 'Google'],
      placementRate: 93
    },
    category: 'MBA',
    level: 'graduate',
    intake: ['Fall'],
    visaSuccessRate: 85,
    studentSatisfaction: 4.6,
    aiFitScore: 8.9,
    source: {
      api: 'manual',
      externalId: 'london-mba'
    }
  },
  {
    name: 'Master of Business Administration',
    university: {
      name: 'INSEAD',
      location: {
        city: 'Fontainebleau',
        country: 'France',
        coordinates: { lat: 48.4042, lng: 2.7019 }
      },
      ranking: 3,
      acceptanceRate: 30,
      website: 'https://www.insead.edu'
    },
    description: 'Top-ranked international MBA with campuses in Europe, Asia, and Middle East.',
    duration: '10 months',
    fees: {
      currency: 'EUR',
      amount: 89000,
      per: 'total'
    },
    requirements: {
      educationLevel: 'degree',
      minMarks: 75,
      ieltsMin: 7.5,
      toeflMin: 105,
      other: ['GMAT required', 'Work experience required']
    },
    courseContent: [
      'Global Strategy',
      'Financial Markets',
      'Marketing',
      'Organizational Behavior',
      'Operations Management',
      'Entrepreneurship'
    ],
    jobOutcomes: {
      averageSalary: 110000,
      currency: 'EUR',
      topCompanies: ['McKinsey', 'BCG', 'Amazon', 'Google', 'Microsoft'],
      placementRate: 92
    },
    category: 'MBA',
    level: 'graduate',
    intake: ['Fall', 'Spring'],
    visaSuccessRate: 88,
    studentSatisfaction: 4.7,
    aiFitScore: 8.8,
    source: {
      api: 'manual',
      externalId: 'insead-mba'
    }
  },
  // Engineering Courses
  {
    name: 'Master of Engineering in Software Engineering',
    university: {
      name: 'University of California, Berkeley',
      location: {
        city: 'Berkeley',
        country: 'USA',
        coordinates: { lat: 37.8719, lng: -122.2585 }
      },
      ranking: 4,
      acceptanceRate: 17,
      website: 'https://www.berkeley.edu'
    },
    description: 'Leading software engineering program with focus on scalable systems and modern practices.',
    duration: '1.5 years',
    fees: {
      currency: 'USD',
      amount: 28000,
      per: 'year'
    },
    requirements: {
      educationLevel: 'degree',
      minMarks: 85,
      ieltsMin: 7.0,
      toeflMin: 90,
      other: ['Strong CS background']
    },
    courseContent: [
      'Software Architecture',
      'Distributed Systems',
      'Cloud Computing',
      'DevOps',
      'Agile Development',
      'System Design'
    ],
    jobOutcomes: {
      averageSalary: 130000,
      currency: 'USD',
      topCompanies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix'],
      placementRate: 94
    },
    category: 'Engineering',
    level: 'graduate',
    intake: ['Fall', 'Spring'],
    visaSuccessRate: 87,
    studentSatisfaction: 4.6,
    aiFitScore: 8.7,
    source: {
      api: 'manual',
      externalId: 'berkeley-se-meng'
    }
  },
  {
    name: 'Bachelor of Engineering in Computer Engineering',
    university: {
      name: 'University of British Columbia',
      location: {
        city: 'Vancouver',
        country: 'Canada',
        coordinates: { lat: 49.2606, lng: -123.2460 }
      },
      ranking: 34,
      acceptanceRate: 52,
      website: 'https://www.ubc.ca'
    },
    description: 'Comprehensive computer engineering program combining hardware and software.',
    duration: '4 years',
    fees: {
      currency: 'CAD',
      amount: 42000,
      per: 'year'
    },
    requirements: {
      educationLevel: '12th',
      minMarks: 88,
      ieltsMin: 6.5,
      toeflMin: 90,
      other: ['Strong math and physics background']
    },
    courseContent: [
      'Digital Systems',
      'Computer Architecture',
      'Embedded Systems',
      'Software Engineering',
      'Networks',
      'Microprocessors'
    ],
    jobOutcomes: {
      averageSalary: 85000,
      currency: 'CAD',
      topCompanies: ['AMD', 'Intel', 'Microsoft', 'Amazon', 'Apple'],
      placementRate: 91
    },
    category: 'Engineering',
    level: 'undergraduate',
    intake: ['Fall'],
    visaSuccessRate: 82,
    studentSatisfaction: 4.4,
    aiFitScore: 8.2,
    source: {
      api: 'manual',
      externalId: 'ubc-ce-beng'
    }
  },
  // Nursing Courses
  {
    name: 'Bachelor of Science in Nursing',
    university: {
      name: 'Johns Hopkins University',
      location: {
        city: 'Baltimore',
        country: 'USA',
        coordinates: { lat: 39.3292, lng: -76.6200 }
      },
      ranking: 9,
      acceptanceRate: 11,
      website: 'https://www.jhu.edu'
    },
    description: 'Top-ranked nursing program with excellent clinical placements and research opportunities.',
    duration: '4 years',
    fees: {
      currency: 'USD',
      amount: 58000,
      per: 'year'
    },
    requirements: {
      educationLevel: '12th',
      minMarks: 90,
      ieltsMin: 7.0,
      toeflMin: 100,
      other: ['Biology and Chemistry prerequisites']
    },
    courseContent: [
      'Anatomy and Physiology',
      'Nursing Fundamentals',
      'Pharmacology',
      'Medical-Surgical Nursing',
      'Pediatric Nursing',
      'Community Health'
    ],
    jobOutcomes: {
      averageSalary: 75000,
      currency: 'USD',
      topCompanies: ['Johns Hopkins Hospital', 'Mayo Clinic', 'Cleveland Clinic'],
      placementRate: 98
    },
    category: 'Nursing',
    level: 'undergraduate',
    intake: ['Fall'],
    visaSuccessRate: 88,
    studentSatisfaction: 4.5,
    aiFitScore: 8.3,
    source: {
      api: 'manual',
      externalId: 'jhu-nursing-bsn'
    }
  },
  {
    name: 'Master of Science in Nursing',
    university: {
      name: 'University of Toronto',
      location: {
        city: 'Toronto',
        country: 'Canada',
        coordinates: { lat: 43.6532, lng: -79.3832 }
      },
      ranking: 18,
      acceptanceRate: 45,
      website: 'https://www.utoronto.ca'
    },
    description: 'Advanced nursing program with specialization options in various clinical areas.',
    duration: '2 years',
    fees: {
      currency: 'CAD',
      amount: 25000,
      per: 'year'
    },
    requirements: {
      educationLevel: 'degree',
      minMarks: 80,
      ieltsMin: 7.0,
      toeflMin: 93,
      other: ['RN license required', 'Clinical experience']
    },
    courseContent: [
      'Advanced Nursing Practice',
      'Health Policy',
      'Research Methods',
      'Clinical Specialization',
      'Leadership in Nursing',
      'Evidence-Based Practice'
    ],
    jobOutcomes: {
      averageSalary: 95000,
      currency: 'CAD',
      topCompanies: ['Toronto General Hospital', 'SickKids', 'Sunnybrook'],
      placementRate: 95
    },
    category: 'Nursing',
    level: 'graduate',
    intake: ['Fall', 'Spring'],
    visaSuccessRate: 85,
    studentSatisfaction: 4.4,
    aiFitScore: 8.1,
    source: {
      api: 'manual',
      externalId: 'utoronto-nursing-msn'
    }
  },
  // Medicine Courses
  {
    name: 'Doctor of Medicine (MD)',
    university: {
      name: 'Harvard Medical School',
      location: {
        city: 'Boston',
        country: 'USA',
        coordinates: { lat: 42.3358, lng: -71.1025 }
      },
      ranking: 1,
      acceptanceRate: 3,
      website: 'https://hms.harvard.edu'
    },
    description: 'World\'s top medical school with exceptional clinical training and research opportunities.',
    duration: '4 years',
    fees: {
      currency: 'USD',
      amount: 65000,
      per: 'year'
    },
    requirements: {
      educationLevel: 'degree',
      minMarks: 95,
      ieltsMin: 7.5,
      toeflMin: 100,
      other: ['MCAT required', 'Pre-med prerequisites', 'Research experience']
    },
    courseContent: [
      'Anatomy',
      'Physiology',
      'Biochemistry',
      'Pathology',
      'Pharmacology',
      'Clinical Medicine'
    ],
    jobOutcomes: {
      averageSalary: 200000,
      currency: 'USD',
      topCompanies: ['Mass General Hospital', 'Brigham and Women\'s', 'Boston Children\'s'],
      placementRate: 99
    },
    category: 'Medicine',
    level: 'graduate',
    intake: ['Fall'],
    visaSuccessRate: 92,
    studentSatisfaction: 4.9,
    aiFitScore: 9.8,
    source: {
      api: 'manual',
      externalId: 'harvard-md'
    }
  },
  // Business Courses
  {
    name: 'Master of Science in Business Analytics',
    university: {
      name: 'MIT Sloan School of Management',
      location: {
        city: 'Cambridge',
        country: 'USA',
        coordinates: { lat: 42.3601, lng: -71.0942 }
      },
      ranking: 1,
      acceptanceRate: 14,
      website: 'https://mitsloan.mit.edu'
    },
    description: 'Cutting-edge business analytics program combining data science with business strategy.',
    duration: '12 months',
    fees: {
      currency: 'USD',
      amount: 77000,
      per: 'total'
    },
    requirements: {
      educationLevel: 'degree',
      minMarks: 88,
      ieltsMin: 7.0,
      toeflMin: 100,
      other: ['GMAT/GRE required', 'Strong quantitative background']
    },
    courseContent: [
      'Data Science',
      'Machine Learning for Business',
      'Business Strategy',
      'Data Visualization',
      'Predictive Analytics',
      'Big Data'
    ],
    jobOutcomes: {
      averageSalary: 135000,
      currency: 'USD',
      topCompanies: ['Google', 'Amazon', 'Microsoft', 'McKinsey', 'BCG'],
      placementRate: 96
    },
    category: 'Business',
    level: 'graduate',
    intake: ['Fall'],
    visaSuccessRate: 89,
    studentSatisfaction: 4.7,
    aiFitScore: 9.1,
    source: {
      api: 'manual',
      externalId: 'mit-business-analytics'
    }
  },
  // Law Courses
  {
    name: 'Juris Doctor (JD)',
    university: {
      name: 'Yale Law School',
      location: {
        city: 'New Haven',
        country: 'USA',
        coordinates: { lat: 41.3083, lng: -72.9279 }
      },
      ranking: 1,
      acceptanceRate: 7,
      website: 'https://law.yale.edu'
    },
    description: 'Top-ranked law school with exceptional faculty and career outcomes.',
    duration: '3 years',
    fees: {
      currency: 'USD',
      amount: 67000,
      per: 'year'
    },
    requirements: {
      educationLevel: 'degree',
      minMarks: 95,
      ieltsMin: 7.5,
      toeflMin: 100,
      other: ['LSAT required', 'Strong writing skills']
    },
    courseContent: [
      'Constitutional Law',
      'Contracts',
      'Torts',
      'Criminal Law',
      'Property Law',
      'Legal Writing'
    ],
    jobOutcomes: {
      averageSalary: 180000,
      currency: 'USD',
      topCompanies: ['Cravath', 'Sullivan & Cromwell', 'Skadden', 'Latham & Watkins'],
      placementRate: 98
    },
    category: 'Law',
    level: 'graduate',
    intake: ['Fall'],
    visaSuccessRate: 91,
    studentSatisfaction: 4.8,
    aiFitScore: 9.4,
    source: {
      api: 'manual',
      externalId: 'yale-jd'
    }
  },
  // Arts Courses
  {
    name: 'Master of Fine Arts in Film Production',
    university: {
      name: 'University of Southern California',
      location: {
        city: 'Los Angeles',
        country: 'USA',
        coordinates: { lat: 34.0224, lng: -118.2851 }
      },
      ranking: 24,
      acceptanceRate: 16,
      website: 'https://www.usc.edu'
    },
    description: 'Premier film school with strong Hollywood connections and state-of-the-art facilities.',
    duration: '3 years',
    fees: {
      currency: 'USD',
      amount: 60000,
      per: 'year'
    },
    requirements: {
      educationLevel: 'degree',
      minMarks: 80,
      ieltsMin: 7.0,
      toeflMin: 100,
      other: ['Portfolio required', 'Creative writing sample']
    },
    courseContent: [
      'Cinematography',
      'Directing',
      'Screenwriting',
      'Film Editing',
      'Sound Design',
      'Production Management'
    ],
    jobOutcomes: {
      averageSalary: 70000,
      currency: 'USD',
      topCompanies: ['Disney', 'Warner Bros', 'Netflix', 'Paramount', 'Universal'],
      placementRate: 85
    },
    category: 'Arts',
    level: 'graduate',
    intake: ['Fall'],
    visaSuccessRate: 83,
    studentSatisfaction: 4.3,
    aiFitScore: 7.8,
    source: {
      api: 'manual',
      externalId: 'usc-film-mfa'
    }
  },
  // Science Courses
  {
    name: 'Master of Science in Data Science',
    university: {
      name: 'University of Washington',
      location: {
        city: 'Seattle',
        country: 'USA',
        coordinates: { lat: 47.6553, lng: -122.3035 }
      },
      ranking: 59,
      acceptanceRate: 49,
      website: 'https://www.washington.edu'
    },
    description: 'Comprehensive data science program with strong industry partnerships.',
    duration: '1.5 years',
    fees: {
      currency: 'USD',
      amount: 35000,
      per: 'year'
    },
    requirements: {
      educationLevel: 'degree',
      minMarks: 85,
      ieltsMin: 7.0,
      toeflMin: 92,
      other: ['Strong math and programming background']
    },
    courseContent: [
      'Statistical Methods',
      'Machine Learning',
      'Data Visualization',
      'Big Data Systems',
      'Database Management',
      'Data Ethics'
    ],
    jobOutcomes: {
      averageSalary: 125000,
      currency: 'USD',
      topCompanies: ['Microsoft', 'Amazon', 'Google', 'Tableau', 'Salesforce'],
      placementRate: 93
    },
    category: 'Science',
    level: 'graduate',
    intake: ['Fall', 'Spring'],
    visaSuccessRate: 86,
    studentSatisfaction: 4.5,
    aiFitScore: 8.6,
    source: {
      api: 'manual',
      externalId: 'uw-data-science-msc'
    }
  }
];

async function seedAccurateData() {
  try {
    await connectDB();
    logger.info('Connected to MongoDB');

    // Clear existing courses
    await Course.deleteMany({});
    logger.info('Cleared existing courses');

    // Insert accurate courses
    const inserted = await Course.insertMany(accurateCourses);
    logger.info(`✅ Successfully inserted ${inserted.length} accurate courses`);

    // Display summary
    const categories = {};
    inserted.forEach(course => {
      categories[course.category] = (categories[course.category] || 0) + 1;
    });

    logger.info('\n📊 Course Summary by Category:');
    Object.entries(categories).forEach(([category, count]) => {
      logger.info(`  ${category}: ${count} courses`);
    });

    logger.info('\n✅ Seed complete! Courses are ready to use.');
    process.exit(0);
  } catch (error) {
    logger.error('Seed error:', error);
    process.exit(1);
  }
}

seedAccurateData();

