const LOCAL_API = "http://127.0.0.1:5000";
const PROD_API = "https://lexica-3tmd.onrender.com";

// Simple switch based on environment
const API_BASE_URL = process.env.NODE_ENV === "development" ? LOCAL_API : PROD_API;

export default {
  API_BASE_URL,
};
