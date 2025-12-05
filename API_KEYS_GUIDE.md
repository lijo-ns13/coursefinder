# API Keys Setup Guide

This guide will help you obtain all the API keys needed for the CourseFinder platform.

## Required API Keys

### 1. Groq API (Free - Recommended for AI Features) ⭐

**Why:** Powers AI recommendations, course filtering, and comparisons

**Steps:**
1. Go to https://console.groq.com
2. Sign up for a free account (no credit card required)
3. Navigate to "API Keys" section
4. Click "Create API Key"
5. Copy the API key
6. Add to `backend/.env`:
   ```
   GROQ_API_KEY=your-groq-api-key-here
   ```

**Free Tier:** Generous free tier with fast responses

---

### 2. RapidAPI Key (Universities Data)

**Why:** Fetches real university and course data

**Steps:**
1. Go to https://rapidapi.com
2. Sign up for a free account
3. Search for "Universities and Colleges" API
4. Subscribe to the free/basic plan
5. Go to your dashboard → "My Apps" → "Default Application"
6. Copy your "X-RapidAPI-Key"
7. Add to `backend/.env`:
   ```
   RAPIDAPI_KEY=your-rapidapi-key-here
   ```

**Free Tier:** Limited requests per month (usually 100-500)

**Alternative APIs on RapidAPI:**
- "World University Rankings" API
- "University Search" API
- "College Scorecard" API

---

### 3. Google Places API Key (Optional but Recommended)

**Why:** Enriches courses with location data, photos, and coordinates

**Steps:**
1. Go to https://console.cloud.google.com
2. Create a new project or select existing one
3. Enable "Places API" and "Places API (New)"
   - Go to "APIs & Services" → "Library"
   - Search for "Places API"
   - Click "Enable"
4. Go to "APIs & Services" → "Credentials"
5. Click "Create Credentials" → "API Key"
6. Copy the API key
7. (Recommended) Restrict the API key:
   - Click on the API key
   - Under "API restrictions", select "Restrict key"
   - Choose "Places API" and "Places API (New)"
   - Save
8. Add to `backend/.env`:
   ```
   GOOGLE_PLACES_API_KEY=your-google-places-api-key-here
   ```

**Free Tier:** $200 free credit per month (usually enough for development)

---

### 4. OpenAI API Key (Optional - Alternative to Groq)

**Why:** Alternative AI service (paid, but more powerful)

**Steps:**
1. Go to https://platform.openai.com
2. Sign up for an account
3. Add payment method (required)
4. Go to "API Keys" section
5. Click "Create new secret key"
6. Copy the API key (shown only once!)
7. Add to `backend/.env`:
   ```
   OPENAI_API_KEY=your-openai-api-key-here
   ```

**Note:** Paid service, but you can use Groq (free) instead

---

### 5. Twilio (Optional - For SMS OTP)

**Why:** Sends OTP codes via SMS for authentication

**Steps:**
1. Go to https://www.twilio.com
2. Sign up for a free trial account
3. Verify your phone number
4. Go to Console Dashboard
5. Copy:
   - Account SID
   - Auth Token
   - Phone Number (get one from "Phone Numbers" → "Buy a number")
6. Add to `backend/.env`:
   ```
   TWILIO_ACCOUNT_SID=your-account-sid
   TWILIO_AUTH_TOKEN=your-auth-token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

**Free Tier:** $15.50 free credit for trial

**Note:** In development mode, OTP codes are logged to console instead of sending SMS

---

### 6. OpenAlex API (Free - No Key Needed!)

**Why:** Academic institutions database

**Steps:**
- No API key required! It's completely free
- Just leave `OPENALEX_API_KEY` empty in `.env`
- The system will use it automatically

---

## Quick Setup Checklist

### Minimum Required (App will work with these):
- [ ] Groq API Key (for AI features)
- [ ] MongoDB connection string

### Recommended (Better data quality):
- [ ] RapidAPI Key (for university data)
- [ ] Google Places API Key (for location enrichment)

### Optional:
- [ ] OpenAI API Key (alternative to Groq)
- [ ] Twilio credentials (for SMS OTP)

---

## Environment Variables Template

Copy this to your `backend/.env` file:

```env
# AI Services (at least one required)
GROQ_API_KEY=your-groq-key-here
# OPENAI_API_KEY=your-openai-key-here  # Optional

# External APIs
RAPIDAPI_KEY=your-rapidapi-key-here
GOOGLE_PLACES_API_KEY=your-google-places-key-here
OPENALEX_API_KEY=  # Leave empty, no key needed

# Twilio (Optional - leave empty for dev mode)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Other required
MONGODB_URI=mongodb://localhost:27017/coursefinder
JWT_SECRET=your-secret-key-min-32-chars
FRONTEND_URL=http://localhost:5173
```

---

## Testing Your API Keys

### Test Groq API:
```bash
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer YOUR_GROQ_API_KEY"
```

### Test RapidAPI:
```bash
curl "https://universities-and-colleges.p.rapidapi.com/search?q=harvard" \
  -H "X-RapidAPI-Key: YOUR_RAPIDAPI_KEY" \
  -H "X-RapidAPI-Host: universities-and-colleges.p.rapidapi.com"
```

### Test Google Places:
```bash
curl "https://maps.googleapis.com/maps/api/place/textsearch/json?query=harvard+university&key=YOUR_GOOGLE_KEY"
```

---

## Troubleshooting

### API Key Not Working?
1. Check for extra spaces in `.env` file
2. Restart your backend server after adding keys
3. Check API key permissions/restrictions
4. Verify API key hasn't expired
5. Check rate limits haven't been exceeded

### Rate Limits?
- RapidAPI: Check your plan limits
- Google Places: $200 free credit/month
- Groq: Very generous free tier
- Twilio: $15.50 trial credit

### Need Help?
- Check API provider documentation
- Review backend logs for specific error messages
- Test API keys individually using curl commands above

---

## Cost Estimates

**Free Setup (Recommended for Development):**
- Groq: Free ✅
- OpenAlex: Free ✅
- RapidAPI: Free tier (limited) ✅
- Google Places: $200 free credit/month ✅
- Twilio: $15.50 trial credit ✅

**Total: $0/month for development**

**Production Costs (Approximate):**
- Groq: Free tier usually sufficient
- RapidAPI: $10-50/month depending on usage
- Google Places: Pay-as-you-go after free credit
- Twilio: ~$0.01 per SMS

---

## Security Best Practices

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Use environment variables** - Don't hardcode keys
3. **Restrict API keys** - Limit to specific APIs/IPs when possible
4. **Rotate keys regularly** - Especially if exposed
5. **Use different keys** - Separate keys for dev/production

---

## Quick Start (Minimal Setup)

For quick testing, you only need:

1. **Groq API Key** (5 minutes to get)
2. **MongoDB** (local or Atlas)

The app will work with just these two! Other APIs enhance the experience but aren't strictly required.

