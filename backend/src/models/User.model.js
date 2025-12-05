import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    code: String,
    expiresAt: Date
  },
  profile: {
    name: String,
    email: String,
    country: String,
    educationLevel: String, // 10th, 12th, degree
    marks: {
      tenth: Number,
      twelfth: Number,
      degree: Number
    },
    ieltsScore: Number,
    budget: Number,
    preferredCourse: String,
    passedStatus: String, // 'passed' or 'not_passed'
    preferences: [String]
  },
  savedCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  savedComparisons: [{
    course1: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    course2: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    createdAt: { type: Date, default: Date.now }
  }],
  recentViews: [{
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    viewedAt: { type: Date, default: Date.now }
  }],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Index for faster queries
userSchema.index({ phone: 1 });
userSchema.index({ 'profile.email': 1 });

export default mongoose.model('User', userSchema);

