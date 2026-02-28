"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"

interface Evaluation {
  question_id: number
  score: number
  feedback: string
}

interface FinalReport {
  evaluations: Evaluation[]
  overall_score: number
  summary: string
}

export default function ReportPage() {
  const router = useRouter()
  const [report, setReport] = useState<FinalReport | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("final_report")
    if (stored) {
      setReport(JSON.parse(stored))
    }
  }, [])

  if (!report) {
    return (
      <div style={{ minHeight: "100vh", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        <p>Loading your report...</p>
      </div>
    )
  }

  const scoreColor = report.overall_score >= 7 ? "#10b981" : report.overall_score >= 5 ? "#f59e0b" : "#ef4444"

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", color: "#1f2937", fontFamily: "sans-serif", padding: "60px 20px" }}>
      <main style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#111827", marginBottom: "10px" }}>Interview Report</h1>
          <p style={{ color: "#6b7280", fontSize: "1.1rem" }}>Here is how you performed in your mock session.</p>
        </div>

        {/* Overall Score Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: "#ffffff", borderRadius: "24px", padding: "40px", textAlign: "center", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)", marginBottom: "32px", border: "1px solid #e5e7eb" }}
        >
          <div style={{ position: "relative", display: "inline-block", marginBottom: "20px" }}>
             {/* Circular Progress Ring */}
            <svg width="140" height="140">
              <circle cx="70" cy="70" r="60" fill="transparent" stroke="#e5e7eb" strokeWidth="10" />
              <circle 
                cx="70" cy="70" r="60" fill="transparent" stroke={scoreColor} strokeWidth="10" 
                strokeDasharray="377" strokeDashoffset={377 - (377 * (report.overall_score * 10)) / 100}
                strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease-out" }}
              />
            </svg>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "2rem", fontWeight: "800" }}>
              {report.overall_score}<span style={{ fontSize: "1rem", color: "#9ca3af" }}>/10</span>
            </div>
          </div>
          
          <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "12px" }}>Overall Performance</h2>
          <p style={{ color: "#4b5563", lineHeight: "1.6", fontSize: "1.05rem", maxWidth: "600px", margin: "0 auto" }}>
            {report.summary}
          </p>
        </motion.div>

        {/* Detailed Breakdown */}
        <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "16px", paddingLeft: "8px" }}>Question Breakdown</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {report.evaluations.map((ev, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
              style={{ background: "#ffffff", borderRadius: "16px", padding: "24px", border: "1px solid #e5e7eb", display: "flex", gap: "20px", alignItems: "flex-start" }}
            >
              <div style={{ background: ev.score >= 7 ? "#ecfdf5" : "#fffbeb", color: ev.score >= 7 ? "#059669" : "#d97706", padding: "8px 12px", borderRadius: "10px", fontWeight: "800", fontSize: "1.1rem" }}>
                {ev.score}
              </div>
              <div>
                <p style={{ fontWeight: "700", color: "#374151", marginBottom: "6px" }}>Question {ev.question_id}</p>
                <p style={{ color: "#6b7280", fontSize: "0.95rem", lineHeight: "1.5" }}>{ev.feedback}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ marginTop: "48px", display: "flex", justifyContent: "center", gap: "20px" }}>
          <Link href="/planner" style={{ padding: "14px 28px", borderRadius: "12px", background: "#ffffff", color: "#374151", textDecoration: "none", fontWeight: "700", border: "1px solid #d1d5db" }}>
            Back to Planner
          </Link>
          <Link href="/" style={{ padding: "14px 28px", borderRadius: "12px", background: "#2563eb", color: "#ffffff", textDecoration: "none", fontWeight: "700", boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)" }}>
            New Analysis
          </Link>
        </div>

      </main>
    </div>
  )
}