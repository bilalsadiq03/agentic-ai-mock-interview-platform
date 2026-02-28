"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"

export default function StartPage() {
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [jobDesc, setJobDesc] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  // ⭐ Handle file upload
  const handleFile = (f: File) => {
    if (f.type === "application/pdf") {
      setFile(f)
      localStorage.setItem("resumeName", f.name)
    } else {
      alert("Only PDF files allowed")
    }
  }

  // ⭐ Send resume + JD to backend
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

      const res = await fetch("http://localhost:8000/resume/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
      const text = await res.text()
      throw new Error(`Backend error: ${res.status} — ${text}`)
      }

      const data = await res.json()

      if (!data.success) {
        alert("Resume analysis failed")
        return
      }

      localStorage.setItem("parsedData", JSON.stringify(data.parsed_data))
      // ⭐ FIX: Changed from "interviewId" to "interview_id" to match the Planner page
      localStorage.setItem("interview_id", data.interview_id)

      router.push("/Result")

    } catch (err) {
      console.error(err)
      alert("Cannot connect to backend")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-200 text-black p-10 pt-28">
      <Navbar />
      
      <h1 className="text-4xl font-extrabold fonr-serif mb-10 text-center">
        Setup Your Interview
      </h1>

      <div className="max-w-2xl mx-auto mb-6">
        <textarea
          placeholder="Paste job description..."
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          className="w-full p-4 rounded bg-gray-100 border border-gray-200"
          rows={4}
        />
      </div>

      <div className="max-w-2xl mx-auto mb-6 bg-gray-100 p-8 rounded-xl">

        <h2 className="text-2xl font-extrabold mb-5 text-center">
          Upload Resume
        </h2>

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
          className={`border-2 border-dashed rounded-xl p-10 text-center transition ${
            dragActive ? "border-blue-400 bg-gray-200" : "border-gray-700"
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

          <label htmlFor="resumeUpload" className="cursor-pointer">
            {!file ? (
              <p className="text-gray-500">
                Drag & drop your resume or click to upload
              </p>
            ) : (
              <p className="text-green-400 font-semibold">
                Uploaded: {file.name}
              </p>
            )}
          </label>
        </div>

      </div>


      <div className="text-center mb-12">
        <button
          onClick={analyzeResume}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-lg font-extrabold"
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </div>
    </main>
  )
}