"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

/* ─────────────────────────── Typewriter words ─────────────────────────── */
const WORDS = [
  "land your dream role",
  "ace the Product interview",
  "nail the Leadership round",
  "crush Behavioral rounds",
  "stand out in any interview",
  "get that Senior offer",
]

/* ─────────────────────── Rotating interview scenarios ─────────────────────── */
const SCENARIOS = [
  {
    role: "Product Manager",
    round: "Product Sense Round",
    time: "00:12:14",
    accentColor: "#7c3aed",
    accentBg: "rgba(124,58,237,.09)",
    accentBd: "rgba(124,58,237,.22)",
    userColor: "#7c3aed",
    userBg: "rgba(124,58,237,.09)",
    userBd: "rgba(124,58,237,.2)",
    messages: [
      { who: "AI", label: "Interviewer Agent", isAi: true,  text: "How would you improve the onboarding experience for a B2B SaaS product with a 40% day-7 drop-off rate?" },
      { who: "U",  label: "You",               isAi: false, text: "First I'd want to understand the why — are users failing at setup, or losing perceived value? I'd segment drop-off by persona and map friction points..." },
      { who: "AI", label: "Interviewer Agent", isAi: true,  text: "Good instinct. Now, how do you prioritize which friction point to fix first with limited eng bandwidth?" },
    ],
    scores: [
      { name: "Clarity",   val: 85, color: "#7c3aed" },
      { name: "Strategy",  val: 79, color: "#f76707" },
      { name: "Impact",    val: 68, color: "#0ca678" },
    ],
  },
  {
    role: "Software Engineer",
    round: "System Design Round",
    time: "00:08:34",
    accentColor: "#3b5bdb",
    accentBg: "rgba(59,91,219,.09)",
    accentBd: "rgba(59,91,219,.22)",
    userColor: "#f76707",
    userBg: "rgba(247,103,7,.09)",
    userBd: "rgba(247,103,7,.2)",
    messages: [
      { who: "AI", label: "Interviewer Agent", isAi: true,  text: "Design a distributed notification system handling 10M push notifications/min. Start wherever feels natural." },
      { who: "U",  label: "You",               isAi: false, text: "I'd partition by user_id with a Kafka cluster for fan-out. Write path: API → Kafka → consumer workers per channel — FCM, APNS, email..." },
      { who: "AI", label: "Interviewer Agent", isAi: true,  text: "Good call. How do you handle backpressure when FCM rate-limits during a peak like a product launch?" },
    ],
    scores: [
      { name: "Technical", val: 87, color: "#3b5bdb" },
      { name: "Structure", val: 74, color: "#f76707" },
      { name: "Depth",     val: 62, color: "#818cf8" },
    ],
  },
  {
    role: "Data Scientist",
    round: "Case Study Round",
    time: "00:09:52",
    accentColor: "#0ca678",
    accentBg: "rgba(12,166,120,.09)",
    accentBd: "rgba(12,166,120,.22)",
    userColor: "#0ca678",
    userBg: "rgba(12,166,120,.09)",
    userBd: "rgba(12,166,120,.2)",
    messages: [
      { who: "AI", label: "Interviewer Agent", isAi: true,  text: "We're seeing a sudden 30% drop in model accuracy in production after a new data pipeline update. Walk me through your debugging approach." },
      { who: "U",  label: "You",               isAi: false, text: "I'd start by checking data distribution shift between train and the new pipeline. Compare feature statistics, look for missing values or schema drift..." },
      { who: "AI", label: "Interviewer Agent", isAi: true,  text: "Makes sense. What metric would you monitor in real-time to catch this kind of regression earlier next time?" },
    ],
    scores: [
      { name: "Reasoning", val: 91, color: "#0ca678" },
      { name: "Accuracy",  val: 76, color: "#f76707" },
      { name: "Clarity",   val: 70, color: "#818cf8" },
    ],
  },
  {
    role: "UX Designer",
    round: "Portfolio Round",
    time: "00:11:07",
    accentColor: "#e11d48",
    accentBg: "rgba(225,29,72,.09)",
    accentBd: "rgba(225,29,72,.22)",
    userColor: "#e11d48",
    userBg: "rgba(225,29,72,.09)",
    userBd: "rgba(225,29,72,.2)",
    messages: [
      { who: "AI", label: "Interviewer Agent", isAi: true,  text: "Walk me through a time you redesigned a complex workflow. What was your process from research to final delivery?" },
      { who: "U",  label: "You",               isAi: false, text: "We had a 12-step checkout flow with 60% abandonment. I ran contextual inquiry sessions, identified the core anxiety points, then prototyped 3 variants..." },
      { who: "AI", label: "Interviewer Agent", isAi: true,  text: "Interesting. How did you align stakeholders when your research findings conflicted with the business team's assumptions?" },
    ],
    scores: [
      { name: "Storytelling", val: 88, color: "#e11d48" },
      { name: "Process",      val: 82, color: "#f76707" },
      { name: "Empathy",      val: 75, color: "#818cf8" },
    ],
  },
]

