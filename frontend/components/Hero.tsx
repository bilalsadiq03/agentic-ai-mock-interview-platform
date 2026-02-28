"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

const WORDS = [
  "land your dream role",
  "ace the Product interview",
  "nail the Leadership round",
  "crush Behavioral rounds",
  "stand out in any interview",
  "get that Senior offer",
]

const SCENARIOS = [
  {
    role: "Product Manager",
    round: "Product Sense Round",
    time: "00:12:14",
    accentText: "text-violet-600",
    accentBg: "bg-violet-50",
    accentBorder: "border-violet-200",
    userText: "text-violet-600",
    userBg: "bg-violet-50",
    userBorder: "border-violet-200",
    messages: [
      { who: "AI", label: "Interviewer Agent", isAi: true, text: "How would you improve the onboarding experience for a B2B SaaS product with a 40% day-7 drop-off rate?" },
      { who: "U", label: "You", isAi: false, text: "First I'd want to understand the why ? are users failing at setup, or losing perceived value? I'd segment drop-off by persona and map friction points..." },
      { who: "AI", label: "Interviewer Agent", isAi: true, text: "Good instinct. Now, how do you prioritize which friction point to fix first with limited eng bandwidth?" },
    ],
    scores: [
      { name: "Clarity", val: 85, barClass: "bg-violet-600", textClass: "text-violet-600" },
      { name: "Strategy", val: 79, barClass: "bg-orange-500", textClass: "text-orange-500" },
      { name: "Impact", val: 68, barClass: "bg-emerald-600", textClass: "text-emerald-600" },
    ],
  },
  {
    role: "Software Engineer",
    round: "System Design Round",
    time: "00:08:34",
    accentText: "text-blue-600",
    accentBg: "bg-blue-50",
    accentBorder: "border-blue-200",
    userText: "text-orange-600",
    userBg: "bg-orange-50",
    userBorder: "border-orange-200",
    messages: [
      { who: "AI", label: "Interviewer Agent", isAi: true, text: "Design a distributed notification system handling 10M push notifications/min. Start wherever feels natural." },
      { who: "U", label: "You", isAi: false, text: "I'd partition by user_id with a Kafka cluster for fan-out. Write path: API ? Kafka ? consumer workers per channel ? FCM, APNS, email..." },
      { who: "AI", label: "Interviewer Agent", isAi: true, text: "Good call. How do you handle backpressure when FCM rate-limits during a peak like a product launch?" },
    ],
    scores: [
      { name: "Technical", val: 87, barClass: "bg-blue-600", textClass: "text-blue-600" },
      { name: "Structure", val: 74, barClass: "bg-orange-500", textClass: "text-orange-500" },
      { name: "Depth", val: 62, barClass: "bg-indigo-400", textClass: "text-indigo-400" },
    ],
  },
  {
    role: "Data Scientist",
    round: "Case Study Round",
    time: "00:09:52",
    accentText: "text-emerald-600",
    accentBg: "bg-emerald-50",
    accentBorder: "border-emerald-200",
    userText: "text-emerald-600",
    userBg: "bg-emerald-50",
    userBorder: "border-emerald-200",
    messages: [
      { who: "AI", label: "Interviewer Agent", isAi: true, text: "We're seeing a sudden 30% drop in model accuracy in production after a new data pipeline update. Walk me through your debugging approach." },
      { who: "U", label: "You", isAi: false, text: "I'd start by checking data distribution shift between train and the new pipeline. Compare feature statistics, look for missing values or schema drift..." },
      { who: "AI", label: "Interviewer Agent", isAi: true, text: "Makes sense. What metric would you monitor in real-time to catch this kind of regression earlier next time?" },
    ],
    scores: [
      { name: "Reasoning", val: 91, barClass: "bg-emerald-600", textClass: "text-emerald-600" },
      { name: "Accuracy", val: 76, barClass: "bg-orange-500", textClass: "text-orange-500" },
      { name: "Clarity", val: 70, barClass: "bg-indigo-400", textClass: "text-indigo-400" },
    ],
  },
  {
    role: "UX Designer",
    round: "Portfolio Round",
    time: "00:11:07",
    accentText: "text-rose-600",
    accentBg: "bg-rose-50",
    accentBorder: "border-rose-200",
    userText: "text-rose-600",
    userBg: "bg-rose-50",
    userBorder: "border-rose-200",
    messages: [
      { who: "AI", label: "Interviewer Agent", isAi: true, text: "Walk me through a time you redesigned a complex workflow. What was your process from research to final delivery?" },
      { who: "U", label: "You", isAi: false, text: "We had a 12-step checkout flow with 60% abandonment. I ran contextual inquiry sessions, identified the core anxiety points, then prototyped 3 variants..." },
      { who: "AI", label: "Interviewer Agent", isAi: true, text: "Interesting. How did you align stakeholders when your research findings conflicted with the business team's assumptions?" },
    ],
    scores: [
      { name: "Storytelling", val: 88, barClass: "bg-rose-600", textClass: "text-rose-600" },
      { name: "Process", val: 82, barClass: "bg-orange-500", textClass: "text-orange-500" },
      { name: "Empathy", val: 75, barClass: "bg-indigo-400", textClass: "text-indigo-400" },
    ],
  },
]

