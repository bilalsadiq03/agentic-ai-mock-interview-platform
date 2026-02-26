"use client"

import { useState } from "react"
import RoleCard from "@/components/RoleCard"

export default function StartPage() {
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFile = (f: File) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    if (allowed.includes(f.type)) {
      setFile(f)
      localStorage.setItem("resumeName", f.name)
    } else {
      alert("Only PDF/DOC/DOCX allowed")
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      
      <h1 className="text-3xl font-bold mb-10 text-center">
        Setup Your Interview
      </h1>

      {/* ===== Drag & Drop Resume Upload ===== */}

      <div className="max-w-2xl mx-auto mb-12 bg-gray-900 p-8 rounded-xl">

        <h2 className="text-xl font-semibold mb-4 text-center">
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
          className={`border-2 border-dashed rounded-xl p-10 text-center transition
            ${dragActive ? "border-blue-500 bg-gray-800" : "border-gray-700"}
          `}
        >
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            id="resumeUpload"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFile(e.target.files[0])
            }}
          />

          <label htmlFor="resumeUpload" className="cursor-pointer">
            {!file ? (
              <p className="text-gray-400">
                Drag & drop your resume
              </p>
            ) : (
              <p className="text-green-400 font-semibold">
                Uploaded: {file.name}
              </p>
            )}
          </label>
        </div>

        {file && (
          <button
            onClick={() => setFile(null)}
            className="mt-4 text-red-400 hover:text-red-500"
          >
            Remove file
          </button>
        )}
      </div>

      {/* ===== Role Selection ===== */}

      <h2 className="text-2xl font-bold mb-6 text-center">
        Select Interview Role
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <RoleCard role="Software Engineer" />
        <RoleCard role="Web Developer" />
        <RoleCard role="Data Scientist" />
      </div>
    </main>
  )
}