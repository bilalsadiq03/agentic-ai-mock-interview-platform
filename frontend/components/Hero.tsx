"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

/* ─────────────────────────── Data ─────────────────────────── */
const WORDS = [
  "land FAANG offers",
  "ace System Design",
  "nail the coding round",
  "crush Behavioral rounds",
  "get that L5 offer",
]

const AGENTS = [
  { icon: "🎙️", label: ["Interviewer", "Agent"], colors: { bg: "rgba(59,91,219,.08)",   bd: "rgba(59,91,219,.2)",    sh: "rgba(59,91,219,.1)"   } },
  { icon: "🔍", label: ["Evaluator",   "Agent"], colors: { bg: "rgba(247,103,7,.07)",   bd: "rgba(247,103,7,.2)",    sh: "rgba(247,103,7,.1)"   } },
  { icon: "📊", label: ["Scorer",      "Agent"], colors: { bg: "rgba(12,166,120,.07)",  bd: "rgba(12,166,120,.2)",   sh: "rgba(12,166,120,.1)"  } },
  { icon: "🧠", label: ["Coach",       "Agent"], colors: { bg: "rgba(129,140,248,.08)", bd: "rgba(129,140,248,.22)", sh: "rgba(129,140,248,.1)" } },
]

const MESSAGES = [
  { who: "AI", label: "Interviewer Agent", isAi: true,  text: "Design a distributed notification system handling 10M push notifications/min. Start wherever feels natural." },
  { who: "U",  label: "You",               isAi: false, text: "I'd partition by user_id with a Kafka cluster for fan-out. Write path: API → Kafka → consumer workers per channel — FCM, APNS, email..." },
  { who: "AI", label: "Interviewer Agent", isAi: true,  text: "Good call. How do you handle backpressure when FCM rate-limits during a peak like a product launch?" },
]

const SCORES = [
  { name: "Technical", val: 87, color: "#3b5bdb" },
  { name: "Structure",  val: 74, color: "#f76707" },
  { name: "Depth",      val: 62, color: "#818cf8" },
]

const MINI_CARDS = [
  { icon: "🎯", title: "4 Interview Types", desc: "System Design, LeetCode, Behavioral & Role-fit rounds" },
  { icon: "⚡", title: "Instant Coaching",  desc: "Real-time scores & improvement tips as you answer" },
]

