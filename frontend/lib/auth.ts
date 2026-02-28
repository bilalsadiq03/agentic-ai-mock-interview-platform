const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("access_token")
}

export function clearAuth() {
  if (typeof window === "undefined") return
  localStorage.removeItem("access_token")
  localStorage.removeItem("user_email")
}

export async function fetchMe(): Promise<{ email: string } | null> {
  const token = getToken()
  if (!token) return null

  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return null
  return res.json()
}
