import mongoose from 'mongoose';

const comparisonSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  course2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  aiAnalysis: {
    comparison: {
      fees: String,
      ranking: String,
      acceptanceRate: String,
      courseContent: String,
      jobOutcomes: String,
      companyTieUps: String,
      campusLife: String,
      roiScore: String,
      visaSuccessRate: String
    },
    verdict: String, // Which is better and why
    recommendation: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

comparisonSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Comparison', comparisonSchema);

