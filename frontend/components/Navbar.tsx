"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { clearAuth, fetchMe, getToken } from "@/lib/auth"

const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "How it Works", href: "/#how-it-works" },
]

export default function Navbar() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const sync = async () => {
      const token = getToken()
      if (!token) {
        setUserEmail(null)
        return
      }
      const me = await fetchMe()
      if (!me?.email) {
        clearAuth()
        setUserEmail(null)
        return
      }
      localStorage.setItem("user_email", me.email)
      setUserEmail(me.email)
    }
    sync()
    const onStorage = () => sync()
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const initials = useMemo(() => {
    if (!userEmail) return "?"
    const name = userEmail.split("@")[0] || "U"
    return name.slice(0, 2).toUpperCase()
  }, [userEmail])

  const logout = () => {
    clearAuth()
    setUserEmail(null)
    setMenuOpen(false)
    router.push("/")
  }

  useEffect(() => {
    if (!menuOpen) return
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    window.addEventListener("click", onClick)
    return () => window.removeEventListener("click", onClick)
  }, [menuOpen])

  return (
    <nav className="fixed left-0 right-0 top-0 z-[100] h-16 border-b border-slate-200/70 bg-slate-50/85 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 text-white shadow-[0_4px_14px_rgba(59,91,219,0.35)]">
            ?
          </div>
          <span className="font-display text-[1.05rem] font-extrabold tracking-tight text-slate-900">
            InterviewIQ
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((item) => (
            <Link key={item.label} href={item.href} className="text-[0.95rem] font-semibold text-slate-500 transition hover:text-slate-900">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="relative flex items-center gap-2.5" ref={menuRef}>
          {userEmail ? (
            <>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-[0.75rem] font-bold text-white"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="User menu"
              >
                {initials}
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-12 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-[0_10px_28px_rgba(0,0,0,0.12)]">
                  <div className="px-3 py-2 text-xs text-slate-500">{userEmail}</div>
                  <Link href="/profile" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50" onClick={() => setMenuOpen(false)}>
                    Profile
                  </Link>
                  <Link href="/interviews" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50" onClick={() => setMenuOpen(false)}>
                    My Interviews
                  </Link>
                  <Link href="/settings" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50" onClick={() => setMenuOpen(false)}>
                    Settings
                  </Link>
                  <button
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-900 hover:bg-slate-50"
                    onClick={logout}
                  >
                    Log out
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg border border-slate-200 px-4 py-2 text-[0.85rem] font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600">
                Sign in
              </Link>
              <Link href="/signup" className="rounded-lg bg-blue-600 px-4 py-2 text-[0.85rem] font-bold text-white shadow-[0_4px_14px_rgba(59,91,219,0.3)] transition hover:-translate-y-0.5 hover:bg-blue-500">
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
