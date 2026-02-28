"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000"

interface Me {
  email: string
  full_name?: string | null
}

export default function ProfilePage() {
  const router = useRouter()
  const [me, setMe] = useState<Me | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem("access_token")
      if (!token) {
        router.push("/login")
        return
      }
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.detail || "Failed to load profile")
          return
        }
        setMe(data)
      } catch {
        setError("Network error")
      }
    }

    fetchMe()
  }, [router])

  return (
    <div className="min-h-screen bg-slate-50 px-6 pt-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-extrabold text-slate-900">Profile</h1>
        <p className="mt-2 text-slate-500">Account details and preferences.</p>

        {error && <p className="mt-6 text-sm text-rose-600">{error}</p>}

        {me && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
            <div className="text-sm text-slate-500">Email</div>
            <div className="text-lg font-semibold text-slate-900">{me.email}</div>

            <div className="mt-4 text-sm text-slate-500">Full name</div>
            <div className="text-lg font-semibold text-slate-900">{me.full_name || "Not set"}</div>
          </div>
        )}
      </div>
    </div>
  )
}
