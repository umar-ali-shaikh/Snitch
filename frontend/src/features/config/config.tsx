// Backend port comes from frontend/.env (VITE_BACKEND_PORT). Falls back to 5000.
const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT ?? '5000'

export const config = {
  BACKEND_PORT,
  API_BASE_URL: `http://localhost:${BACKEND_PORT}/api`,
} as const
