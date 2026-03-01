"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const API_BASE =
process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000"

const TEST_DURATION = 15 * 60

interface Question {
id: number
section: "mcq" | "coding" | "technical" | "resume"
type: "mcq" | "coding" | "text"
topic: string
text: string
options?: string[]
}

export default function MockInterviewPage() {
const router = useRouter()

const [questions, setQuestions] = useState<Question[]>([])
const [answers, setAnswers] = useState<{ [key: number]: any }>({})
const [loading, setLoading] = useState(true)
const [isSubmitting, setIsSubmitting] = useState(false)
const [activeSection, setActiveSection] = useState<string | null>(null)
const [questionIndex, setQuestionIndex] = useState(0)
const [timeLeft, setTimeLeft] = useState(TEST_DURATION)

useEffect(() => {
const fetchQuestions = async () => {
const token = localStorage.getItem("access_token")
const interviewId = localStorage.getItem("interview_id")

  if (!token || !interviewId) {
    router.push("/planner")
    return
  }

  try {
    const res = await fetch(
      `${API_BASE}/resume/${interviewId}/questions`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    const data = await res.json()
    setQuestions(data.questions || [])
  } catch {
  } finally {
    setLoading(false)
  }
}

fetchQuestions()

}, [router])

useEffect(() => {
if (!activeSection || isSubmitting) return

if (timeLeft <= 0) {
  handleSubmitTest()
  return
}

const timer = setInterval(() => {
  setTimeLeft((prev) => prev - 1)
}, 1000)

return () => clearInterval(timer)

}, [timeLeft, activeSection, isSubmitting])

const formatTime = (seconds: number) => {
const m = Math.floor(seconds / 60)
const s = seconds % 60
return `${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`
}

const handleSubmitTest = async () => {
if (isSubmitting) return
setIsSubmitting(true)

try {
  const token = localStorage.getItem("access_token")
  const interviewId = localStorage.getItem("interview_id")

  const mergedQuestions = questions.map((q) => ({
    ...q,
    candidate_answer: answers[q.id] || "No answer provided.",
  }))

  const res = await fetch(
    `${API_BASE}/resume/${interviewId}/evaluate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ questions: mergedQuestions }),
    }
  )

  if (!res.ok) throw new Error()

  const evaluationReport = await res.json()
  localStorage.setItem(
    "final_report",
    JSON.stringify(evaluationReport)
  )

  router.push("/report")
} catch {
  setIsSubmitting(false)
}

}

if (loading)
return ( <div className="pt-32 text-center text-slate-600">
Generating your customized test... </div>
)

if (!questions.length)
return ( <div className="pt-32 text-center text-slate-600">
No questions available. </div>
)

const availableSections = Array.from(
new Set(questions.map((q) => q.section))
)

if (!activeSection) {
return ( <div className="min-h-screen bg-slate-50 pt-24 px-6"> <div className="mx-auto max-w-3xl"> <h1 className="text-3xl font-bold mb-2">
Your Mock Interview </h1> <p className="text-slate-600 mb-8">
Select a section to begin. </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {availableSections.map((section) => (
          <button
            key={section}
            onClick={() => {
              setActiveSection(section)
              setQuestionIndex(0)
              setTimeLeft(TEST_DURATION)
            }}
            className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow transition text-left"
          >
            <span className="uppercase text-xs font-bold text-blue-600">
              Module
            </span>
            <span className="block text-xl font-semibold capitalize">
              {section}
            </span>
            <span className="text-sm text-slate-500">
              {
                questions.filter(
                  (q) => q.section === section
                ).length
              }{" "}
              Questions
            </span>
          </button>
        ))}
      </div>
    </div>
  </div>
)

}

const currentSectionQuestions = questions.filter(
(q) => q.section === activeSection
)

const q = currentSectionQuestions[questionIndex]
const isLastInSection =
questionIndex === currentSectionQuestions.length - 1

return ( <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row"> <aside className="w-full md:w-64 bg-white border-r p-6 flex flex-col gap-6"> <h2 className="text-sm font-bold text-slate-400 uppercase">
Sections </h2>


    {availableSections.map((section) => (
      <button
        key={section}
        onClick={() => {
          setActiveSection(section)
          setQuestionIndex(0)
          setTimeLeft(TEST_DURATION)
        }}
        className={`text-left px-4 py-3 rounded-lg capitalize ${
          activeSection === section
            ? "bg-blue-50 text-blue-700 border border-blue-200"
            : "hover:bg-slate-100 text-slate-600"
        }`}
      >
        {section}
      </button>
    ))}

    <div className="mt-auto">
      <Link href="/planner" className="text-sm text-slate-500">
        ← Save & Exit
      </Link>
    </div>
  </aside>

  <main className="flex-1 px-6 py-8 md:p-12 max-w-4xl mx-auto w-full">
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold capitalize">
          {activeSection} Section
        </h2>
        <p className="text-sm text-slate-500">
          Question {questionIndex + 1} of{" "}
          {currentSectionQuestions.length}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div
          className={`px-4 py-2 rounded-lg font-mono font-bold text-lg ${
            timeLeft <= 60
              ? "bg-red-100 text-red-700"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {formatTime(timeLeft)}
        </div>

        <button
          onClick={handleSubmitTest}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg"
        >
          {isSubmitting ? "Grading..." : "Submit Test"}
        </button>
      </div>
    </div>

    {q && (
      <div className="rounded-2xl bg-white p-6 shadow border">
        <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded">
          {q.topic || q.type.toUpperCase()}
        </span>

        <h3 className="mt-4 text-xl font-medium">
          {q.text}
        </h3>

        {q.type === "mcq" && (
          <div className="mt-6 space-y-3">
            {q.options?.map((opt, i) => (
              <label
                key={i}
                className="flex items-center p-4 border rounded cursor-pointer hover:bg-slate-50"
              >
                <input
                  type="radio"
                  checked={answers[q.id] === opt}
                  onChange={() =>
                    setAnswers({ ...answers, [q.id]: opt })
                  }
                />
                <span className="ml-3">{opt}</span>
              </label>
            ))}
          </div>
        )}

        {(q.type === "coding" || q.type === "text") && (
          <textarea
            value={answers[q.id] || ""}
            onChange={(e) =>
              setAnswers({
                ...answers,
                [q.id]: e.target.value,
              })
            }
            className="mt-6 w-full h-48 border rounded p-4 font-mono"
            placeholder={
              q.type === "coding"
                ? "// Write code here..."
                : "Type your answer..."
            }
          />
        )}
      </div>
    )}

    <div className="mt-8 flex justify-between">
      <button
        disabled={questionIndex === 0}
        onClick={() =>
          setQuestionIndex(questionIndex - 1)
        }
        className="px-5 py-2 bg-slate-200 rounded"
      >
        Previous
      </button>

      <button
        disabled={isLastInSection}
        onClick={() =>
          setQuestionIndex(questionIndex + 1)
        }
        className="px-5 py-2 bg-blue-600 text-white rounded"
      >
        Next
      </button>
    </div>
  </main>
</div>

)
}
