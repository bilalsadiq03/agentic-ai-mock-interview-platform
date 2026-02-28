"use client"

import { useEffect, useState } from "react"
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
  const [report, setReport] = useState<FinalReport | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("final_report")
    if (stored) {
      setReport(JSON.parse(stored))
    }
  }, [])

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 pt-28 text-center">
        <p className="text-sm text-slate-600">Loading your report...</p>
      </div>
    )
  }

  const scoreClass = report.overall_score >= 7 ? "text-emerald-600" : report.overall_score >= 5 ? "text-orange-500" : "text-rose-600"

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <main className="mx-auto max-w-3xl px-6 pt-24">
        <div className="text-center">
          <h1 className="font-display text-3xl font-extrabold text-slate-900">Interview Report</h1>
          <p className="mt-2 text-slate-500">Here is how you performed in your mock session.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)]"
        >
          <div className="relative mx-auto mb-4 h-36 w-36">
            <svg width="140" height="140">
              <circle cx="70" cy="70" r="60" fill="transparent" stroke="#e5e7eb" strokeWidth="10" />
              <circle
                cx="70"
                cy="70"
                r="60"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray="377"
                strokeDashoffset={377 - (377 * (report.overall_score * 10)) / 100}
                strokeLinecap="round"
                className={`${scoreClass} transition-[stroke-dashoffset] duration-1000 ease-out`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-3xl font-extrabold text-slate-900">
              {report.overall_score}<span className="text-base text-slate-400">/10</span>
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-900">Overall Performance</h2>
          <p className="mx-auto mt-2 max-w-xl text-slate-500">{report.summary}</p>
        </motion.div>

        <h3 className="mt-8 text-lg font-bold text-slate-900">Question Breakdown</h3>
        <div className="mt-4 space-y-3">
          {report.evaluations.map((ev, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className={`rounded-lg px-3 py-2 text-lg font-extrabold ${ev.score >= 7 ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"}`}>
                {ev.score}
              </div>
              <div>
                <p className="font-bold text-slate-700">Question {ev.question_id}</p>
                <p className="mt-1 text-sm text-slate-500">{ev.feedback}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/planner" className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700">
            Back to Planner
          </Link>
          <Link href="/" className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(37,99,235,0.3)]">
            New Analysis
          </Link>
        </div>
      </main>
    </div>
  )
}