const AGENTS = [
  { icon: "???", label: ["Interviewer", "Agent"], colors: "from-blue-50 to-blue-100 border-blue-200" },
  { icon: "??", label: ["Evaluator", "Agent"], colors: "from-orange-50 to-orange-100 border-orange-200" },
  { icon: "??", label: ["Scorer", "Agent"], colors: "from-emerald-50 to-emerald-100 border-emerald-200" },
  { icon: "??", label: ["Coach", "Agent"], colors: "from-indigo-50 to-indigo-100 border-indigo-200" },
]

const MINI_CARDS = [
  { icon: "??", title: "Any Role, Any Industry", desc: "Tailored interviews for PM, Engineer, Designer, Analyst, Marketing & more" },
  { icon: "?", title: "Instant Expert Coaching", desc: "Real-time feedback on your answers ? tone, structure, depth & clarity" },
]

const BOTTOM_STRIP = [
  { dot: "bg-blue-600", label: "Architecture", title: "Multi-Agent", sub: "4 specialized AI agents work in parallel during every session" },
  { dot: "bg-orange-500", label: "Coverage", title: "50+ Job Roles", sub: "PM ? Engineer ? Designer ? Analyst ? Marketing ? Finance" },
  { dot: "bg-emerald-600", label: "Feedback", title: "Deep Scoring", sub: "Communication, strategy, depth & role-specific evaluation" },
  { dot: "bg-indigo-400", label: "Setup", title: "Zero Config", sub: "Pick your role, start talking ? no calendar or signup needed" },
]

const HOW_IT_WORKS = [
  { step: "01", title: "Choose your role", desc: "Select the role and seniority you want to practice for. We tailor difficulty and rubric." },
  { step: "02", title: "Live mock interview", desc: "Get role-specific questions with follow-ups, timing cues, and a live evaluator agent." },
  { step: "03", title: "Actionable report", desc: "Receive detailed scoring, missed signals, and a targeted improvement roadmap." },
]

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
        timer = setTimeout(() => {
          const n = charIdx + 1
          setCharIdx(n)
          setText(word.slice(0, n))
        }, 68)
      } else {
        timer = setTimeout(() => setDeleting(true), 2400)
      }
    } else {
      if (charIdx > 0) {
        timer = setTimeout(() => {
          const n = charIdx - 1
          setCharIdx(n)
          setText(word.slice(0, n))
        }, 36)
      } else {
        setDeleting(false)
        setWordIdx((w) => (w + 1) % WORDS.length)
      }
    }
    return () => clearTimeout(timer)
  }, [charIdx, deleting, wordIdx])

  return (
    <span className="inline-flex items-center gap-1">
      <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-indigo-300 bg-clip-text text-transparent">
        {text}
      </span>
      <span className="tw-blink inline-block h-[0.82em] w-[3px] rounded-sm bg-blue-600" />
    </span>
  )
}

