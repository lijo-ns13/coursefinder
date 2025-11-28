# 🚀 Keep-Alive Quick Start Guide

## Problem
Render's free tier spins down your backend after **15 minutes** of inactivity, causing slow first requests (30-60 second cold starts).

## Solution
Ping your backend every **5 minutes** to keep it warm.

---

## ✅ Recommended: External Cron Service (FREE)

### Option 1: cron-job.org (Easiest)

1. **Sign up**: Go to [https://cron-job.org](https://cron-job.org) → Create free account

2. **Create cronjob**:
   - Click "Create cronjob"
   - **Title**: `Keep Render Backend Alive`
   - **Address**: `https://your-backend-name.onrender.com/health`
   - **Schedule**: `*/5 * * * *` (every 5 minutes)
   - **Request method**: `GET`
   - Click **Create**

3. **Done!** Your backend will stay alive 24/7

### Option 2: UptimeRobot (Also Free)

1. **Sign up**: [https://uptimerobot.com](https://uptimerobot.com)

2. **Add Monitor**:
   - Monitor Type: `HTTP(s)`
   - Friendly Name: `Backend Keep-Alive`
   - URL: `https://your-backend-name.onrender.com/health`
   - Monitoring Interval: `5 minutes`
   - Click **Create Monitor**

---

## 🔄 Frontend Keep-Alive (Already Enabled)

The frontend automatically pings the backend every 5 minutes when users have the app open.

**Status**: ✅ Already integrated in `App.jsx`

**Note**: This only works when users have your app open. Use external cron for 24/7 reliability.

---

## 🧪 Testing

Test your backend health endpoint:

```bash
curl https://your-backend-name.onrender.com/health
```

Expected response:
```json
{"status":"ok","timestamp":"2024-01-01T00:00:00.000Z"}
```

---

## 📝 Backend Scripts (Optional)

If you want to run keep-alive locally for testing:

```bash
# Single ping
cd backend
npm run keep-alive

# Continuous cron (runs every 5 minutes)
npm run keep-alive-cron
```

---

## ⚙️ Environment Variables

Make sure your Render backend has:
- `RENDER_EXTERNAL_URL` - Automatically set by Render
- `PORT` - Automatically set by Render

---

## 🎯 Best Practice

**Use BOTH**:
1. ✅ External cron service (cron-job.org) - Keeps backend alive 24/7
2. ✅ Frontend keep-alive - Additional layer when users are active

This ensures maximum uptime and reliability!

---

## 📚 More Details

See `backend/KEEP_ALIVE_SETUP.md` for detailed instructions and alternatives.

