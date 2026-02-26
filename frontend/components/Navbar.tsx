"use client"
import Link from "next/link"

const NAV_LINKS = ["Features", "How it Works", "Pricing"]

export default function Navbar() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Figtree:wght@400;500;600;700&display=swap');
        .nav-link {
          color: #8b90b8;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          font-family: 'Figtree', sans-serif;
          transition: color 0.15s;
        }
        .nav-link:hover { color: #0f1133; }
        .nav-btn-ghost {
          padding: 8px 18px;
          border-radius: 9px;
          border: 1.5px solid #d1d5f0;
          background: transparent;
          font-size: 0.84rem;
          font-weight: 600;
          color: #3d4270;
          text-decoration: none;
          font-family: 'Figtree', sans-serif;
          transition: all 0.15s;
        }
        .nav-btn-ghost:hover { border-color: #3b5bdb; color: #3b5bdb; }
        .nav-btn-fill {
          padding: 9px 22px;
          border-radius: 9px;
          background: #3b5bdb;
          font-size: 0.84rem;
          font-weight: 700;
          color: #fff;
          text-decoration: none;
          font-family: 'Figtree', sans-serif;
          box-shadow: 0 4px 14px rgba(59,91,219,0.3);
          transition: all 0.2s;
        }
        .nav-btn-fill:hover {
          background: #4c6ef5;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(59,91,219,0.42);
        }
      `}</style>

      <nav
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 100,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 56px",
          background: "rgba(245,246,255,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid #e8eaf6",
        }}
      >
        {/* ── Logo ── */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div
            style={{
              width: 34, height: 34,
              borderRadius: 10,
              background: "linear-gradient(135deg, #3b5bdb, #4c6ef5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: "1rem",
              boxShadow: "0 4px 14px rgba(59,91,219,0.35)",
              flexShrink: 0,
            }}
          >
            ⚡
          </div>
          <span
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 800,
              fontSize: "1.05rem",
              color: "#0f1133",
              letterSpacing: "-0.02em",
            }}
          >
            InterviewIQ
          </span>
        </Link>

        {/* ── Nav Links ── */}
        <div style={{ display: "flex", gap: 32 }}>
          {NAV_LINKS.map((label) => (
            <Link key={label} href="#" className="nav-link">
              {label}
            </Link>
          ))}
        </div>

        {/* ── CTA Buttons ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/login" className="nav-btn-ghost">
            Sign in
          </Link>
          <Link href="/start" className="nav-btn-fill">
            Start Free →
          </Link>
        </div>
      </nav>
    </>
  )
}