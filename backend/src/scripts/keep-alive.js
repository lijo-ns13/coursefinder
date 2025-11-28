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

// Run immediately
pingServer();

// Export for use in cron jobs
export default pingServer;