/* ─────────────────────── Agents ─────────────────────────── */
const AGENTS = [
  { icon: "🎙️", label: ["Interviewer", "Agent"], colors: { bg: "rgba(59,91,219,.08)",   bd: "rgba(59,91,219,.2)",    sh: "rgba(59,91,219,.1)"   } },
  { icon: "🔍", label: ["Evaluator",   "Agent"], colors: { bg: "rgba(247,103,7,.07)",   bd: "rgba(247,103,7,.2)",    sh: "rgba(247,103,7,.1)"   } },
  { icon: "📊", label: ["Scorer",      "Agent"], colors: { bg: "rgba(12,166,120,.07)",  bd: "rgba(12,166,120,.2)",   sh: "rgba(12,166,120,.1)"  } },
  { icon: "🧠", label: ["Coach",       "Agent"], colors: { bg: "rgba(129,140,248,.08)", bd: "rgba(129,140,248,.22)", sh: "rgba(129,140,248,.1)" } },
]

/* ─────────────────────── Mini Cards ─────────────────────────── */
const MINI_CARDS = [
  { icon: "🎯", title: "Any Role, Any Industry", desc: "Tailored interviews for PM, Engineer, Designer, Analyst, Marketing & more" },
  { icon: "⚡", title: "Instant Expert Coaching", desc: "Real-time feedback on your answers — tone, structure, depth & clarity" },
]

/* ─────────────────────── Bottom Strip ─────────────────────────── */
const BOTTOM_STRIP = [
  { dot: "#3b5bdb", label: "Architecture", title: "Multi-Agent",    sub: "4 specialized AI agents work in parallel during every session" },
  { dot: "#f76707", label: "Coverage",     title: "50+ Job Roles",  sub: "PM · Engineer · Designer · Analyst · Marketing · Finance" },
  { dot: "#0ca678", label: "Feedback",     title: "Deep Scoring",   sub: "Communication, strategy, depth & role-specific evaluation" },
  { dot: "#818cf8", label: "Setup",        title: "Zero Config",    sub: "Pick your role, start talking — no calendar or signup needed" },
]

