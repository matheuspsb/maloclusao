export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export function generateToken(): string {
  return crypto.randomUUID() + "-" + Date.now().toString(36)
}
