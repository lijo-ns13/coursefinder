import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  university: {
    name: String,
    location: {
      city: String,
      country: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    ranking: Number,
    acceptanceRate: Number,
    website: String
  },
  description: String,
  duration: String, // e.g., "2 years", "4 semesters"
  fees: {
    currency: { type: String, default: 'USD' },
    amount: Number,
    per: { type: String, default: 'year' } // year, semester, total
  },
  requirements: {
    educationLevel: String,
    minMarks: Number,
    ieltsMin: Number,
    toeflMin: Number,
    other: [String]
  },
  courseContent: [String], // Syllabus topics
  jobOutcomes: {
    averageSalary: Number,
    currency: String,
    topCompanies: [String],
    placementRate: Number
  },
  images: [String],
  category: String, // AI, CS, MBA, Nursing, etc.
  level: String, // undergraduate, graduate, diploma
  intake: [String], // Fall, Spring, Summer
  applicationDeadline: Date,
  visaSuccessRate: Number, // AI estimated
  studentSatisfaction: Number, // 1-5 rating
  aiFitScore: Number, // AI-generated fit score
  source: {
    api: String, // rapidapi, openalex, google
    externalId: String
  },
  metadata: mongoose.Schema.Types.Mixed // Store additional API-specific data
}, {
  timestamps: true
});

// Indexes for faster searches
courseSchema.index({ name: 'text', 'university.name': 'text', description: 'text' });
courseSchema.index({ 'university.location.country': 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ 'fees.amount': 1 });

export default mongoose.model('Course', courseSchema);

