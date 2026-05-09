// Central API configuration.
// After deploying to Render, replace the production URL below with your actual Render URL.
// Example: https://valowiki-api.onrender.com
const CONFIG = {
  API_BASE_URL: (function () {
    const h = window.location.hostname;
    return h === 'localhost' || h === '127.0.0.1'
      ? 'http://localhost:3000'
      : 'https://valowiki-api.onrender.com'; // <-- update after Render deployment
  })()
};
