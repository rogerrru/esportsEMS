// Central API configuration.
// After deploying to Render, replace the production URL below with your actual Render URL.
// Example: https://valowiki-api.onrender.com
const CONFIG = {
  API_BASE_URL: (function () {
    const h = window.location.hostname;
    // '' = file:// protocol (opened directly), localhost / 127.0.0.1 = local dev server
    return h === '' || h === 'localhost' || h === '127.0.0.1'
      ? 'http://localhost:3000'
      : 'https://valowiki-api.onrender.com';
  })()
};