function InterviewCard() {
  const [idx, setIdx] = useState(0)
  const [scored, setScored] = useState(false)
  const scenario = SCENARIOS[idx]

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
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(59,91,219,0.1),0_4px_16px_rgba(0,0,0,0.06)]"
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
          <div className="flex gap-1.5">
            {["bg-[#ff5f57]", "bg-[#febc2e]", "bg-[#28c840]"].map((c) => (
              <div key={c} className={`h-[11px] w-[11px] rounded-full ${c}`} />
            ))}
          </div>
          <div className="flex flex-col items-center gap-0.5 text-[0.62rem] font-semibold text-slate-500">
            <span>{scenario.round} ? {scenario.time}</span>
            <span className={`${scenario.accentText} text-[0.6rem] uppercase tracking-[0.08em]`}>{scenario.role}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[0.62rem] font-semibold text-emerald-600">
            <span className="live-pulse h-1.5 w-1.5 rounded-full bg-emerald-500" />
            LIVE
          </div>
        </div>

        <div className="space-y-3 px-5 py-4">
          {scenario.messages.map((m, i) => (
            <div key={i} className="flex gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${m.isAi ? scenario.accentBorder : scenario.userBorder} ${m.isAi ? scenario.accentBg : scenario.userBg} ${m.isAi ? scenario.accentText : scenario.userText} text-[0.75rem] font-extrabold`}>
                {m.who}
              </div>
              <div>
                <div className="mb-1 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-slate-400">
                  {m.label}
                </div>
                <div className="text-[0.78rem] leading-6 text-slate-600">
                  {m.text}
                </div>
              </div>
            </div>
          ))}

          <div className="flex gap-3 opacity-70">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${scenario.accentBorder} ${scenario.accentBg} ${scenario.accentText} text-[0.75rem] font-extrabold`}>AI</div>
            <div>
              <div className="mb-1 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-slate-400">Evaluator Agent ? Analyzing...</div>
              <span className="tdot" /><span className="tdot" /><span className="tdot" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 border-t border-slate-200 px-5 py-4">
          {scenario.scores.map((s) => (
            <div key={s.name}>
              <div className="mb-1 flex items-center justify-between text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-slate-400">
                <span>{s.name}</span>
                <span className={`${s.textClass} font-medium normal-case tracking-normal`}>{s.val}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div className={`${s.barClass} h-full rounded-full transition-[width] duration-[1800ms] ease-[cubic-bezier(.4,0,.2,1)]`} style={{ width: scored ? `${s.val}%` : "0%" }} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 px-5 pb-4">
          {SCENARIOS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all ${i == idx ? "w-5 bg-blue-600" : "w-1.5 bg-slate-200"}`}
              aria-label="Change scenario"
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function Hero() {
  return (
    <>
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_800px_600px_at_10%_20%,rgba(59,91,219,0.07)_0%,transparent_70%),radial-gradient(ellipse_600px_500px_at_90%_80%,rgba(12,166,120,0.06)_0%,transparent_70%),radial-gradient(ellipse_500px_400px_at_50%_50%,rgba(247,103,7,0.04)_0%,transparent_70%),#f5f6ff]" />

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 pb-14 pt-28 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-blue-600 shadow-[0_2px_12px_rgba(59,91,219,0.08)]"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 text-[0.6rem] text-white">?</span>
            Agentic AI ? Any Role ? Any Industry
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-[clamp(2.6rem,4.8vw,4.2rem)] font-extrabold leading-[1.08] tracking-tight text-slate-900"
          >
            <span className="text-slate-400">Prepare like</span><br />
            candidates who<br />
            <Typewriter />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-5 max-w-xl text-[1.05rem] leading-7 text-slate-500"
          >
            A <span className="font-semibold text-slate-700">multi-agent AI interviewer</span> for every role ? PM, Engineer, Designer, Analyst & more. Get <span className="font-semibold text-slate-700">expert coaching</span> on exactly where you lost points, after every round.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link href="/start" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-[0.95rem] font-bold text-white shadow-[0_8px_30px_rgba(59,91,219,0.32)] transition hover:-translate-y-0.5 hover:bg-blue-500">
              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-white/40">?</span>
              Practice Your Role Now
            </Link>
            <Link href="/demo" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-[0.9rem] font-semibold text-slate-700 shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition hover:border-indigo-300 hover:text-blue-600">
              Watch demo
              <span>?</span>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.62 }} className="mt-10">
            <div className="mb-3 text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-slate-400">AI Agent Pipeline</div>
            <div className="flex items-center">
              {AGENTS.map((agent, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border bg-gradient-to-br ${agent.colors} text-[1.1rem] shadow-[0_4px_14px_rgba(59,91,219,0.1)] transition hover:-translate-y-0.5`}>
                      {agent.icon}
                    </div>
                    <div className="text-center text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-slate-400">
                      {agent.label.map((line, j) => (
                        <span key={j} className="block">{line}</span>
                      ))}
                    </div>
                  </div>
                  {i < AGENTS.length - 1 && (
                    <div className="mb-6 px-2">
                      <div className="pipe-line-anim h-[2px] w-9 rounded-full bg-gradient-to-r from-slate-200 via-indigo-300 to-slate-200" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="hero-float flex flex-col gap-4">
          <InterviewCard />

          <div className="grid grid-cols-2 gap-3">
            {MINI_CARDS.map((card) => (
              <div key={card.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_14px_rgba(0,0,0,0.05)] transition hover:-translate-y-0.5 hover:border-indigo-300">
                <div className="mb-3 text-2xl">{card.icon}</div>
                <div className="font-display text-[0.9rem] font-bold text-slate-900">{card.title}</div>
                <div className="mt-1 text-[0.8rem] leading-5 text-slate-500">{card.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <motion.div id="features" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }} className="mx-auto mb-20 max-w-6xl px-6">
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_24px_rgba(59,91,219,0.07)] md:grid-cols-2 lg:grid-cols-4">
          {BOTTOM_STRIP.map((s, i) => (
            <div key={s.title} className={`border-slate-200 bg-white p-6 ${i < 3 ? "border-b md:border-b-0 md:border-r" : ""}`}>
              <div className="mb-2 flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate-400">
                <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                {s.label}
              </div>
              <div className="font-display text-[1.05rem] font-bold text-slate-900">{s.title}</div>
              <div className="mt-1 text-[0.9rem] leading-6 text-slate-500">{s.sub}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <section id="how-it-works" className="mx-auto mb-28 max-w-6xl px-6">
        <div className="mb-6 flex flex-col gap-2 lg:flex-row lg:items-baseline lg:justify-between">
          <div className="text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-slate-400">How it Works</div>
          <div className="font-display text-[1.6rem] font-extrabold text-slate-900">A full interview cycle in minutes</div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_2px_14px_rgba(0,0,0,0.05)]">
              <div className="font-mono text-xs font-semibold text-blue-600">{item.step}</div>
              <div className="mt-2 font-display text-[1.05rem] font-bold text-slate-900">{item.title}</div>
              <div className="mt-2 text-[0.9rem] leading-6 text-slate-500">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
