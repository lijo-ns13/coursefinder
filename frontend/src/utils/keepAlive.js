/**
 * Keep-Alive Service for Render Backend
 * 
 * Pings the backend every 5 minutes to prevent Render from spinning it down.
 * This only works when the frontend is open, so it's recommended to also use
 * an external cron service for reliability.
 */

const KEEP_ALIVE_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
let keepAliveInterval = null;

export const startKeepAlive = () => {
  // Only run in production
  if (import.meta.env.MODE !== 'production') {
    console.log('Keep-alive disabled in development mode');
    return;
  }

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  const pingBackend = async () => {
    try {
      const response = await fetch(`${apiUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Don't wait too long, just trigger the request
        signal: AbortSignal.timeout(5000),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Keep-alive ping successful: ${data.status}`);
      }
    } catch (error) {
      // Silently fail - don't spam console
      if (error.name !== 'AbortError') {
        console.log('Keep-alive ping failed (this is normal if backend is spinning up)');
      }
    }
  };

  // Ping immediately
  pingBackend();

  // Then ping every 5 minutes
  keepAliveInterval = setInterval(pingBackend, KEEP_ALIVE_INTERVAL);

  console.log('🔄 Keep-alive service started (pinging every 5 minutes)');
};

export const stopKeepAlive = () => {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
    console.log('🛑 Keep-alive service stopped');
  }
};

