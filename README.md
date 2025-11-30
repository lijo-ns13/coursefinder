# AI-Powered Global Course Finder & Comparison Platform

A full-stack MERN application that helps students find and compare courses and universities worldwide using AI-powered recommendations.

## 🚀 Features

- **AI-Based Course Filtering** - Smart recommendations based on profile, marks, IELTS, budget, and preferences
- **Real University Data** - Integration with RapidAPI, OpenAlex, and Google Places APIs
- **Course Comparison** - Side-by-side comparison of universities with AI-generated insights
- **User Dashboard** - Save courses, comparisons, and track recommendations
- **Admin Panel** - Manage users, courses, and analytics
- **Mobile-First Design** - Beautiful, responsive UI with Framer Motion animations
- **OTP Authentication** - Phone-based authentication with Twilio integration

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- TailwindCSS
- Zustand (State Management)
- React Router
- Framer Motion
- Axios
- React Hot Toast

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Zod Validation
- Winston Logger
- AI Integration (OpenAI/Groq)
- Twilio (OTP)

## 📁 Project Structure

```
coursefinder/
├── backend/
│   ├── src/
│   │   ├── config/        # Database, logger config
│   │   ├── controllers/    # Request handlers
│   │   ├── middlewares/    # Auth, error handling
│   │   ├── models/        # MongoDB models
│   │   ├── repositories/  # Data access layer
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── scripts/       # Seed scripts
│   │   └── validators/    # Input validation
│   └── server.js          # Entry point
├── frontend/
│   ├── src/
│   │   ├── api/           # API client functions
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand stores
│   │   └── App.jsx        # Main app component
│   └── index.html
└── README.md
```

## 🚦 Getting Started

See [SETUP.md](./SETUP.md) for detailed setup instructions.

### Quick Start

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Configure .env file
npm run dev

# Frontend (new terminal)
cd frontend
npm install
cp .env.example .env
# Configure .env file
npm run dev
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP and login
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses/search` - Search courses
- `GET /api/courses/:id` - Get course details
- `GET /api/courses/popular` - Get popular courses

### AI
- `POST /api/ai/filter` - AI-powered course filtering
- `POST /api/ai/compare` - Compare two courses
- `POST /api/ai/recommend` - Get recommendations

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `POST /api/user/save-course` - Save a course
- `GET /api/user/saved-courses` - Get saved courses
- `GET /api/user/saved-comparisons` - Get saved comparisons

### Admin
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/courses` - Get all courses
- `POST /api/admin/courses` - Create course
- `PUT /api/admin/courses/:id` - Update course

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Render

### 🔄 Keep Backend Alive (Render Free Tier)

Render's free tier spins down services after 15 minutes of inactivity. To keep your backend alive:

**Quick Setup**: See [KEEP_ALIVE_QUICK_START.md](./KEEP_ALIVE_QUICK_START.md)

**Recommended**: Use [cron-job.org](https://cron-job.org) (free) to ping `/health` every 5 minutes:
- URL: `https://your-backend.onrender.com/health`
- Schedule: `*/5 * * * *` (every 5 minutes)

The frontend also includes automatic keep-alive pings when users have the app open.

## 📚 Documentation

- [Setup Guide](./SETUP.md) - Detailed setup instructions
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment
- [Contributing Guide](./CONTRIBUTING.md) - Git commit standards

## 🔑 Required API Keys

See [API_KEYS_GUIDE.md](./API_KEYS_GUIDE.md) for detailed setup instructions.

**Minimum Required:**
- **MongoDB** - Database (Atlas or local)
- **Groq API** - AI recommendations (free tier available)

**Recommended:**
- **RapidAPI** - Universities data (free tier available)
- **Google Places API** - Location data ($200 free credit/month)

**Optional:**
- **OpenAI API** - Alternative AI service (paid)
- **Twilio** - OTP sending (free trial available)
- **OpenAlex** - Academic data (free, no key needed)

## 🧪 Fetching Live Data

The system fetches **real-time, accurate data** from external APIs. See [LIVE_DATA.md](./LIVE_DATA.md) for details.

```bash
# Fetch popular courses by category
cd backend
npm run fetch-data popular

# Fetch courses from a specific country
npm run fetch-data country US

# Refresh existing courses
npm run fetch-data refresh
```

For more options, see [LIVE_DATA.md](./LIVE_DATA.md).

## 📄 License

MIT

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## 📧 Support

For issues and questions, please open an issue on GitHub.


<!-- Updated: 2025-11-30 09:30 -->
