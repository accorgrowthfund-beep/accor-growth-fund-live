// utils/cors.js
function setCorsHeaders(res, allowedOrigins = "*", allowedMethods = "GET, POST, OPTIONS", allowedHeaders = "Content-Type, Authorization") {
  res.setHeader("Access-Control-Allow-Origin", allowedOrigins);
  res.setHeader("Access-Control-Allow-Methods", allowedMethods);
  res.setHeader("Access-Control-Allow-Headers", allowedHeaders);
}

// Handle preflight request
function handlePreflight(req, res) {
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true; // indicates request handled
  }
  return false;
}

module.exports = { setCorsHeaders, handlePreflight };