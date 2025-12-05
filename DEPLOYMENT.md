# Deployment Guide

## Backend Deployment (Render)

1. **Create a new Web Service on Render**
   - Connect your GitHub repository
   - Select the `backend` directory as the root directory
   - Build Command: `npm install`
   - Start Command: `npm start`

2. **Set Environment Variables**
   - `PORT`: 5000 (or let Render assign)
   - `NODE_ENV`: production
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A strong secret key
   - `JWT_EXPIRES_IN`: 7d
   - `OPENAI_API_KEY`: Your OpenAI API key (optional)
   - `GROQ_API_KEY`: Your Groq API key (recommended for free tier)
   - `RAPIDAPI_KEY`: Your RapidAPI key
   - `GOOGLE_PLACES_API_KEY`: Your Google Places API key
   - `OPENALEX_API_KEY`: Your OpenAlex API key (optional)
   - `TWILIO_ACCOUNT_SID`: Your Twilio Account SID
   - `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token
   - `TWILIO_PHONE_NUMBER`: Your Twilio phone number
   - `FRONTEND_URL`: Your frontend URL (e.g., https://your-app.vercel.app)

3. **Deploy**
   - Render will automatically deploy on every push to main branch
   - Note your backend URL (e.g., https://your-backend.onrender.com)

## Frontend Deployment (Vercel)

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set Root Directory to `frontend`
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Set Environment Variables**
   - `VITE_API_URL`: Your backend API URL (e.g., https://your-backend.onrender.com/api)

4. **Deploy**
   - Vercel will automatically deploy on every push
   - Update `vercel.json` with your actual backend URL

## MongoDB Setup

1. **Create MongoDB Atlas Account** (recommended)
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get connection string
   - Add your IP to whitelist
   - Create database user

2. **Or Use Local MongoDB**
   - Install MongoDB locally
   - Connection string: `mongodb://localhost:27017/coursefinder`

## API Keys Setup

### RapidAPI
1. Sign up at [rapidapi.com](https://rapidapi.com)
2. Subscribe to "Universities and Colleges" API
3. Copy your API key

### Google Places API
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable Places API
3. Create API key
4. Restrict to Places API only

### Groq API (Free AI Alternative)
1. Sign up at [groq.com](https://groq.com)
2. Get API key from dashboard
3. Free tier available

### Twilio (OTP)
1. Sign up at [twilio.com](https://twilio.com)
2. Get Account SID and Auth Token
3. Get a phone number
4. Free trial available

## Post-Deployment Checklist

- [ ] Backend is accessible at your Render URL
- [ ] Frontend can connect to backend API
- [ ] MongoDB connection is working
- [ ] OTP sending works (check Twilio logs)
- [ ] AI recommendations work (check API keys)
- [ ] External APIs are responding
- [ ] CORS is configured correctly
- [ ] Environment variables are set

## Troubleshooting

### Backend Issues
- Check Render logs for errors
- Verify all environment variables are set
- Ensure MongoDB connection string is correct
- Check API rate limits

### Frontend Issues
- Check browser console for errors
- Verify `VITE_API_URL` is correct
- Check CORS settings on backend
- Clear browser cache

### OTP Issues
- Verify Twilio credentials
- Check phone number format (+country code)
- In development, OTP is logged to console
- Check Twilio account balance

