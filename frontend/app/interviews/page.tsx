"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000"

interface InterviewItem {
  id: string
  status: string
  created_at: string
  target_role?: string
}

export default function InterviewsPage() {
  const router = useRouter()
  const [items, setItems] = useState<InterviewItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchItems = async () => {
      const token = localStorage.getItem("access_token")
      if (!token) {
        router.push("/login")
        return
      }
      try {
        const res = await fetch(`${API_BASE}/resume/mine/list`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.detail || "Failed to load interviews")
          return
        }
        setItems(data.items || [])
      } catch {
        setError("Network error")
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [router])

  return (
    <div className="min-h-screen bg-slate-50 px-6 pt-24">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-3xl font-extrabold text-slate-900">My Interviews</h1>
        <p className="mt-2 text-slate-500">Your recent sessions and progress.</p>

        {loading && <p className="mt-6 text-sm text-slate-500">Loading...</p>}
        {error && <p className="mt-6 text-sm text-rose-600">{error}</p>}

        {!loading && !error && (
          <div className="mt-6 grid gap-3">
            {items.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                No interviews yet. Start one from the home page.
              </div>
            )}
            {items.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                <div>
                  <p className="font-semibold text-slate-900">{item.target_role || "Interview"}</p>
                  <p className="text-xs text-slate-500">Status: {item.status || "unknown"}</p>
                </div>
                <p className="text-xs text-slate-400">{item.created_at ? new Date(item.created_at).toLocaleString() : ""}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
