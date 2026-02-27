"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]
const ACCEPTED_EXT = ".pdf,.docx"

export default function StartPage() {
  const [file, setFile]           = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [jobDesc, setJobDesc]     = useState("")
  const [loading, setLoading]     = useState(false)

  const router = useRouter()

  const handleFile = (f: File) => {
    if (ACCEPTED_TYPES.includes(f.type)) {
      setFile(f)
      localStorage.setItem("resumeName", f.name)
    } else {
      alert("Only PDF or DOCX files are allowed")
    }
  }

  // Send resume + JD to backend
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
        throw new Error("Backend error")
      }

      const data = await res.json()

      if (!data.success) {
        alert("Resume analysis failed")
        return
      }

      // Save for result page
      localStorage.setItem("parsedData", JSON.stringify(data.parsed_data))
      localStorage.setItem("interviewId", data.interview_id)

      router.push("/Result")

    } catch (err) {
      console.error(err)
      alert("Cannot connect to backend")
    } finally {
      setLoading(false)
    }
  }

  const fileExt   = file?.name.split(".").pop()?.toUpperCase() ?? ""
  const fileIcon  = fileExt === "PDF" ? "📄" : fileExt === "DOCX" ? "📝" : "📎"
  const extColor  = fileExt === "PDF"  ? "#e11d48" : fileExt === "DOCX" ? "#3b5bdb" : "#8b90b8"

  const FH = "'Bricolage Grotesque', sans-serif"
  const FB = "'Figtree', sans-serif"

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Figtree:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f6ff; font-family: 'Figtree', sans-serif; }

        @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes pulse-ring { 0%,100%{box-shadow:0 0 0 0 rgba(59,91,219,.25)} 50%{box-shadow:0 0 0 8px rgba(59,91,219,0)} }

        .fade-1 { opacity:0; animation: fadeUp .5s .08s forwards; }
        .fade-2 { opacity:0; animation: fadeUp .5s .18s forwards; }
        .fade-3 { opacity:0; animation: fadeUp .5s .28s forwards; }
        .fade-4 { opacity:0; animation: fadeUp .5s .38s forwards; }

        .jd-textarea {
          width: 100%; padding: 16px 18px;
          background: #fff; border: 1.5px solid #e8eaf6;
          border-radius: 14px; resize: vertical;
          font-family: 'Figtree', sans-serif; font-size: 0.9rem;
          color: #3d4270; line-height: 1.65;
          outline: none; transition: border-color .2s, box-shadow .2s;
          box-shadow: 0 2px 8px rgba(59,91,219,.04);
        }
        .jd-textarea::placeholder { color: #b0b5cc; }
        .jd-textarea:focus { border-color: #748ffc; box-shadow: 0 0 0 3px rgba(59,91,219,.1); }

        .drop-zone {
          border: 2px dashed #d1d5f0; border-radius: 16px;
          padding: 40px 24px; text-align: center;
          cursor: pointer; transition: all .2s;
          background: #fafbff;
        }
        .drop-zone.active { border-color: #4c6ef5; background: rgba(59,91,219,.04); }
        .drop-zone:hover  { border-color: #748ffc; background: rgba(59,91,219,.03); }

        .analyze-btn {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 15px 40px;
          background: linear-gradient(135deg, #3b5bdb, #4c6ef5);
          color: #fff; border: none; border-radius: 14px;
          font-family: 'Figtree', sans-serif; font-size: 1rem; font-weight: 700;
          cursor: pointer; transition: all .2s;
          box-shadow: 0 8px 28px rgba(59,91,219,.32);
        }
        .analyze-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #3451c7, #4266f0);
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(59,91,219,.42);
        }
        .analyze-btn:disabled { opacity: .65; cursor: not-allowed; transform: none; }

        .file-type-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 7px;
          font-size: 0.7rem; font-weight: 700; letter-spacing: .04em;
          border: 1.5px solid;
        }
      `}</style>

      {/* ── Ambient background ── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 700px 500px at 10% 10%, rgba(59,91,219,0.06) 0%, transparent 60%), radial-gradient(ellipse 500px 400px at 90% 90%, rgba(12,166,120,0.05) 0%, transparent 60%), #f5f6ff" }} />


      <main style={{ position: "relative", zIndex: 1, minHeight: "100vh", fontFamily: FB }}>

        {/* ── Content ── */}
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "52px 24px 80px" }}>

          {/* Page heading */}
          <div className="fade-1" style={{ textAlign: "center", marginBottom: 44 }}>
            <h1 style={{ fontFamily: FH, fontSize: "clamp(2rem,4vw,2.8rem)", fontWeight: 800, color: "#0f1133", letterSpacing: "-0.03em", marginBottom: 10 }}>
              Set up your interview
            </h1>
            <p style={{ fontSize: "1rem", color: "#8b90b8", fontWeight: 400, lineHeight: 1.65 }}>
              Upload your resume and paste the job description.<br />Our AI will analyse the match and prepare your interview.
            </p>
          </div>

          {/* ── Step 1: Job Description ── */}
          <div className="fade-2" style={{ marginBottom: 20 }}>
            <div style={{ background: "#fff", border: "1.5px solid #e8eaf6", borderRadius: 20, padding: "26px 28px", boxShadow: "0 4px 18px rgba(59,91,219,.06)" }}>

              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 18 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: "linear-gradient(135deg,#3b5bdb,#4c6ef5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", boxShadow: "0 3px 10px rgba(59,91,219,.22)", color: "#fff", fontFamily: FH, fontWeight: 800, fontSize: "0.75rem" }}>1</div>
                <h2 style={{ fontFamily: FH, fontSize: "0.95rem", fontWeight: 700, color: "#0f1133" }}>Job Description</h2>
              </div>

              <textarea
                className="jd-textarea"
                placeholder="Paste the full job description here — role responsibilities, required skills, qualifications..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                rows={5}
              />

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                <span style={{ fontSize: "0.72rem", color: "#b0b5cc", fontWeight: 500 }}>
                  {jobDesc.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
            </div>
          </div>

          {/* ── Step 2: Resume Upload ── */}
          <div className="fade-3" style={{ marginBottom: 32 }}>
            <div style={{ background: "#fff", border: "1.5px solid #e8eaf6", borderRadius: 20, padding: "26px 28px", boxShadow: "0 4px 18px rgba(59,91,219,.06)" }}>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 9, background: "linear-gradient(135deg,#3b5bdb,#4c6ef5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: FH, fontWeight: 800, fontSize: "0.75rem", boxShadow: "0 3px 10px rgba(59,91,219,.22)" }}>2</div>
                  <h2 style={{ fontFamily: FH, fontSize: "0.95rem", fontWeight: 700, color: "#0f1133" }}>Upload Resume</h2>
                </div>
                {/* Accepted format badges */}
                <div style={{ display: "flex", gap: 6 }}>
                  <span className="file-type-badge" style={{ background: "rgba(225,29,72,.07)", borderColor: "rgba(225,29,72,.2)", color: "#e11d48" }}>📄 PDF</span>
                  <span className="file-type-badge" style={{ background: "rgba(59,91,219,.07)", borderColor: "rgba(59,91,219,.2)", color: "#3b5bdb" }}>📝 DOCX</span>
                </div>
              </div>

              {/* Drop zone */}
              <div
                className={`drop-zone${dragActive ? " active" : ""}`}
                onDragEnter={() => setDragActive(true)}
                onDragLeave={() => setDragActive(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragActive(false)
                  const droppedFile = e.dataTransfer.files[0]
                  if (droppedFile) handleFile(droppedFile)
                }}
              >
                <input
                  type="file"
                  accept={ACCEPTED_EXT}
                  style={{ display: "none" }}
                  id="resumeUpload"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFile(e.target.files[0])
                  }}
                />

                <label htmlFor="resumeUpload" style={{ cursor: "pointer", display: "block" }}>
                  {!file ? (
                    <div>
                      <div style={{ fontSize: "2.6rem", marginBottom: 12 }}>☁️</div>
                      <p style={{ fontWeight: 700, color: "#3d4270", fontSize: "0.95rem", marginBottom: 5 }}>
                        Drag & drop your resume here
                      </p>
                      <p style={{ fontSize: "0.8rem", color: "#b0b5cc", marginBottom: 16 }}>or click to browse files</p>
                      <div style={{ display: "inline-flex", gap: 8 }}>
                        <span style={{ padding: "4px 12px", borderRadius: 8, background: "rgba(225,29,72,.07)", border: "1px solid rgba(225,29,72,.15)", fontSize: "0.72rem", fontWeight: 700, color: "#e11d48" }}>PDF</span>
                        <span style={{ padding: "4px 12px", borderRadius: 8, background: "rgba(59,91,219,.07)", border: "1px solid rgba(59,91,219,.15)", fontSize: "0.72rem", fontWeight: 700, color: "#3b5bdb" }}>DOCX</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
                      {/* File icon */}
                      <div style={{ width: 52, height: 52, borderRadius: 13, background: extColor + "12", border: `1.5px solid ${extColor}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                        {fileIcon}
                      </div>
                      <div style={{ textAlign: "left" }}>
                        <p style={{ fontWeight: 700, color: "#0f1133", fontSize: "0.9rem", marginBottom: 4 }}>{file.name}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span className="file-type-badge" style={{ background: extColor + "10", borderColor: extColor + "30", color: extColor }}>
                            {fileExt}
                          </span>
                          <span style={{ fontSize: "0.72rem", color: "#8b90b8" }}>
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                          <span style={{ fontSize: "0.72rem", color: "#0ca678", fontWeight: 600 }}>✓ Ready</span>
                        </div>
                      </div>
                      <div style={{ marginLeft: "auto" }}>
                        <span style={{ fontSize: "0.72rem", color: "#8b90b8", fontWeight: 500, textDecoration: "underline", cursor: "pointer" }}
                          onClick={(e) => { e.preventDefault(); setFile(null) }}>
                          Change
                        </span>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* ── Analyze Button ── */}
          <div className="fade-4" style={{ textAlign: "center" }}>
            <button
              className="analyze-btn"
              onClick={analyzeResume}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,.35)", borderTopColor: "#fff", animation: "spin .75s linear infinite" }} />
                  Analysing Resume…
                </>
              ) : (
                <>
                  <svg width="17" height="17" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/><path d="M6.5 5.5l4 2.5-4 2.5V5.5z" fill="#fff"/></svg>
                  Analyse Resume
                </>
              )}
            </button>

            <p style={{ marginTop: 14, fontSize: "0.78rem", color: "#b0b5cc", fontWeight: 400 }}>
              Your resume is analysed securely and never stored.
            </p>
          </div>

        </div>
      </main>
    </>
  )
}