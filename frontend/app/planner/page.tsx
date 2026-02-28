"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000"

interface InterviewPlan {
  difficulty: string
  key_topics: string[]
  num_questions: number
  focus_areas: string[]
}

export default function PlannerPage() {
  const [plan, setPlan] = useState<InterviewPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchPlan = async () => {
      const token = localStorage.getItem("access_token")
      if (!token) {
        router.push("/login")
        return
      }
      const interviewId = localStorage.getItem("interview_id")

      if (!interviewId) {
        setError("No Interview ID found. Please go back and upload your resume.")
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`${API_BASE}/resume/${interviewId}/plan`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()

        if (res.ok && data.success) {
          setPlan(data.interview_plan)
        } else {
          setError(data.detail || "Failed to generate plan.")
        }
      } catch (err) {
        setError("Network error: Could not reach the backend.")
      } finally {
        setLoading(false)
      }
    }

    fetchPlan()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 pt-28 text-center text-slate-600">
        Generating your custom roadmap...
      </div>
    )
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 pt-28 text-center text-rose-600">
        <h2 className="text-xl font-bold text-slate-900">Error</h2>
        <p className="mt-2 text-slate-600">{error}</p>
        <Link href="/" className="mt-5 inline-block text-sm font-semibold text-blue-600">? Start Over</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <main className="mx-auto max-w-2xl px-6 pt-24">
        <Link href="/result" className="text-sm font-semibold text-slate-500">? Back to Analysis</Link>

        <h1 className="font-display mt-4 text-3xl font-extrabold text-slate-900">Interview Roadmap</h1>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(0,0,0,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Level</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">{plan.difficulty}</h2>
          <p className="mt-1 text-sm text-slate-600">{plan.num_questions} Questions Targeted</p>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(0,0,0,0.06)]">
          <h3 className="text-lg font-bold text-slate-900">Key Topics</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {plan.key_topics.map((topic, i) => (
              <span key={i} className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                {topic}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(0,0,0,0.06)]">
          <h3 className="text-lg font-bold text-slate-900">Focus Areas</h3>
          <ul className="mt-4 space-y-2">
            {plan.focus_areas.map((area, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="text-blue-600">?</span>
                {area}
              </li>
            ))}
          </ul>
        </div>

        <Link
          href="/interview"
          className="mt-6 block rounded-xl bg-blue-600 px-4 py-4 text-center text-sm font-bold text-white shadow-[0_6px_18px_rgba(59,91,219,0.28)] transition hover:-translate-y-0.5 hover:bg-blue-500"
        >
          Start Mock Interview
        </Link>
      </main>
    </div>
  )
}
