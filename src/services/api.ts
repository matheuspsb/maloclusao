import axios from "axios"

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:3333"}/api`,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("maloclusao-auth")
  if (stored) {
    const token = JSON.parse(stored)?.state?.session?.token as string | undefined
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message)
    return Promise.reject(error)
  }
)
