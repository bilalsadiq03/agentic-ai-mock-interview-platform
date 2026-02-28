"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000"

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, full_name: fullName || null }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.detail || "Signup failed.")
        return
      }
      localStorage.setItem("access_token", data.access_token)
      localStorage.setItem("user_email", data.user?.email || "")
      router.push("/start")
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 pt-24">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_36px_rgba(0,0,0,0.08)]">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Get started</div>
        <h1 className="font-display mt-2 text-2xl font-extrabold text-slate-900">Create your account</h1>

        <form onSubmit={submit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Full name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Alex Morgan"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          {error && <div className="text-sm text-rose-600">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-[0_6px_18px_rgba(59,91,219,0.28)] transition hover:-translate-y-0.5 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="mt-4 text-sm text-slate-500">
          Already have an account? <Link href="/login" className="font-semibold text-blue-600">Sign in</Link>
        </div>
      </div>
    </div>
  )
}