const BOTTOM_STRIP = [
  { dot: "#3b5bdb", label: "Architecture", title: "Multi-Agent",  sub: "4 AI agents collaborate in parallel every session" },
  { dot: "#f76707", label: "Coverage",     title: "All Rounds",   sub: "Coding · System Design · Behavioral · Role-fit" },
  { dot: "#0ca678", label: "Feedback",     title: "Deep Scoring", sub: "Accuracy, structure, depth & trade-off analysis" },
  { dot: "#818cf8", label: "Setup",        title: "Zero Config",  sub: "Pick a role and start — no calendar or signup" },
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
        timer = setTimeout(() => { const n = charIdx + 1; setCharIdx(n); setText(word.slice(0, n)) }, 72)
      } else {
        timer = setTimeout(() => setDeleting(true), 2400)
      }
    } else {
      if (charIdx > 0) {
        timer = setTimeout(() => { const n = charIdx - 1; setCharIdx(n); setText(word.slice(0, n)) }, 38)
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

/* ────────────────────────── Hero ────────────────────────────── */
export default function Hero() {
  const [scored, setScored] = useState(false)
  useEffect(() => { const t = setTimeout(() => setScored(true), 700); return () => clearTimeout(t) }, [])

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
        .mini-c:hover   { border-color:#748ffc!important; box-shadow:0 6px 24px rgba(59,91,219,.12)!important; transform:translateY(-2px); }
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
            Agentic AI · Multi-Round Interviews
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontFamily: FH, fontSize: "clamp(2.8rem,4.8vw,4.4rem)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.04em", color: "#0f1133", marginBottom: 22 }}>
            <span style={{ color: "#8b90b8" }}>Prepare like</span><br />
            engineers who<br />
            <Typewriter />
          </motion.h1>

          {/* Sub */}
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            style={{ fontSize: "1.05rem", color: "#8b90b8", lineHeight: 1.75, maxWidth: 460, marginBottom: 38 }}>
            A <strong style={{ color: "#3d4270", fontWeight: 600 }}>multi-agent AI interviewer</strong> that conducts real rounds — system design, coding, behavioral — then delivers <strong style={{ color: "#3d4270", fontWeight: 600 }}>expert-level coaching</strong> on exactly where you lost points.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 52 }}>
            <Link href="/start" className="btn-p" style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "15px 30px", background: "#3b5bdb", color: "#fff", borderRadius: 12, fontSize: "0.95rem", fontWeight: 700, textDecoration: "none", fontFamily: FB, boxShadow: "0 8px 30px rgba(59,91,219,.32)" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/><path d="M6.5 5.5l4 2.5-4 2.5V5.5z" fill="#fff"/></svg>
              Run a Free Interview
            </Link>
            <Link href="/demo" className="btn-g" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 24px", background: "#fff", border: "1.5px solid #d1d5f0", color: "#3d4270", borderRadius: 12, fontSize: "0.9rem", fontWeight: 600, textDecoration: "none", fontFamily: FB, boxShadow: "0 2px 10px rgba(0,0,0,.06)" }}>
              Watch demo
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </motion.div>

          {/* Agent Pipeline */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.62 }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#8b90b8", marginBottom: 14 }}>AI Agent Pipeline</div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {AGENTS.map((agent, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div className="agent-b" style={{ width: 50, height: 50, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", background: agent.colors.bg, border: `1.5px solid ${agent.colors.bd}`, boxShadow: `0 4px 14px ${agent.colors.sh}` }}>
                      {agent.icon}
                    </div>
                    <div style={{ fontSize: "0.63rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: "#8b90b8", textAlign: "center", lineHeight: 1.35 }}>
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
          className="hero-float" style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Interview card */}
          <div style={{ background: "#fff", border: "1.5px solid #e8eaf6", borderRadius: 22, overflow: "hidden", boxShadow: "0 20px 60px rgba(59,91,219,.1), 0 4px 16px rgba(0,0,0,.06)" }}>
            {/* Header */}
            <div style={{ padding: "13px 18px", background: "#fafbff", borderBottom: "1.5px solid #e8eaf6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 6 }}>
                {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />)}
              </div>
              <span style={{ fontFamily: FM, fontSize: "0.7rem", color: "#8b90b8", letterSpacing: ".03em" }}>System Design Round · 00:08:34</span>
              <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 6, background: "rgba(12,166,120,.09)", border: "1px solid rgba(12,166,120,.25)", fontFamily: FM, fontSize: "0.62rem", fontWeight: 500, color: "#0ca678" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0ca678", animation: "livePulse 1.5s infinite" }} />
                LIVE
              </div>
            </div>

            {/* Chat messages */}
            <div style={{ padding: 18 }}>
              {MESSAGES.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 11, marginBottom: 14 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800, background: m.isAi ? "rgba(59,91,219,.10)" : "rgba(247,103,7,.09)", border: m.isAi ? "1.5px solid rgba(59,91,219,.2)" : "1.5px solid rgba(247,103,7,.2)", color: m.isAi ? "#3b5bdb" : "#f76707" }}>
                    {m.who}
                  </div>
                  <div>
                    <div style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: "#8b90b8", marginBottom: 4 }}>{m.label}</div>
                    <div style={{ fontFamily: FM, fontSize: "0.78rem", lineHeight: 1.65, color: "#3d4270" }}>{m.text}</div>
                  </div>
                </div>
              ))}
              {/* Typing dots */}
              <div style={{ display: "flex", gap: 11, opacity: 0.7 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(59,91,219,.06)", border: "1.5px solid rgba(59,91,219,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800, color: "rgba(59,91,219,.4)", flexShrink: 0 }}>AI</div>
                <div>
                  <div style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: "#c0c4dc", marginBottom: 6 }}>Evaluator Agent · Analyzing...</div>
                  <span className="tdot" /><span className="tdot" /><span className="tdot" />
                </div>
              </div>
            </div>

            {/* Score bars */}
            <div style={{ padding: "14px 18px 16px", borderTop: "1.5px solid #e8eaf6", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
              {SCORES.map((s) => (
                <div key={s.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                    <span style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: "#8b90b8" }}>{s.name}</span>
                    <span style={{ fontFamily: FM, fontSize: "0.72rem", fontWeight: 500, color: s.color }}>{s.val}</span>
                  </div>
                  <div style={{ height: 4, background: "#e8eaf6", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 10, background: s.color, width: scored ? `${s.val}%` : "0%", transition: "width 2s cubic-bezier(.4,0,.2,1)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mini cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {MINI_CARDS.map((card) => (
              <div key={card.title} className="mini-c" style={{ background: "#fff", border: "1.5px solid #e8eaf6", borderRadius: 16, padding: 16, boxShadow: "0 2px 10px rgba(0,0,0,.04)" }}>
                <span style={{ fontSize: "1.3rem", marginBottom: 8, display: "block" }}>{card.icon}</span>
                <div style={{ fontFamily: FH, fontSize: "0.82rem", fontWeight: 700, color: "#0f1133", marginBottom: 4, letterSpacing: "-.01em" }}>{card.title}</div>
                <div style={{ fontSize: "0.72rem", color: "#8b90b8", lineHeight: 1.5 }}>{card.desc}</div>
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
            <div key={s.title} className="strip-c" style={{ padding: "26px 28px", borderRight: i < 3 ? "1.5px solid #e8eaf6" : "none", background: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.65rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#8b90b8", marginBottom: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
                {s.label}
              </div>
              <div style={{ fontFamily: FH, fontSize: "1.05rem", fontWeight: 700, color: "#0f1133", letterSpacing: "-.02em", marginBottom: 3 }}>{s.title}</div>
              <div style={{ fontSize: "0.73rem", color: "#8b90b8", lineHeight: 1.5 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  )
}