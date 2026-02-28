"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000"

export default function StartPage() {
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [jobDesc, setJobDesc] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) router.push("/login")
  }, [router])

  const handleFile = (f: File) => {
    if (f.type === "application/pdf") {
      setFile(f)
      localStorage.setItem("resumeName", f.name)
    } else {
      alert("Only PDF files allowed")
    }
  }

  const analyzeResume = async () => {
    if (!file) {
      alert("Upload resume first")
      return
    }

    if (!jobDesc.trim()) {
      alert("Enter job description")
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("job_description", jobDesc)

    try {
      setLoading(true)
      const token = localStorage.getItem("access_token")
      const res = await fetch(`${API_BASE}/resume/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Backend error: ${res.status} ? ${text}`)
      }

      const data = await res.json()

      if (!data.success) {
        alert("Resume analysis failed")
        return
      }

      localStorage.setItem("parsedData", JSON.stringify(data.parsed_data))
      localStorage.setItem("interview_id", data.interview_id)
      router.push("/result")
    } catch (err) {
      console.error(err)
      alert("Cannot connect to backend")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 pt-28">
        <h1 className="font-display text-center text-3xl font-extrabold text-slate-900">Setup Your Interview</h1>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(0,0,0,0.06)]">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Job description</label>
          <textarea
            placeholder="Paste job description..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            className="h-32 w-full rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(0,0,0,0.06)]">
          <h2 className="text-center text-xl font-bold text-slate-900">Upload Resume</h2>
          <div
            onDragEnter={() => setDragActive(true)}
            onDragLeave={() => setDragActive(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              setDragActive(false)
              const droppedFile = e.dataTransfer.files[0]
              if (droppedFile) handleFile(droppedFile)
            }}
            className={`mt-4 rounded-xl border-2 border-dashed p-8 text-center transition ${
              dragActive ? "border-blue-400 bg-blue-50" : "border-slate-300"
            }`}
          >
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              id="resumeUpload"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0])
              }}
            />

            <label htmlFor="resumeUpload" className="cursor-pointer text-sm text-slate-500">
              {!file ? (
                <span>Drag & drop your resume or click to upload</span>
              ) : (
                <span className="font-semibold text-emerald-600">Uploaded: {file.name}</span>
              )}
            </label>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={analyzeResume}
            disabled={loading}
            className="rounded-xl bg-blue-600 px-8 py-4 text-sm font-bold text-white shadow-[0_6px_18px_rgba(59,91,219,0.28)] transition hover:-translate-y-0.5 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </div>
      </div>
    </main>
  )
}
