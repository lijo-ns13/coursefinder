# Keep-Alive Setup for Render Free Tier

Render's free tier spins down services after **15 minutes** of inactivity. To keep your backend alive, you need to ping it every 5 minutes.

## Option 1: External Cron Service (Recommended)

Use a free external cron service to ping your backend every 5 minutes.

### Using cron-job.org (Free)

1. Go to [https://cron-job.org](https://cron-job.org)
2. Sign up for a free account
3. Click "Create cronjob"
4. Configure:
   - **Title**: Keep Render Backend Alive
   - **Address**: `https://your-backend-url.onrender.com/health`
   - **Schedule**: Every 5 minutes (`*/5 * * * *`)
   - **Request method**: GET
   - **Save** the cronjob

### Using EasyCron (Free)

1. Go to [https://www.easycron.com](https://www.easycron.com)
2. Sign up for free account
3. Create new cron job:
   - **URL**: `https://your-backend-url.onrender.com/health`
   - **Schedule**: `*/5 * * * *` (every 5 minutes)
   - **Method**: GET
   - **Save**

### Using UptimeRobot (Free - 50 monitors)

1. Go to [https://uptimerobot.com](https://uptimerobot.com)
2. Sign up for free account
3. Add New Monitor:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: Backend Keep-Alive
   - **URL**: `https://your-backend-url.onrender.com/health`
   - **Monitoring Interval**: 5 minutes
   - **Save**

## Option 2: Local Cron Script (For Testing)

Run the keep-alive script locally using node-cron:

```bash
cd backend
npm run keep-alive
```

**Note**: This only works if your local machine is always running. For production, use Option 1.

## Option 3: Frontend Keep-Alive (Alternative)

You can also add a keep-alive mechanism in your frontend that pings the backend every 5 minutes when the app is open.

Add this to your frontend `App.jsx` or a service file:

```javascript
// Keep backend alive on Render
if (import.meta.env.PROD) {
  setInterval(async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/health`);
    } catch (error) {
      console.log('Keep-alive ping failed:', error);
    }
  }, 5 * 60 * 1000); // Every 5 minutes
}
```

## Environment Variables

Make sure your backend has these environment variables set in Render:

- `BACKEND_URL` or `RENDER_EXTERNAL_URL` - Your Render backend URL
- `PORT` - Port number (Render sets this automatically)

## Testing

Test your keep-alive setup:

```bash
# Test the health endpoint
curl https://your-backend-url.onrender.com/health

# Should return:
# {"status":"ok","timestamp":"2024-01-01T00:00:00.000Z"}
```

## Important Notes

1. **Render Free Tier**: Services spin down after 15 minutes of inactivity
2. **Cold Start**: First request after spin-down takes 30-60 seconds
3. **Ping Interval**: Every 5 minutes ensures your service stays warm
4. **Cost**: External cron services are free for basic usage
5. **Reliability**: External cron services are more reliable than frontend-based solutions

## Recommended Setup

**Best Practice**: Use **cron-job.org** or **UptimeRobot** for reliable keep-alive pings. They're free, reliable, and work even when your frontend is closed.