/* ─────────────────────── Typewriter ─────────────────────────── */
function Typewriter() {
  const [text, setText] = useState(WORDS[0])
  const [deleting, setDeleting] = useState(false)
  const [wordIdx, setWordIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(WORDS[0].length)

  useEffect(() => {
    const word = WORDS[wordIdx]
    let timer: ReturnType<typeof setTimeout>
    if (!deleting) {
      if (charIdx < word.length) {
        timer = setTimeout(() => { const n = charIdx + 1; setCharIdx(n); setText(word.slice(0, n)) }, 68)
      } else {
        timer = setTimeout(() => setDeleting(true), 2400)
      }
    } else {
      if (charIdx > 0) {
        timer = setTimeout(() => { const n = charIdx - 1; setCharIdx(n); setText(word.slice(0, n)) }, 36)
      } else {
        setDeleting(false)
        setWordIdx((w) => (w + 1) % WORDS.length)
      }
    }
    return () => clearTimeout(timer)
  }, [charIdx, deleting, wordIdx])

  return (
    <span>
      <span style={{ background: "linear-gradient(90deg,#3b5bdb,#4c6ef5,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
        {text}
      </span>
      <span style={{ display: "inline-block", width: 3, height: "0.82em", background: "#3b5bdb", marginLeft: 3, verticalAlign: "middle", borderRadius: 2, animation: "twBlink 1s infinite" }} />
    </span>
  )
}

/* ─────────────────────── Rotating Interview Card ─────────────────────── */
function InterviewCard({ FM, FH }: { FM: string; FH: string }) {
  const [idx, setIdx] = useState(0)
  const [scored, setScored] = useState(false)
  const scenario = SCENARIOS[idx]

  // Rotate scenario every 7 seconds
  useEffect(() => {
    const t = setInterval(() => {
      setScored(false)
      setTimeout(() => {
        setIdx((i) => (i + 1) % SCENARIOS.length)
        setTimeout(() => setScored(true), 400)
      }, 300)
    }, 7000)
    return () => clearInterval(t)
  }, [])

  // Animate bars on mount and on scenario change
  useEffect(() => {
    setScored(false)
    const t = setTimeout(() => setScored(true), 600)
    return () => clearTimeout(t)
  }, [idx])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.45 }}
        style={{ background: "#fff", border: "1.5px solid #e8eaf6", borderRadius: 22, overflow: "hidden", boxShadow: "0 20px 60px rgba(59,91,219,.1), 0 4px 16px rgba(0,0,0,.06)" }}
      >
        {/* Header */}
        <div style={{ padding: "13px 20px", background: "#fafbff", borderBottom: "1.5px solid #e8eaf6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
            <span style={{ fontFamily: FM, fontSize: "0.7rem", color: "#8b90b8", letterSpacing: ".03em" }}>{scenario.round} · {scenario.time}</span>
            <span style={{ fontFamily: FM, fontSize: "0.6rem", color: scenario.accentColor, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase" }}>{scenario.role}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 6, background: "rgba(12,166,120,.09)", border: "1px solid rgba(12,166,120,.25)", fontFamily: FM, fontSize: "0.62rem", fontWeight: 500, color: "#0ca678" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0ca678", animation: "livePulse 1.5s infinite" }} />
            LIVE
          </div>
        </div>

        {/* Chat messages */}
        <div style={{ padding: "18px 20px" }}>
          {scenario.messages.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 11, marginBottom: 14 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.75rem", fontWeight: 800,
                background: m.isAi ? scenario.accentBg : scenario.userBg,
                border: m.isAi ? `1.5px solid ${scenario.accentBd}` : `1.5px solid ${scenario.userBd}`,
                color: m.isAi ? scenario.accentColor : scenario.userColor,
              }}>
                {m.who}
              </div>
              <div>
                <div style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: "#8b90b8", marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontFamily: FM, fontSize: "0.78rem", lineHeight: 1.65, color: "#3d4270" }}>{m.text}</div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          <div style={{ display: "flex", gap: 11, opacity: 0.65 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: scenario.accentBg, border: `1.5px solid ${scenario.accentBd}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800, color: scenario.accentColor, flexShrink: 0, opacity: 0.5 }}>AI</div>
            <div>
              <div style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: "#c0c4dc", marginBottom: 6 }}>Evaluator Agent · Analyzing...</div>
              <span className="tdot" /><span className="tdot" /><span className="tdot" />
            </div>
          </div>
        </div>

        {/* Score bars */}
        <div style={{ padding: "14px 20px 18px", borderTop: "1.5px solid #e8eaf6", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {scenario.scores.map((s) => (
            <div key={s.name}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <span style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: "#8b90b8" }}>{s.name}</span>
                <span style={{ fontFamily: FM, fontSize: "0.72rem", fontWeight: 500, color: s.color }}>{s.val}</span>
              </div>
              <div style={{ height: 4, background: "#e8eaf6", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 10, background: s.color, width: scored ? `${s.val}%` : "0%", transition: "width 1.8s cubic-bezier(.4,0,.2,1)" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Role indicator dots */}
        <div style={{ padding: "8px 20px 14px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          {SCENARIOS.map((_, i) => (
            <div
              key={i}
              onClick={() => setIdx(i)}
              style={{
                width: i === idx ? 18 : 6, height: 6, borderRadius: 10,
                background: i === idx ? scenario.accentColor : "#e8eaf6",
                transition: "all 0.3s", cursor: "pointer",
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

/* ────────────────────────── Hero ────────────────────────────── */
export default function Hero() {
  const FH = "'Bricolage Grotesque', sans-serif"
  const FB = "'Figtree', sans-serif"
  const FM = "'JetBrains Mono', monospace"

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Figtree:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes twBlink   { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pipeFlow  { from{left:-14px;opacity:0} 20%{opacity:1} 80%{opacity:1} to{left:100%;opacity:0} }
        @keyframes tdot      { 0%,60%,100%{opacity:.2;transform:scale(1)} 30%{opacity:1;transform:scale(1.35)} }
        @keyframes floatY    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(.65)} }
        .pipe-line-anim { position:relative; overflow:hidden; }
        .pipe-line-anim::after { content:''; position:absolute; top:-1px; width:14px; height:3px; background:#3b5bdb; border-radius:2px; box-shadow:0 0 6px rgba(59,91,219,.5); animation:pipeFlow 1.8s linear infinite; }
        .tdot { width:5px;height:5px;border-radius:50%;background:#3b5bdb;display:inline-block;margin:0 2px;animation:tdot 1.1s infinite; }
        .tdot:nth-child(2){animation-delay:.18s} .tdot:nth-child(3){animation-delay:.36s}
        .hero-float     { animation:floatY 6s 1.2s ease-in-out infinite; }
        .agent-b        { transition:transform .2s; }
        .agent-b:hover  { transform:translateY(-3px); }
        .mini-c         { transition:all .2s; }
        .mini-c:hover   { border-color:#748ffc!important; box-shadow:0 8px 28px rgba(59,91,219,.13)!important; transform:translateY(-2px); }
        .strip-c        { transition:background .18s; }
        .strip-c:hover  { background:#fafbff!important; }
        .btn-p          { transition:all .2s; }
        .btn-p:hover    { background:#4c6ef5!important; transform:translateY(-2px); box-shadow:0 12px 40px rgba(59,91,219,.4)!important; }
        .btn-g          { transition:all .2s; }
        .btn-g:hover    { border-color:#748ffc!important; color:#3b5bdb!important; }
      `}</style>

      {/* Background mesh */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 800px 600px at 10% 20%, rgba(59,91,219,0.07) 0%, transparent 70%), radial-gradient(ellipse 600px 500px at 90% 80%, rgba(12,166,120,0.06) 0%, transparent 70%), radial-gradient(ellipse 500px 400px at 50% 50%, rgba(247,103,7,0.04) 0%, transparent 70%), #f5f6ff" }} />

      {/* ── Hero two-column grid ── */}
      <section style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "108px 56px 60px", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 80, alignItems: "center", fontFamily: FB }}>

        {/* ══ LEFT ══ */}
        <div>
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px 5px 8px", background: "#fff", border: "1.5px solid #e8eaf6", borderRadius: 100, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#3b5bdb", marginBottom: 28, boxShadow: "0 2px 12px rgba(59,91,219,.08)" }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg,#3b5bdb,#4c6ef5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.65rem" }}>✦</div>
            Agentic AI · Any Role · Any Industry
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontFamily: FH, fontSize: "clamp(2.8rem,4.8vw,4.4rem)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.04em", color: "#0f1133", marginBottom: 22 }}>
            <span style={{ color: "#8b90b8" }}>Prepare like</span><br />
            candidates who<br />
            <Typewriter />
          </motion.h1>

          {/* Sub */}
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            style={{ fontSize: "1.05rem", color: "#8b90b8", lineHeight: 1.75, maxWidth: 480, marginBottom: 38 }}>
            A <strong style={{ color: "#3d4270", fontWeight: 600 }}>multi-agent AI interviewer</strong> for every role — PM, Engineer, Designer, Analyst & more. Get <strong style={{ color: "#3d4270", fontWeight: 600 }}>expert coaching</strong> on exactly where you lost points, after every round.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 52 }}>
            <Link href="/start" className="btn-p" style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "15px 30px", background: "#3b5bdb", color: "#fff", borderRadius: 12, fontSize: "0.95rem", fontWeight: 700, textDecoration: "none", fontFamily: FB, boxShadow: "0 8px 30px rgba(59,91,219,.32)" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/><path d="M6.5 5.5l4 2.5-4 2.5V5.5z" fill="#fff"/></svg>
              Practice Your Role Now
            </Link>
            <Link href="/demo" className="btn-g" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 24px", background: "#fff", border: "1.5px solid #d1d5f0", color: "#3d4270", borderRadius: 12, fontSize: "0.9rem", fontWeight: 600, textDecoration: "none", fontFamily: FB, boxShadow: "0 2px 10px rgba(0,0,0,.06)" }}>
              Watch demo
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </motion.div>

          {/* Agent Pipeline */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.62 }}>
            <div style={{ fontSize: "0.88rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#8b90b8", marginBottom: 14 }}>AI Agent Pipeline</div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {AGENTS.map((agent, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div className="agent-b" style={{ width: 50, height: 50, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", background: agent.colors.bg, border: `1.5px solid ${agent.colors.bd}`, boxShadow: `0 4px 14px ${agent.colors.sh}` }}>
                      {agent.icon}
                    </div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: "#8b90b8", textAlign: "center", lineHeight: 1.35 }}>
                      {agent.label.map((line, j) => <span key={j} style={{ display: "block" }}>{line}</span>)}
                    </div>
                  </div>
                  {i < AGENTS.length - 1 && (
                    <div style={{ padding: "0 6px", marginBottom: 24, display: "flex", alignItems: "center" }}>
                      <div className="pipe-line-anim" style={{ width: 36, height: 1.5, background: "linear-gradient(90deg,#d1d5f0,#748ffc,#d1d5f0)", borderRadius: 2 }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ══ RIGHT ══ */}
        <motion.div initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
          className="hero-float" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Rotating Interview Card */}
          <InterviewCard FM={FM} FH={FH} />

          {/* Mini cards — bigger padding + font */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {MINI_CARDS.map((card) => (
              <div key={card.title} className="mini-c" style={{ background: "#fff", border: "1.5px solid #e8eaf6", borderRadius: 18, padding: "22px 20px", boxShadow: "0 2px 14px rgba(0,0,0,.05)" }}>
                <span style={{ fontSize: "1.6rem", marginBottom: 12, display: "block" }}>{card.icon}</span>
                <div style={{ fontFamily: FH, fontSize: "0.9rem", fontWeight: 700, color: "#0f1133", marginBottom: 6, letterSpacing: "-.01em" }}>{card.title}</div>
                <div style={{ fontSize: "0.78rem", color: "#8b90b8", lineHeight: 1.55 }}>{card.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Bottom strip ── */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
        style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto 80px", padding: "0 56px", fontFamily: FB }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", background: "#fff", border: "1.5px solid #e8eaf6", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(59,91,219,.07)" }}>
          {BOTTOM_STRIP.map((s, i) => (
            <div key={s.title} className="strip-c" style={{ padding: "28px 30px", borderRight: i < 3 ? "1.5px solid #e8eaf6" : "none", background: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.65rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#8b90b8", marginBottom: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
                {s.label}
              </div>
              <div style={{ fontFamily: FH, fontSize: "1.1rem", fontWeight: 700, color: "#0f1133", letterSpacing: "-.02em", marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: "0.99rem", color: "#8b90b8", lineHeight: 1.55 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  )
}