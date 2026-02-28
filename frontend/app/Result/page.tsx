"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

/* ── Exact shape returned by your backend ── */
interface ParsedData {
  name:             string
  candidate_skills: string[]
  experience_level: "Junior" | "Mid" | "Senior"
  projects:         any[] // ⭐ FIX: Changed from string[] to any[] to allow objects
  target_role:      string
  required_skills:  string[]
  skill_gap:        string[]
  error?:           string
}

/* ─────────────── Skill coverage ring ─────────────── */
function CoverageRing({ pct, color }: { pct: number; color: string }) {
  const [live, setLive] = useState(0)
  const SIZE = 128, STROKE = 10
  const r     = (SIZE - STROKE) / 2
  const circ  = 2 * Math.PI * r
  const dash  = circ - (live / 100) * circ

  useEffect(() => {
    const t = setTimeout(() => setLive(pct), 400)
    return () => clearTimeout(t)
  }, [pct])

  return (
    <div style={{ position: "relative", width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={SIZE/2} cy={SIZE/2} r={r} fill="none" stroke="#e8eaf6" strokeWidth={STROKE} />
        <circle
          cx={SIZE/2} cy={SIZE/2} r={r}
          fill="none" stroke={color} strokeWidth={STROKE}
          strokeDasharray={circ} strokeDashoffset={dash}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "1.8rem", fontWeight: 800, color: "#0f1133", lineHeight: 1 }}>{pct}<span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#8b90b8" }}>%</span></span>
        <span style={{ fontSize: "0.6rem", color: "#8b90b8", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", marginTop: 2 }}>Match</span>
      </div>
    </div>
  )
}

/* ─────────────── Skill tag ─────────────── */
function SkillTag({ label, variant }: { label: string; variant: "have" | "required" | "gap" }) {
  const map = {
    have:     { bg: "rgba(12,166,120,.09)",  bd: "rgba(12,166,120,.22)",  color: "#0ca678",  prefix: "✓" },
    required: { bg: "rgba(59,91,219,.08)",   bd: "rgba(59,91,219,.22)",   color: "#3b5bdb",  prefix: "·" },
    gap:      { bg: "rgba(225,29,72,.07)",   bd: "rgba(225,29,72,.2)",    color: "#e11d48",  prefix: "+" },
  }
  const s = map[variant]
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 100, fontSize: "0.75rem", fontWeight: 600, background: s.bg, border: `1.5px solid ${s.bd}`, color: s.color, marginBottom: 7, marginRight: 6, whiteSpace: "nowrap" }}>
      {s.prefix} {label}
    </span>
  )
}

/* ─────────────── Card ─────────────── */
function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "#fff", border: "1.5px solid #e8eaf6", borderRadius: 20, padding: "26px 28px", boxShadow: "0 4px 20px rgba(59,91,219,.06)", ...style }}>
      {children}
    </div>
  )
}

/* ─────────────── Section title ─────────────── */
function SectionTitle({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 18 }}>
      <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,#3b5bdb,#4c6ef5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.88rem", boxShadow: "0 3px 10px rgba(59,91,219,.22)" }}>
        {emoji}
      </div>
      <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "0.95rem", fontWeight: 700, color: "#0f1133", letterSpacing: "-0.01em" }}>{title}</h2>
    </div>
  )
}

/* ─────────────── Level badge ─────────────── */
function LevelBadge({ level }: { level: string }) {
  const map: Record<string, { color: string; bg: string; bd: string }> = {
    Junior: { color: "#f76707", bg: "rgba(247,103,7,.09)",  bd: "rgba(247,103,7,.22)"  },
    Mid:    { color: "#3b5bdb", bg: "rgba(59,91,219,.09)",  bd: "rgba(59,91,219,.22)"  },
    Senior: { color: "#0ca678", bg: "rgba(12,166,120,.09)", bd: "rgba(12,166,120,.22)" },
  }
  const s = map[level] ?? map["Mid"]
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 100, fontSize: "0.78rem", fontWeight: 700, letterSpacing: ".04em", background: s.bg, border: `1.5px solid ${s.bd}`, color: s.color }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.color, display: "inline-block" }} />
      {level} Level
    </span>
  )
}

