"use client"

import Link from "next/link"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 pt-24">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm font-semibold text-slate-500">? Back to Home</Link>

        <h1 className="font-display mt-3 text-3xl font-extrabold text-slate-900">Product Demo</h1>
        <p className="mt-2 text-slate-500">A quick walkthrough of the interview flow, live evaluation, and reporting.</p>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_36px_rgba(0,0,0,0.08)]">
          <div className="flex h-72 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 text-sm font-semibold uppercase tracking-[0.2em] text-white">
            Demo video placeholder
          </div>
          <div className="mt-4 text-sm text-slate-500">
            Replace this panel with an embedded demo video or screenshots once available.
          </div>
        </div>
      </div>
    </div>
  )
}
