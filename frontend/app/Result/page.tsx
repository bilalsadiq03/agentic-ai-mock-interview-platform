"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

interface ParsedData {
  name: string
  candidate_skills: string[]
  experience_level: "Junior" | "Mid" | "Senior"
  projects: any[]
  target_role: string
  required_skills: string[]
  skill_gap: string[]
  error?: string
}

function CoverageRing({ pct, colorClass }: { pct: number; colorClass: string }) {
  const [live, setLive] = useState(0)
  const SIZE = 128
  const STROKE = 10
  const r = (SIZE - STROKE) / 2
  const circ = 2 * Math.PI * r
  const dash = circ - (live / 100) * circ

  useEffect(() => {
    const t = setTimeout(() => setLive(pct), 400)
    return () => clearTimeout(t)
  }, [pct])

  return (
    <div className="relative h-32 w-32">
      <svg width={SIZE} height={SIZE} className="-rotate-90">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={r} fill="none" stroke="#e8eaf6" strokeWidth={STROKE} />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={r}
          fill="none"
          strokeWidth={STROKE}
          strokeDasharray={circ}
          strokeDashoffset={dash}
          strokeLinecap="round"
          className={`${colorClass} transition-[stroke-dashoffset] duration-[1400ms] ease-[cubic-bezier(.4,0,.2,1)]`}
          stroke="currentColor"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-extrabold text-slate-900">
          {pct}<span className="text-sm font-semibold text-slate-400">%</span>
        </span>
        <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-slate-400">Match</span>
      </div>
    </div>
  )
}

function SkillTag({ label, variant }: { label: string; variant: "have" | "required" | "gap" }) {
  const map = {
    have: "bg-emerald-50 border-emerald-200 text-emerald-600",
    required: "bg-blue-50 border-blue-200 text-blue-600",
    gap: "bg-rose-50 border-rose-200 text-rose-600",
  }
  const prefix = variant === "have" ? "?" : variant === "gap" ? "+" : "?"
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${map[variant]}`}>
      {prefix} {label}
    </span>
  )
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_rgba(59,91,219,0.06)] ${className}`}>
      {children}
    </div>
  )
}

function SectionTitle({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-500 text-sm text-white shadow-[0_3px_10px_rgba(59,91,219,0.22)]">
        {emoji}
      </div>
      <h2 className="font-display text-sm font-bold text-slate-900">{title}</h2>
    </div>
  )
}

function LevelBadge({ level }: { level: string }) {
  const map: Record<string, string> = {
    Junior: "bg-orange-50 border-orange-200 text-orange-600",
    Mid: "bg-blue-50 border-blue-200 text-blue-600",
    Senior: "bg-emerald-50 border-emerald-200 text-emerald-600",
  }
  const cls = map[level] ?? map.Mid
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold tracking-[0.08em] ${cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {level} Level
    </span>
  )
}

