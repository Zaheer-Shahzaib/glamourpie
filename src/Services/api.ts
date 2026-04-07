
import axios from "axios";

const baseURL = "https://app.runanalytic.com/";
// const baseURL = "http://localhost:5173/";
 export const API_BASE_URL = "http://localhost:5173";
// export const API_BASE_URL = "https://app.runanalytic.com";
// export const BACKEND_URL = API_BASE_URL;

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});