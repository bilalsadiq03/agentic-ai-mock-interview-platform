"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

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
      const interviewId = localStorage.getItem("interview_id")
      
      if (!interviewId) {
        setError("No Interview ID found. Please start over.")
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`http://127.0.0.1:8000/resume/${interviewId}/questions`, {
          method: "POST"
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
  }, [])

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
    const interviewId = localStorage.getItem("interview_id")
    if (!interviewId) return;

    try {
      setIsEvaluating(true)
      
      const res = await fetch(`http://127.0.0.1:8000/resume/${interviewId}/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers })
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
      alert("Error submitting answers.");
    } finally {
      setIsEvaluating(false)
    }
  }

  /* ── Grading Loading State ── */
  if (isEvaluating) {
    return (
      <div style={{ minHeight: "100vh", background: "#e5e7eb", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ width: 44, height: 44, borderRadius: "50%", border: "3px solid #cbd5e1", borderTopColor: "#10b981", animation: "spin .8s linear infinite", marginBottom: "16px" }} />
        <p style={{ color: "#333", fontSize: "1.2rem", fontWeight: "700" }}>Interviewer is grading your answers...</p>
        <p style={{ color: "#64748b", marginTop: "8px" }}>Generating your technical score.</p>
      </div>
    )
  }

  /* ── Loading State ── */
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#e5e7eb", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        <p style={{ color: "#333", fontSize: "1.1rem", fontWeight: "600" }}>Agent is writing your questions...</p>
      </div>
    )
  }

  /* ── Error State ── */
  if (error || questions.length === 0) {
    return (
      <div style={{ minHeight: "100vh", background: "#e5e7eb", padding: "100px", textAlign: "center", fontFamily: "sans-serif" }}>
        <h2 style={{ color: "#ef4444" }}>⚠️ Oops!</h2>
        <p style={{ color: "#333", marginTop: "10px", marginBottom: "20px" }}>{error || "No questions generated."}</p>
        <Link href="/planner" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "bold" }}>&larr; Back to Planner</Link>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1

  return (
    <div style={{ minHeight: "100vh", background: "#e5e7eb", fontFamily: "sans-serif", color: "#000" }}>
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "40px 20px" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <Link href="/planner" style={{ color: "#64748b", textDecoration: "none", fontWeight: "600", fontSize: "14px" }}>
            &larr; Exit Interview
          </Link>
          <div style={{ background: "#ffffff", padding: "6px 16px", borderRadius: "20px", fontSize: "14px", fontWeight: "bold", color: "#2563eb", border: "1px solid #d1d5db" }}>
            Question {currentIndex + 1} of {questions.length}
          </div>
        </div>

        <div style={{ background: "#ffffff", border: "1px solid #d1d5db", borderRadius: "16px", padding: "32px", marginBottom: "24px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
          <span style={{ display: "inline-block", background: "#eff6ff", color: "#1d4ed8", padding: "6px 12px", borderRadius: "6px", fontSize: "13px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>
            {currentQuestion.topic}
          </span>
          <h2 style={{ margin: "0 0 24px 0", fontSize: "1.5rem", color: "#0f172a", lineHeight: "1.4" }}>
            {currentQuestion.text}
          </h2>

          <textarea
            value={answers[currentIndex] || ""}
            onChange={(e) => setAnswers({ ...answers, [currentIndex]: e.target.value })}
            placeholder="Type your answer here..."
            style={{ 
              width: "100%", height: "200px", padding: "16px", borderRadius: "8px", 
              border: "1px solid #cbd5e1", fontSize: "15px", fontFamily: "inherit", 
              resize: "vertical", outline: "none", background: "#f8fafc", color: "#334155"
            }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
          <button onClick={handlePrev} disabled={currentIndex === 0}
            style={{ padding: "14px 24px", borderRadius: "10px", fontWeight: "bold", background: currentIndex === 0 ? "#cbd5e1" : "#ffffff", color: currentIndex === 0 ? "#94a3b8" : "#334155", border: "1px solid #d1d5db", cursor: currentIndex === 0 ? "not-allowed" : "pointer" }}>
            Previous
          </button>

          {isLastQuestion ? (
            <button onClick={handleFinish}
              style={{ padding: "14px 32px", borderRadius: "10px", fontWeight: "bold", background: "#10b981", color: "#ffffff", border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)" }}>
              Finish Interview
            </button>
          ) : (
            <button onClick={handleNext}
              style={{ padding: "14px 32px", borderRadius: "10px", fontWeight: "bold", background: "#2563eb", color: "#ffffff", border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)" }}>
              Next Question
            </button>
          )}
        </div>
      </main>
    </div>
  )
}