import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.model.js';
import { connectDB } from '../config/database.js';
import { logger } from '../config/logger.js';

dotenv.config();

// Generate comprehensive course data
function generateComprehensiveCourses() {
  const courses = [];
  
  const countries = [
    { name: 'Canada', cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'] },
    { name: 'USA', cities: ['Boston', 'New York', 'San Francisco', 'Los Angeles', 'Chicago'] },
    { name: 'UK', cities: ['London', 'Manchester', 'Edinburgh', 'Birmingham', 'Bristol'] },
    { name: 'Australia', cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'] },
    { name: 'Germany', cities: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Stuttgart'] },
    { name: 'France', cities: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice'] },
    { name: 'Switzerland', cities: ['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne'] },
    { name: 'Ireland', cities: ['Dublin', 'Cork', 'Galway', 'Limerick'] },
    { name: 'New Zealand', cities: ['Auckland', 'Wellington', 'Christchurch', 'Dunedin'] },
    { name: 'Sweden', cities: ['Stockholm', 'Gothenburg', 'Uppsala', 'Lund'] },
    { name: 'Finland', cities: ['Helsinki', 'Tampere', 'Turku', 'Oulu'] },
    { name: 'Netherlands', cities: ['Amsterdam', 'Rotterdam', 'Utrecht', 'Eindhoven'] },
    { name: 'Singapore', cities: ['Singapore'] },
    { name: 'Dubai', cities: ['Dubai'] },
    { name: 'Saudi Arabia', cities: ['Riyadh', 'Jeddah', 'Dammam'] }
  ];

  const categories = [
    'Engineering & Technology',
    'Health Sciences, Medicine, Nursing',
    'Business, Management & Economics',
    'Law, Politics, Social, Community Service',
    'Arts',
    'Sciences',
    'English For Academic Studies',
    'AI',
    'CS',
    'MBA',
    'Engineering',
    'Nursing',
    'Medicine',
    'Business',
    'Law'
  ];

  const levels = ['undergraduate', 'graduate', 'diploma'];
  const intakes = [['Fall'], ['Spring'], ['Fall', 'Spring'], ['Summer']];

  let courseId = 1;

  // Generate courses for each category and country combination
  categories.forEach((category, catIndex) => {
    countries.forEach((country, countryIndex) => {
      const city = country.cities[countryIndex % country.cities.length];
      
      // Generate 2-4 courses per category-country combination
      const numCourses = 2 + (courseId % 3);
      
      for (let i = 0; i < numCourses; i++) {
        const level = levels[courseId % levels.length];
        const intake = intakes[courseId % intakes.length];
        const isGraduate = level === 'graduate';
        
        // Course name variations
        const courseNames = {
          'Engineering & Technology': [
            'Bachelor of Engineering in Computer Engineering',
            'Master of Engineering in Software Engineering',
            'Bachelor of Science in Electrical Engineering',
            'Master of Science in Mechanical Engineering',
            'Bachelor of Engineering in Civil Engineering',
            'Master of Engineering in Aerospace Engineering'
          ],
          'Health Sciences, Medicine, Nursing': [
            'Bachelor of Science in Nursing',
            'Master of Science in Nursing',
            'Bachelor of Medicine and Surgery',
            'Master of Public Health',
            'Bachelor of Health Sciences',
            'Master of Health Administration'
          ],
          'Business, Management & Economics': [
            'Bachelor of Business Administration',
            'Master of Business Administration (MBA)',
            'Bachelor of Commerce',
            'Master of Finance',
            'Bachelor of Economics',
            'Master of Management'
          ],
          'Law, Politics, Social, Community Service': [
            'Bachelor of Laws (LLB)',
            'Master of Laws (LLM)',
            'Bachelor of Political Science',
            'Master of Public Policy',
            'Bachelor of Social Work',
            'Master of Social Work'
          ],
          'Arts': [
            'Bachelor of Arts in English Literature',
            'Master of Arts in History',
            'Bachelor of Fine Arts',
            'Master of Arts in Psychology',
            'Bachelor of Arts in Communication',
            'Master of Arts in Media Studies'
          ],
          'Sciences': [
            'Bachelor of Science in Biology',
            'Master of Science in Chemistry',
            'Bachelor of Science in Physics',
            'Master of Science in Mathematics',
            'Bachelor of Science in Environmental Science',
            'Master of Science in Data Science'
          ],
          'English For Academic Studies': [
            'English Language Foundation Program',
            'Academic English Preparation Course',
            'English for University Studies',
            'Intensive English Program'
          ],
          'AI': [
            'Master of Science in Artificial Intelligence',
            'Bachelor of Science in AI',
            'Master of Science in Machine Learning',
            'Bachelor of Science in Data Science'
          ],
          'CS': [
            'Bachelor of Computer Science',
            'Master of Science in Computer Science',
            'Bachelor of Science in Software Engineering',
            'Master of Science in Information Technology'
          ],
          'MBA': [
            'Master of Business Administration',
            'Executive MBA',
            'MBA in Finance',
            'MBA in Marketing'
          ],
          'Engineering': [
            'Bachelor of Engineering',
            'Master of Engineering',
            'Bachelor of Engineering Technology',
            'Master of Engineering Management'
          ],
          'Nursing': [
            'Bachelor of Science in Nursing',
            'Master of Science in Nursing',
            'Diploma in Nursing',
            'Postgraduate Diploma in Nursing'
          ],
          'Medicine': [
            'Bachelor of Medicine and Surgery',
            'Doctor of Medicine',
            'Master of Public Health',
            'Bachelor of Health Sciences'
          ],
          'Business': [
            'Bachelor of Business Administration',
            'Master of Business Administration',
            'Bachelor of Commerce',
            'Master of Commerce'
          ],
          'Law': [
            'Bachelor of Laws',
            'Master of Laws',
            'Juris Doctor',
            'Bachelor of Legal Studies'
          ]
        };

        const nameOptions = courseNames[category] || courseNames['Engineering & Technology'];
        const courseName = nameOptions[courseId % nameOptions.length];

        // Generate realistic fees based on country and level
        const feeRanges = {
          'Canada': { undergrad: [20000, 35000], grad: [25000, 45000] },
          'USA': { undergrad: [30000, 60000], grad: [40000, 70000] },
          'UK': { undergrad: [15000, 30000], grad: [20000, 40000] },
          'Australia': { undergrad: [25000, 40000], grad: [30000, 50000] },
          'Germany': { undergrad: [5000, 15000], grad: [8000, 20000] },
          'France': { undergrad: [8000, 15000], grad: [10000, 20000] },
          'Switzerland': { undergrad: [15000, 25000], grad: [20000, 35000] },
          'Ireland': { undergrad: [12000, 25000], grad: [15000, 30000] },
          'New Zealand': { undergrad: [20000, 35000], grad: [25000, 40000] },
          'Sweden': { undergrad: [10000, 20000], grad: [15000, 25000] },
          'Finland': { undergrad: [8000, 15000], grad: [12000, 20000] },
          'Netherlands': { undergrad: [8000, 15000], grad: [12000, 20000] },
          'Singapore': { undergrad: [25000, 40000], grad: [30000, 50000] },
          'Dubai': { undergrad: [15000, 30000], grad: [20000, 40000] },
          'Saudi Arabia': { undergrad: [10000, 20000], grad: [15000, 25000] }
        };

        const currencyMap = {
          'Canada': 'CAD',
          'USA': 'USD',
          'UK': 'GBP',
          'Australia': 'AUD',
          'Germany': 'EUR',
          'France': 'EUR',
          'Switzerland': 'CHF',
          'Ireland': 'EUR',
          'New Zealand': 'NZD',
          'Sweden': 'SEK',
          'Finland': 'EUR',
          'Netherlands': 'EUR',
          'Singapore': 'SGD',
          'Dubai': 'AED',
          'Saudi Arabia': 'SAR'
        };

        const feeRange = feeRanges[country.name]?.[isGraduate ? 'grad' : 'undergrad'] || [20000, 40000];
        const fees = Math.floor(Math.random() * (feeRange[1] - feeRange[0]) + feeRange[0]);
        const currency = currencyMap[country.name] || 'USD';

        // Generate university name
        const universityNames = [
          `University of ${city}`,
          `${city} University`,
          `${city} Institute of Technology`,
          `${city} State University`,
          `${city} College`,
          `International University of ${city}`,
          `${city} Metropolitan University`
        ];
        const universityName = universityNames[courseId % universityNames.length];

        // Generate ranking (1-200)
        const ranking = Math.floor(Math.random() * 200) + 1;
        const acceptanceRate = Math.floor(Math.random() * 50) + 30; // 30-80%

        // Generate requirements
        const ieltsMin = isGraduate ? (6.5 + Math.random() * 1.0) : (6.0 + Math.random() * 0.5);
        const minMarks = isGraduate ? (75 + Math.random() * 15) : (70 + Math.random() * 20);

        // Generate job outcomes
        const salaryMultipliers = {
          'Canada': 1.0,
          'USA': 1.2,
          'UK': 0.9,
          'Australia': 1.0,
          'Germany': 0.8,
          'France': 0.7,
          'Switzerland': 1.3,
          'Ireland': 0.9,
          'New Zealand': 0.9,
          'Sweden': 0.8,
          'Finland': 0.7,
          'Netherlands': 0.8,
          'Singapore': 1.1,
          'Dubai': 1.0,
          'Saudi Arabia': 0.9
        };

        const baseSalary = isGraduate ? 80000 : 60000;
        const averageSalary = Math.floor(baseSalary * (salaryMultipliers[country.name] || 1.0) * (0.8 + Math.random() * 0.4));

        const course = {
          name: courseName,
          university: {
            name: universityName,
            location: {
              city: city,
              country: country.name,
              coordinates: {
                lat: 40 + Math.random() * 20,
                lng: -100 + Math.random() * 50
              }
            },
            ranking: ranking,
            acceptanceRate: acceptanceRate,
            website: `https://www.${universityName.toLowerCase().replace(/\s+/g, '')}.edu`
          },
          description: `${courseName} at ${universityName} offers comprehensive education in ${category.toLowerCase()}. Located in ${city}, ${country.name}, this program provides excellent opportunities for international students.`,
          duration: isGraduate ? '2 years' : (level === 'diploma' ? '2 years' : '4 years'),
          fees: {
            currency: currency,
            amount: fees,
            per: 'year'
          },
          requirements: {
            educationLevel: isGraduate ? 'degree' : '12th',
            minMarks: Math.floor(minMarks),
            ieltsMin: Math.round(ieltsMin * 10) / 10,
            toeflMin: Math.floor(ieltsMin * 13.75),
            other: isGraduate ? ['Bachelor degree required'] : []
          },
          courseContent: [
            'Core Curriculum',
            'Specialized Courses',
            'Research Projects',
            'Industry Internship',
            'Capstone Project'
          ],
          jobOutcomes: {
            averageSalary: averageSalary,
            currency: currency,
            topCompanies: ['Leading Companies', 'Industry Leaders', 'Global Organizations'],
            placementRate: Math.floor(85 + Math.random() * 10)
          },
          category: category,
          level: level,
          intake: intake,
          visaSuccessRate: Math.floor(75 + Math.random() * 15),
          studentSatisfaction: Math.round((3.5 + Math.random() * 1.0) * 10) / 10,
          aiFitScore: Math.round((7.0 + Math.random() * 2.0) * 10) / 10,
          source: {
            api: 'comprehensive-seed',
            externalId: `comprehensive-${courseId}`
          }
        };

        courses.push(course);
        courseId++;
      }
    });
  });

  return courses;
}

async function seedComprehensive() {
  try {
    await connectDB();
    logger.info('✅ Connected to MongoDB');

    // Check if user wants to clear existing data
    const args = process.argv.slice(2);
    const clearExisting = args.includes('--clear') || args.includes('-c');

    if (clearExisting) {
      logger.info('🗑️  Clearing existing courses...');
      await Course.deleteMany({});
      logger.info('✅ Cleared existing courses');
    } else {
      const existingCount = await Course.countDocuments();
      if (existingCount > 0) {
        logger.info(`⚠️  Database already has ${existingCount} courses. Use --clear flag to replace them.`);
        logger.info('   Adding new courses without clearing...');
      }
    }

    // Generate comprehensive courses
    logger.info('📚 Generating comprehensive course data...');
    const courses = generateComprehensiveCourses();
    logger.info(`📝 Generated ${courses.length} courses`);

    // Insert courses
    logger.info('💾 Inserting courses into database...');
    const inserted = await Course.insertMany(courses, { ordered: false });
    logger.info(`✅ Successfully inserted ${inserted.length} courses`);

    // Display summary
    const categories = {};
    const countries = {};
    inserted.forEach(course => {
      categories[course.category] = (categories[course.category] || 0) + 1;
      countries[course.university.location.country] = (countries[course.university.location.country] || 0) + 1;
    });

    logger.info('\n📊 Course Summary by Category:');
    Object.entries(categories).sort((a, b) => b[1] - a[1]).forEach(([category, count]) => {
      logger.info(`  ${category}: ${count} courses`);
    });

    logger.info('\n🌍 Course Summary by Country:');
    Object.entries(countries).sort((a, b) => b[1] - a[1]).forEach(([country, count]) => {
      logger.info(`  ${country}: ${count} courses`);
    });

    logger.info(`\n✅ Comprehensive seed complete! Total courses: ${inserted.length}`);
    logger.info('💡 You can now search for courses by category, country, or level.');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Seed error:', error);
    if (error.writeErrors) {
      logger.error(`   ${error.writeErrors.length} courses failed to insert (duplicates)`);
    }
    process.exit(1);
  }
}

seedComprehensive();

