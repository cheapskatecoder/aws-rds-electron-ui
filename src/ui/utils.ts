import axios from "axios";

// Create API client to connect to our Flask backend
export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
});

// Add token to all requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Adding token to request:", config.url);
  }
  return config;
});

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const token = localStorage.getItem("token");
  console.log("Checking auth, token exists:", !!token);

  if (!token) {
    return false;
  }

  try {
    console.log("Verifying token with API...");
    const response = await axiosInstance.get("/api/verify-token");
    console.log("Token verification response:", response.data);
    return response.data.authenticated;
  } catch (error) {
    console.error("Token verification failed:", error);
    // If the verification fails, clear the token
    localStorage.removeItem("token");
    return false;
  }
};

// Interface for chat object
export interface Chat {
  id: number;
  chat_name: string | null;
  created_at: string;
}

// Interface for thread session
export interface ThreadSession {
  id: number;
  openai_thread_id: string;
  created_at: string;
}

// Interface for message
export interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

// User interface
export interface User {
  id: number;
  username: string;
}

// Login the user and store the token
export const loginUser = async (username: string, password: string) => {
  const response = await axiosInstance.post("/login", { username, password });
  if (response.data.status === "success") {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
  return response.data;
};

// Logout the user
export const logoutUser = async () => {
  try {
    await axiosInstance.get("/logout");
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};