export default function ResultPage() {
  const [data, setData] = useState<ParsedData | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("parsedData")
    if (stored) setData(JSON.parse(stored))
  }, [])

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 pt-28 text-center">
        <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4">
          <div className="h-11 w-11 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
          <p className="text-sm text-slate-500">Analysing your resume?</p>
        </div>
      </div>
    )
  }

  if (data.error) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 pt-28 text-center">
        <Card className="mx-auto max-w-md text-center">
          <div className="text-3xl">??</div>
          <h2 className="font-display mt-3 text-lg font-bold text-slate-900">Analysis Failed</h2>
          <p className="mt-2 text-sm text-slate-500">{data.error}</p>
          <Link href="/" className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white">? Try Again</Link>
        </Card>
      </div>
    )
  }

  const totalRequired = data.required_skills.length
  const matched = data.candidate_skills.filter((s) =>
    data.required_skills.some((r) => r.toLowerCase() === s.toLowerCase())
  ).length
  const matchPct = totalRequired > 0 ? Math.round((matched / totalRequired) * 100) : 0
  const ringClass = matchPct >= 75 ? "text-emerald-600" : matchPct >= 50 ? "text-orange-500" : "text-rose-600"
  const matchLabel = matchPct >= 75 ? "Strong Fit" : matchPct >= 50 ? "Partial Fit" : "Skill Gap"

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="mx-auto max-w-6xl px-6 pt-20">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 text-white shadow-[0_4px_14px_rgba(59,91,219,0.28)]">?</div>
            <span className="font-display text-sm font-extrabold text-slate-900">InterviewIQ</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600">? Back</Link>
            <Link href="/career-plan" className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white">Career Planner</Link>
            <Link href="/planner" className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white">Start Interview ?</Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-blue-600">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 text-white">?</span>
            Resume Analysis
          </div>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-[clamp(1.8rem,3vw,2.6rem)] font-extrabold text-slate-900">
                {data.name || "Candidate"}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <LevelBadge level={data.experience_level} />
                <span className="text-sm text-slate-500">
                  Applying for: <strong className="text-slate-700">{data.target_role}</strong>
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-[260px_1fr_1fr]">
          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.14 }}>
            <Card className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-400">Skills Match</p>
              <CoverageRing pct={matchPct} colorClass={ringClass} />
              <div>
                <div className={`inline-block rounded-full border px-3 py-1 text-xs font-bold ${ringClass} border-current/30 bg-current/10`}>
                  {matchLabel}
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  <span className="font-mono font-semibold text-slate-700">{matched}</span> of <span className="font-mono font-semibold text-slate-700">{totalRequired}</span> required skills found
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
            <Card className="h-full">
              <SectionTitle emoji="???" title="Your Skills" />
              <div className="flex flex-wrap gap-2">
                {data.candidate_skills.length > 0
                  ? data.candidate_skills.map((s) => <SkillTag key={s} label={s} variant="have" />)
                  : <p className="text-sm text-slate-500">No skills detected.</p>}
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
            <Card className="h-full">
              <SectionTitle emoji="??" title="Role Requirements" />
              <div className="flex flex-wrap gap-2">
                {data.required_skills.length > 0
                  ? data.required_skills.map((s) => <SkillTag key={s} label={s} variant="required" />)
                  : <p className="text-sm text-slate-500">No required skills found in JD.</p>}
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.27 }}>
            <Card>
              <SectionTitle emoji="??" title="Skill Gap" />
              {data.skill_gap.length > 0 ? (
                <>
                  <p className="mb-3 text-sm text-slate-500">
                    These skills are required for <strong className="text-slate-700">{data.target_role}</strong> but not found in your resume.
                  </p>
                  <div className="space-y-2">
                    {data.skill_gap.map((s, i) => (
                      <div key={s} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md border border-rose-200 bg-rose-50 text-xs font-bold text-rose-600">{i + 1}</div>
                        <span className="text-sm font-semibold text-slate-700">{s}</span>
                        <span className="ml-auto rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-[0.6rem] font-bold uppercase text-rose-600">Missing</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
                  <span className="text-2xl">??</span>
                  <p className="mt-2 text-sm font-semibold text-emerald-600">No skill gaps detected!</p>
                  <p className="text-xs text-slate-500">Your skills fully cover the role requirements.</p>
                </div>
              )}
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.31 }}>
            <Card>
              <SectionTitle emoji="??" title="Projects" />
              {data.projects && data.projects.length > 0 ? (
                <div className="space-y-2">
                  {data.projects.map((proj: any, i) => {
                    const projName = typeof proj === "object" && proj !== null ? (proj.name || "Untitled Project") : proj
                    const projTech = typeof proj === "object" && proj !== null && Array.isArray(proj.technologies) ? proj.technologies.join(", ") : null
                    return (
                      <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-sm">
                            {"?? ?? ?? ?? ??".split(" ")[i % 5]}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{projName}</p>
                            {projTech && <p className="mt-1 text-xs font-medium text-blue-600">{projTech}</p>}
                            <p className="mt-1 text-xs text-slate-400">Project {i + 1}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
                  <span className="text-2xl">??</span>
                  <p className="mt-2 text-sm text-slate-500">No projects found in resume.</p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }} className="mt-6 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-500 to-indigo-300 p-6 text-white shadow-[0_12px_40px_rgba(59,91,219,0.28)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-extrabold">
                Ready to practice for <span className="opacity-80">{data.target_role}</span>?
              </h3>
              <p className="mt-1 text-sm text-white/70">
                Run a targeted AI mock interview based on your exact skill gap.
                {data.skill_gap.length > 0 && (
                  <> Focus areas: <strong className="text-white/90">{data.skill_gap.slice(0, 3).join(", ")}</strong>.</>
                )}
              </p>
            </div>

            <div className="flex gap-2">
              <Link href="/learning-roadmap" className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-bold text-white">
                Learning Roadmap
              </Link>
              <Link href="/planner" className="rounded-lg bg-white px-4 py-2 text-sm font-extrabold text-blue-600">
                Start Mock Interview
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
