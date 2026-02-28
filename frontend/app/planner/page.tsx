"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

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

  useEffect(() => {
    const fetchPlan = async () => {
      const interviewId = localStorage.getItem("interview_id")
      
      if (!interviewId) {
        setError("No Interview ID found. Please go back and upload your resume.")
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`http://127.0.0.1:8000/resume/${interviewId}/plan`, {
          method: "POST"
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
  }, [])

  /* ── Loading State ── */
  if (loading) {
    return <div style={{ minHeight: "100vh", background: "#e5e7eb", padding: "100px", textAlign: "center", color: "#333", fontFamily: "sans-serif" }}>Generating your custom roadmap...</div>
  }

  /* ── Error State ── */
  if (error || !plan) {
    return (
      <div style={{ minHeight: "100vh", background: "#e5e7eb", padding: "100px", textAlign: "center", fontFamily: "sans-serif", color: "#ef4444" }}>
        <h2 style={{ color: "#000000" }}>⚠️ Error</h2>
        <p style={{ color: "#333", marginTop: "10px", marginBottom: "20px" }}>{error}</p>
        <Link href="/" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "bold" }}>&larr; Start Over</Link>
      </div>
    )
  }

  /* ── Success State (gray-200 Background) ── */
  return (
    <div style={{ minHeight: "100vh", background: "#e5e7eb", fontFamily: "sans-serif", color: "#000000" }}>
      <main style={{ maxWidth: "650px", margin: "0 auto", padding: "60px 20px" }}>
        
        <Link href="/Result" style={{ color: "#64748b", textDecoration: "none", fontWeight: "600", fontSize: "14px", display: "inline-block", marginBottom: "24px" }}>
          &larr; Back to Analysis
        </Link>
        
        <h1 style={{ margin: "0 0 32px 0", fontSize: "2.2rem", color: "#000000", letterSpacing: "-0.5px" }}>
          Interview Roadmap
        </h1>

        {/* Difficulty Section */}
        <div style={{ background: "#ffffff", border: "1px solid #d1d5db", borderRadius: "16px", padding: "24px", marginBottom: "20px" }}>
          <p style={{ margin: 0, fontSize: "12px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700" }}>Level</p>
          <h2 style={{ margin: "8px 0", color: "#000000", fontSize: "1.8rem" }}>{plan.difficulty}</h2>
          <p style={{ margin: 0, fontSize: "14px", color: "#334155" }}>{plan.num_questions} Questions Targeted</p>
        </div>

        {/* Topics Section */}
        <div style={{ background: "#ffffff", border: "1px solid #d1d5db", borderRadius: "16px", padding: "24px", marginBottom: "20px" }}>
          <h3 style={{ margin: "0 0 16px 0", color: "#000000", fontSize: "1.1rem" }}>Key Topics</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {plan.key_topics.map((topic, i) => (
              <span key={i} style={{ background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", padding: "8px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: "600" }}>
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Focus Areas Section */}
        <div style={{ background: "#ffffff", border: "1px solid #d1d5db", borderRadius: "16px", padding: "24px", marginBottom: "32px" }}>
          <h3 style={{ margin: "0 0 16px 0", color: "#000000", fontSize: "1.1rem" }}>Focus Areas</h3>
          <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
            {plan.focus_areas.map((area, i) => (
              <li key={i} style={{ display: "flex", gap: "12px", marginBottom: "12px", color: "#000000", fontSize: "15px", lineHeight: "1.5" }}>
                <span style={{ color: "#2563eb" }}>✦</span> {area}
              </li>
            ))}
          </ul>
        </div>

        {/* Start Button */}
        <Link href="/interview" style={{ 
          display: "block", textAlign: "center", background: "#2563eb", color: "#ffffff", 
          padding: "16px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", textDecoration: "none",
          boxShadow: "0 4px 14px rgba(37, 99, 235, 0.2)"
        }}>
          Start Mock Interview
        </Link>

      </main>
    </div>
  )
}