
import axios from "axios";

// Backend API URL - this should point to your backend server
const API_BASE_URL = "http://localhost:5173";
// For local development, uncomment this:
// const API_BASE_URL = "http://localhost:5000"; // or whatever port your backend runs on

// Export the backend URL for use in constructing avatar URLs and other static assets
export const BACKEND_URL = API_BASE_URL;

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});