/* ═══════════════════════ Main Page ═══════════════════════ */
export default function ResultPage() {
  const [data, setData] = useState<ParsedData | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("parsedData")
    if (stored) setData(JSON.parse(stored))
  }, [])

  /* Loading state */
  if (!data) {
    return (
      <div style={{ minHeight: "100vh", background: "#f5f6ff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Figtree',sans-serif" }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", border: "3px solid #e8eaf6", borderTopColor: "#3b5bdb", animation: "spin .8s linear infinite" }} />
          <p style={{ color: "#8b90b8", fontWeight: 500, fontSize: "0.9rem" }}>Analysing your resume…</p>
        </div>
      </div>
    )
  }

  /* Error state */
  if (data.error) {
    return (
      <div style={{ minHeight: "100vh", background: "#f5f6ff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Figtree',sans-serif" }}>
        <Card style={{ maxWidth: 480, textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 14 }}>⚠️</div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#0f1133", marginBottom: 8 }}>Analysis Failed</h2>
          <p style={{ color: "#8b90b8", fontSize: "0.875rem", lineHeight: 1.65 }}>{data.error}</p>
          <Link href="/" style={{ display: "inline-block", marginTop: 20, padding: "10px 24px", background: "#3b5bdb", color: "#fff", borderRadius: 10, fontSize: "0.875rem", fontWeight: 700, textDecoration: "none" }}>← Try Again</Link>
        </Card>
      </div>
    )
  }

  /* Compute skill match percentage */
  const totalRequired = data.required_skills.length
  const matched       = data.candidate_skills.filter(s =>
    data.required_skills.some(r => r.toLowerCase() === s.toLowerCase())
  ).length
  const matchPct  = totalRequired > 0 ? Math.round((matched / totalRequired) * 100) : 0
  const ringColor = matchPct >= 75 ? "#0ca678" : matchPct >= 50 ? "#f76707" : "#e11d48"
  const matchLabel = matchPct >= 75 ? "Strong Fit" : matchPct >= 50 ? "Partial Fit" : "Skill Gap"

  const FH = "'Bricolage Grotesque',sans-serif"
  const FB = "'Figtree',sans-serif"
  const FM = "'JetBrains Mono',monospace"

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Figtree:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#f5f6ff}
        @keyframes spin{to{transform:rotate(360deg)}}
        .nav-btn:hover{border-color:#3b5bdb!important;color:#3b5bdb!important;background:#f8f9ff!important}
        .planner-btn:hover{background:#0ca678!important;transform:translateY(-1px);box-shadow:0 8px 25px rgba(12,166,120,.25)!important}
        .start-btn:hover{background:#4c6ef5!important;transform:translateY(-1px);box-shadow:0 10px 30px rgba(59,91,219,.4)!important}
        .proj-card:hover{border-color:#748ffc!important;box-shadow:0 6px 22px rgba(59,91,219,.1)!important;transform:translateY(-2px)}
      `}</style>

      {/* Ambient background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 700px 500px at 0% 0%, rgba(59,91,219,0.06) 0%, transparent 60%), radial-gradient(ellipse 500px 400px at 100% 100%, rgba(12,166,120,0.05) 0%, transparent 60%), #f5f6ff" }} />

      <main style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "36px 40px 80px", fontFamily: FB }}>

        {/* ── Topbar ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 38 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#3b5bdb,#4c6ef5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1rem", boxShadow: "0 4px 14px rgba(59,91,219,.28)" }}>⚡</div>
            <span style={{ fontFamily: FH, fontWeight: 800, fontSize: "1rem", color: "#0f1133", letterSpacing: "-0.02em" }}>InterviewIQ</span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link href="/" className="nav-btn" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 18px", background: "#fff", border: "1.5px solid #d1d5f0", borderRadius: 10, fontSize: "0.84rem", fontWeight: 600, color: "#3d4270", textDecoration: "none", transition: "all .18s" }}>
              ← Back
            </Link>
            
            {/* Planner Button */}
            <Link href="/planner" className="planner-btn" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 20px", background: "#12b886", border: "none", borderRadius: 10, fontSize: "0.84rem", fontWeight: 700, color: "#fff", textDecoration: "none", boxShadow: "0 4px 14px rgba(18,184,134,.2)", transition: "all .2s" }}>
              <span style={{ fontSize: "1rem" }}>🗓️</span> Career Planner
            </Link>

            <Link href="/start" className="start-btn" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 20px", background: "#3b5bdb", border: "none", borderRadius: 10, fontSize: "0.84rem", fontWeight: 700, color: "#fff", textDecoration: "none", boxShadow: "0 4px 14px rgba(59,91,219,.28)", transition: "all .2s" }}>
              Start Interview →
            </Link>
          </div>
        </motion.div>

        {/* ── Candidate header ── */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          style={{ marginBottom: 28 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 12px 4px 8px", background: "#fff", border: "1.5px solid #e8eaf6", borderRadius: 100, fontSize: "0.68rem", fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: "#3b5bdb", marginBottom: 14, boxShadow: "0 2px 8px rgba(59,91,219,.07)" }}>
            <div style={{ width: 17, height: 17, borderRadius: "50%", background: "linear-gradient(135deg,#3b5bdb,#4c6ef5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.55rem" }}>✦</div>
            Resume Analysis
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: FH, fontSize: "clamp(1.9rem,3vw,2.8rem)", fontWeight: 800, color: "#0f1133", letterSpacing: "-0.03em", marginBottom: 8 }}>
                {data.name || "Candidate"}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <LevelBadge level={data.experience_level} />
                <span style={{ fontSize: "0.85rem", color: "#8b90b8", fontWeight: 500 }}>
                  Applying for: <strong style={{ color: "#3d4270" }}>{data.target_role}</strong>
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ══ ROW 1: Match Ring + Skills side by side ══ */}
        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr 1fr", gap: 16, marginBottom: 16 }}>

          {/* Skill match ring */}
          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.14 }}>
            <Card style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, textAlign: "center", height: "100%" }}>
              <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#8b90b8" }}>Skills Match</p>
              <CoverageRing pct={matchPct} color={ringColor} />
              <div>
                <div style={{ padding: "4px 14px", borderRadius: 100, background: ringColor + "15", border: `1.5px solid ${ringColor}33`, fontSize: "0.76rem", fontWeight: 700, color: ringColor, letterSpacing: ".04em", display: "inline-block", marginBottom: 8 }}>
                  {matchLabel}
                </div>
                <p style={{ fontSize: "0.75rem", color: "#8b90b8", lineHeight: 1.5 }}>
                  <strong style={{ color: "#3d4270", fontFamily: FM }}>{matched}</strong> of <strong style={{ color: "#3d4270", fontFamily: FM }}>{totalRequired}</strong> required skills found
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Candidate skills */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
            <Card style={{ height: "100%" }}>
              <SectionTitle emoji="🛠️" title="Your Skills" />
              <div>
                {data.candidate_skills.length > 0
                  ? data.candidate_skills.map((s) => <SkillTag key={s} label={s} variant="have" />)
                  : <p style={{ fontSize: "0.84rem", color: "#8b90b8" }}>No skills detected.</p>
                }
              </div>
            </Card>
          </motion.div>

          {/* Required skills */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
            <Card style={{ height: "100%" }}>
              <SectionTitle emoji="📋" title="Role Requirements" />
              <div>
                {data.required_skills.length > 0
                  ? data.required_skills.map((s) => <SkillTag key={s} label={s} variant="required" />)
                  : <p style={{ fontSize: "0.84rem", color: "#8b90b8" }}>No required skills found in JD.</p>
                }
              </div>
            </Card>
          </motion.div>
        </div>

        {/* ══ ROW 2: Skill Gap + Projects ══ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

          {/* Skill Gap */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.27 }}>
            <Card>
              <SectionTitle emoji="🔧" title="Skill Gap" />
              {data.skill_gap.length > 0 ? (
                <>
                  <p style={{ fontSize: "0.82rem", color: "#8b90b8", marginBottom: 14, lineHeight: 1.55 }}>
                    These skills are required for <strong style={{ color: "#3d4270" }}>{data.target_role}</strong> but not found in your resume. Focus on these before your interview.
                  </p>
                  <div>
                    {data.skill_gap.map((s, i) => (
                      <div key={s} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: i % 2 === 0 ? "#fafbff" : "#fff", border: "1px solid #eef0f8", marginBottom: 6 }}>
                        <div style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(225,29,72,.08)", border: "1.5px solid rgba(225,29,72,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800, color: "#e11d48", flexShrink: 0 }}>
                          {i + 1}
                        </div>
                        <span style={{ fontSize: "0.855rem", fontWeight: 600, color: "#3d4270" }}>{s}</span>
                        <span style={{ marginLeft: "auto", fontSize: "0.68rem", fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color: "#e11d48", background: "rgba(225,29,72,.07)", padding: "2px 8px", borderRadius: 6, border: "1px solid rgba(225,29,72,.15)" }}>Missing</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "28px 0", gap: 10 }}>
                  <span style={{ fontSize: "2rem" }}>🎉</span>
                  <p style={{ fontSize: "0.875rem", color: "#0ca678", fontWeight: 600 }}>No skill gaps detected!</p>
                  <p style={{ fontSize: "0.78rem", color: "#8b90b8", textAlign: "center" }}>Your skills fully cover the role requirements.</p>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Projects */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.31 }}>
            <Card>
              <SectionTitle emoji="🚀" title="Projects" />
              {data.projects && data.projects.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  
                  {/* ⭐ FIX: Safely handling project objects and arrays below */}
                  {data.projects.map((proj: any, i) => {
                    const projName = typeof proj === 'object' && proj !== null ? (proj.name || "Untitled Project") : proj;
                    const projTech = typeof proj === 'object' && proj !== null && Array.isArray(proj.technologies) ? proj.technologies.join(", ") : null;

                    return (
                      <div key={i} className="proj-card" style={{ padding: "13px 16px", borderRadius: 12, background: "#fafbff", border: "1.5px solid #e8eaf6", transition: "all .2s", cursor: "default" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,rgba(59,91,219,.1),rgba(76,110,245,.15))", border: "1.5px solid rgba(59,91,219,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", flexShrink: 0 }}>
                            {["🔷", "🟡", "🟢", "🔴", "🟣"][i % 5]}
                          </div>
                          <div>
                            <p style={{ fontSize: "0.855rem", fontWeight: 600, color: "#0f1133", lineHeight: 1.5 }}>
                              {projName}
                            </p>
                            
                            {/* Render technologies if the AI provided them */}
                            {projTech && (
                              <p style={{ fontSize: "0.75rem", color: "#3b5bdb", marginTop: 4, fontWeight: 500 }}>
                                {projTech}
                              </p>
                            )}

                            <p style={{ fontSize: "0.72rem", color: "#8b90b8", marginTop: 4, fontFamily: FM }}>Project {i + 1}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "28px 0", gap: 8 }}>
                  <span style={{ fontSize: "2rem" }}>📁</span>
                  <p style={{ fontSize: "0.875rem", color: "#8b90b8" }}>No projects found in resume.</p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* ══ CTA Banner ══ */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
          style={{ background: "linear-gradient(135deg,#3b5bdb 0%,#4c6ef5 55%,#818cf8 100%)", borderRadius: 20, padding: "30px 36px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20, boxShadow: "0 12px 40px rgba(59,91,219,.28)" }}>
          <div>
            <h3 style={{ fontFamily: FH, fontSize: "1.25rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 5 }}>
              Ready to practice for <span style={{ opacity: 0.85 }}>{data.target_role}</span>?
            </h3>
            <p style={{ color: "rgba(255,255,255,0.68)", fontSize: "0.875rem" }}>
              Run a targeted AI mock interview based on your exact skill gap.
              {data.skill_gap.length > 0 && <> Focus areas: <strong style={{ color: "rgba(255,255,255,0.9)" }}>{data.skill_gap.slice(0, 3).join(", ")}</strong>.</>}
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
            {/* CTA Version of Planner Button */}
            <Link href="/planner" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 24px", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 12, fontSize: "0.92rem", fontWeight: 700, textDecoration: "none", backdropFilter: "blur(10px)", transition: "all .2s" }}>
              Learning Roadmap
            </Link>

            <Link href="/start" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 26px", background: "#fff", color: "#3b5bdb", borderRadius: 12, fontSize: "0.92rem", fontWeight: 800, textDecoration: "none", boxShadow: "0 4px 18px rgba(0,0,0,.14)", letterSpacing: "-0.01em", flexShrink: 0 }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="rgba(59,91,219,0.3)" strokeWidth="1.5"/><path d="M6.5 5.5l4 2.5-4 2.5V5.5z" fill="#3b5bdb"/></svg>
              Start Mock Interview
            </Link>
          </div>
        </motion.div>

      </main>
    </>
  )
}