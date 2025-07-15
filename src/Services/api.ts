
import axios from "axios";

const baseURL = "https://app.runanalytic.com/"; 

export const api = axios.create({
  baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});