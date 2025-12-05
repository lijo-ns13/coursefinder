# Setup Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB (local or Atlas account)
- Git installed
- API Keys (see [API_KEYS_GUIDE.md](./API_KEYS_GUIDE.md) for detailed instructions):
  - **Required:** Groq API (free) - Get from https://console.groq.com
  - **Recommended:** RapidAPI, Google Places API
  - **Optional:** OpenAI API, Twilio

## Quick Start

### 1. Clone and Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Backend Setup

1. **Copy environment file**
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Configure `.env` file**
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/coursefinder
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=7d
   
   # AI Services (at least one required)
   OPENAI_API_KEY=your-openai-api-key
   GROQ_API_KEY=your-groq-api-key
   
   # External APIs
   RAPIDAPI_KEY=your-rapidapi-key
   GOOGLE_PLACES_API_KEY=your-google-places-api-key
   OPENALEX_API_KEY=your-openalex-api-key
   
   # Twilio for OTP (Optional - leave empty for dev mode)
   # In dev mode, OTP codes will be logged to console instead of sending SMS
   TWILIO_ACCOUNT_SID=
   TWILIO_AUTH_TOKEN=
   TWILIO_PHONE_NUMBER=
   
   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   ```

3. **Start MongoDB** (if using local)
   ```bash
   # Windows
   mongod
   
   # Mac/Linux
   sudo systemctl start mongod
   ```

4. **Start backend server**
   ```bash
   cd backend
   npm run dev
   ```

### 3. Frontend Setup

1. **Copy environment file**
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. **Configure `.env` file**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start frontend dev server**
   ```bash
   cd frontend
   npm run dev
   ```

### 4. Access Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## Creating Admin User

To create an admin user, you can use MongoDB shell or a script:

```javascript
// In MongoDB shell or MongoDB Compass
use coursefinder
db.users.updateOne(
  { phone: "your-phone-number" },
  { $set: { role: "admin" } }
)
```

## Development Notes

### OTP in Development
- In development mode, OTP codes are logged to console instead of sending SMS
- Check backend console for OTP codes

### API Rate Limits
- RapidAPI has rate limits on free tier
- Google Places API has usage limits
- Groq API has generous free tier

### Testing
- Use Postman or similar tool to test API endpoints
- Check browser console for frontend errors
- Check backend logs for API errors

## Project Structure

```
coursefinder/
├── backend/
│   ├── src/
│   │   ├── config/        # Database, logger config
│   │   ├── controllers/   # Request handlers
│   │   ├── middlewares/   # Auth, error handling
│   │   ├── models/        # MongoDB models
│   │   ├── repositories/  # Data access layer
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
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

## Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string format
- Verify network access (for Atlas)

### CORS Errors
- Check `FRONTEND_URL` in backend `.env`
- Ensure frontend URL matches exactly

### OTP Not Sending
- Check Twilio credentials
- Verify phone number format (+country code)
- Check Twilio account balance
- In dev mode, check console logs

### AI Recommendations Not Working
- Verify AI API key is set
- Check API rate limits
- Ensure at least one AI service is configured

## Fetching Live Data

The system uses **real-time data** from external APIs. See [LIVE_DATA.md](./LIVE_DATA.md) for complete guide.

### Quick Start - Fetch Initial Data

```bash
cd backend

# Fetch popular courses by category
npm run fetch-data popular

# Or fetch courses from a specific country
npm run fetch-data country US
npm run fetch-data country CA
```

The system will automatically fetch data when users search if the database is empty.

## Next Steps

1. Set up API keys
2. Configure MongoDB
3. Test authentication flow
4. Fetch live course data (see above)
5. Test AI recommendations
6. Deploy to production (see DEPLOYMENT.md)

