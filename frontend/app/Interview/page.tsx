"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000"

interface Question {
  id: number
  topic: string
  text: string
  expected_keywords: string[]
}

export default function MockInterviewPage() {
  const router = useRouter()

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [answers, setAnswers] = useState<{ [key: number]: string }>({})

  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem("access_token")
      if (!token) {
        router.push("/login")
        return
      }
      const interviewId = localStorage.getItem("interview_id")

      if (!interviewId) {
        setError("No Interview ID found. Please start over.")
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`${API_BASE}/resume/${interviewId}/questions`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await res.json()

        if (res.ok && data.success) {
          setQuestions(data.questions)
        } else {
          setError(data.detail || "Failed to generate questions.")
        }
      } catch (err) {
        setError("Network error: Could not reach the backend.")
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [router])

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleFinish = async () => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      router.push("/login")
      return
    }
    const interviewId = localStorage.getItem("interview_id")
    if (!interviewId) return

    try {
      setIsEvaluating(true)

      const res = await fetch(`${API_BASE}/resume/${interviewId}/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ answers }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        localStorage.setItem("final_report", JSON.stringify(data.report))
        router.push("/report")
      } else {
        alert("Evaluation failed. Please try again.")
      }
    } catch (err) {
      console.error(err)
      alert("Error submitting answers.")
    } finally {
      setIsEvaluating(false)
    }
  }

  if (isEvaluating) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 pt-28 text-center">
        <div className="mx-auto flex w-full max-w-md flex-col items-center">
          <div className="h-11 w-11 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-500" />
          <p className="mt-4 text-lg font-bold text-slate-800">Interviewer is grading your answers...</p>
          <p className="mt-1 text-sm text-slate-500">Generating your technical score.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 pt-28 text-center">
        <p className="text-base font-semibold text-slate-700">Agent is writing your questions...</p>
      </div>
    )
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 pt-28 text-center">
        <h2 className="text-xl font-bold text-rose-600">Oops!</h2>
        <p className="mt-2 text-slate-600">{error || "No questions generated."}</p>
        <Link href="/planner" className="mt-4 inline-block text-sm font-semibold text-blue-600">? Back to Planner</Link>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <main className="mx-auto max-w-3xl px-6 pt-24">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/planner" className="text-sm font-semibold text-slate-500">? Exit Interview</Link>
          <div className="rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-bold text-blue-600">
            Question {currentIndex + 1} of {questions.length}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(0,0,0,0.06)]">
          <span className="inline-block rounded-md border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-blue-700">
            {currentQuestion.topic}
          </span>
          <h2 className="mt-4 text-2xl font-bold text-slate-900">{currentQuestion.text}</h2>

          <textarea
            value={answers[currentIndex] || ""}
            onChange={(e) => setAnswers({ ...answers, [currentIndex]: e.target.value })}
            placeholder="Type your answer here..."
            className="mt-4 h-48 w-full rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Previous
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleFinish}
              className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-[0_6px_18px_rgba(16,185,129,0.28)] transition hover:-translate-y-0.5 hover:bg-emerald-500"
            >
              Finish Interview
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-[0_6px_18px_rgba(59,91,219,0.28)] transition hover:-translate-y-0.5 hover:bg-blue-500"
            >
              Next Question
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
