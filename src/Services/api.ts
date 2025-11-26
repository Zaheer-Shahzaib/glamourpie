
import axios from "axios";

const baseURL = "https://app.runanalytic.com/"; 
// const baseURL = "http://localhost:5173/";

export const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});