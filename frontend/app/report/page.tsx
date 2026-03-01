"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

// 1. Added 'section' to the interface
interface Evaluation {
  question_id: number
  score: number
  feedback: string
  question_text?: string
  candidate_answer?: string
  type?: "mcq" | "coding" | "text"
  section?: string 
}

interface FinalReport {
  evaluations: Evaluation[]
  overall_score: number
  summary: string
}

export default function ReportPage() {
  const [report, setReport] = useState<FinalReport | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("final_report")
    if (stored) {
      setReport(JSON.parse(stored))
    }
  }, [])

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-500 font-medium">Analyzing your comprehensive interview...</div>
      </div>
    )
  }

  // Helper to color-code scores
  const getScoreColor = (score: number) => {
    if (score >= 8) return { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" }
    if (score >= 5) return { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" }
    return { text: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" }
  }

  const overallColors = getScoreColor(report.overall_score)

  // 2. Group evaluations by section dynamically
  const groupedEvaluations = report.evaluations.reduce((acc, ev) => {
    const sectionName = ev.section || "General"
    if (!acc[sectionName]) acc[sectionName] = []
    acc[sectionName].push(ev)
    return acc
  }, {} as Record<string, Evaluation[]>)

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <main className="mx-auto max-w-4xl px-6 pt-20">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Interview Report</h1>
          <p className="mt-3 text-slate-500 text-lg">Detailed breakdown of your {report.evaluations.length}-question session.</p>
        </div>

        {/* Top Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm flex flex-col items-center"
        >
          <div className="relative mb-6 h-40 w-40">
            <svg width="160" height="160" className="-rotate-90 transform">
              <circle cx="80" cy="80" r="70" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray="440"
                initial={{ strokeDashoffset: 440 }}
                animate={{ strokeDashoffset: 440 - (440 * (report.overall_score * 10)) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round"
                className={overallColors.text}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-extrabold ${overallColors.text}`}>
                {report.overall_score}
              </span>
              <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest mt-1">out of 10</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Executive Summary</h2>
          <p className="mt-4 max-w-2xl text-slate-600 leading-relaxed">{report.summary}</p>
        </motion.div>

        {/* 3. Render questions grouped by their sections */}
        <div className="mt-12 space-y-12">
          {Object.entries(groupedEvaluations).map(([section, evals], sectionIndex) => (
            <div key={section} className="space-y-4">
              
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-2 border-b border-slate-200 pb-2">
                <h3 className="text-2xl font-bold text-slate-900 capitalize">{section} Module</h3>
                <span className="bg-slate-200 text-slate-700 py-0.5 px-3 rounded-full text-sm font-bold">
                  {evals.length} Questions
                </span>
              </div>

              {/* Accordions for this specific section */}
              <div className="space-y-3">
                {evals.map((ev, index) => {
                  const isExpanded = expandedId === ev.question_id
                  const colors = getScoreColor(ev.score)

                  return (
                    <motion.div
                      key={ev.question_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (sectionIndex * 0.1) + (index * 0.05) }}
                      className={`rounded-2xl border transition-all duration-200 ${isExpanded ? 'bg-white shadow-md border-slate-300' : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
                    >
                      {/* Clickable Header */}
                      <button 
                        onClick={() => setExpandedId(isExpanded ? null : ev.question_id)}
                        className="w-full text-left px-6 py-5 flex items-center gap-5"
                      >
                        <div className={`flex items-center justify-center w-12 h-12 rounded-xl font-extrabold text-lg flex-shrink-0 ${colors.bg} ${colors.text}`}>
                          {ev.score}
                        </div>
                        
                        <div className="flex-1 pr-4 min-w-0">
                          <p className="font-bold text-slate-800 text-lg truncate">
                            {ev.question_text ? ev.question_text : `Question ${ev.question_id}`}
                          </p>
                          {ev.type && (
                            <span className="inline-block mt-1 text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {ev.type}
                            </span>
                          )}
                        </div>

                        <div className={`transform transition-transform text-slate-400 ${isExpanded ? 'rotate-180' : ''}`}>
                          ▼
                        </div>
                      </button>

                      {/* Expandable Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 pt-2 border-t border-slate-100 mt-2">
                              
                              {/* Candidate's Answer */}
                              <div className="mb-6">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Your Answer</h4>
                                <div className="bg-slate-50 p-4 rounded-lg text-slate-700 font-mono text-sm border border-slate-100 whitespace-pre-wrap">
                                  {ev.candidate_answer || <span className="text-slate-400 italic">No answer provided.</span>}
                                </div>
                              </div>

                              {/* AI Feedback */}
                              <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Evaluator Feedback</h4>
                                <div className={`p-4 rounded-lg text-sm leading-relaxed border ${colors.bg} ${colors.text} ${colors.border}`}>
                                  {ev.feedback}
                                </div>
                              </div>
                              
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-16 mb-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/planner" className="rounded-xl border border-slate-300 bg-white px-8 py-3.5 text-center font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            Back to Dashboard
          </Link>
          <Link href="/" className="rounded-xl bg-blue-600 px-8 py-3.5 text-center font-bold text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition-all">
            Start New Interview
          </Link>
        </div>
      </main>
    </div>
  )
}