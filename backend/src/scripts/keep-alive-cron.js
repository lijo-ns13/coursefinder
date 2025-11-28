import cron from 'node-cron';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL || process.env.RENDER_EXTERNAL_URL || 'http://localhost:5000';

async function pingServer() {
  try {
    const response = await axios.get(`${BACKEND_URL}/health`, {
      timeout: 10000, // 10 second timeout
    });
    
    const timestamp = new Date().toISOString();
    console.log(`✅ [${timestamp}] Server is alive - Status: ${response.data.status}`);
    return true;
  } catch (error) {
    const timestamp = new Date().toISOString();
    console.error(`❌ [${timestamp}] Failed to ping server:`, error.message);
    return false;
  }
}

// Schedule: Every 5 minutes
// Format: minute hour day month day-of-week
// */5 means every 5 minutes
const cronSchedule = '*/5 * * * *';

console.log(`🚀 Starting keep-alive cron job...`);
console.log(`📡 Backend URL: ${BACKEND_URL}`);
console.log(`⏰ Schedule: Every 5 minutes`);
console.log(`🔄 Cron pattern: ${cronSchedule}`);

// Run immediately on start
pingServer();

// Schedule the cron job
const job = cron.schedule(cronSchedule, async () => {
  await pingServer();
}, {
  scheduled: true,
  timezone: "UTC"
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping keep-alive cron job...');
  job.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Stopping keep-alive cron job...');
  job.stop();
  process.exit(0);
});

console.log('✅ Keep-alive cron job is running. Press Ctrl+C to stop.');

