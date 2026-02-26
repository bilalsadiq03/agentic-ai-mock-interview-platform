"use client"
import { useRouter } from "next/navigation"

export default function RoleCard({ role }: { role: string }) {
  const router = useRouter()

  return (
    <div
      onClick={() => router.push("/interview")}
      className="bg-gray-900 p-6 rounded-xl cursor-pointer hover:bg-gray-800 transition"
    >
      <h2 className="text-xl font-semibold mb-3">{role}</h2>
      <p className="text-gray-400">
        AI will conduct a mock interview tailored for this role.
      </p>
    </div>
  )
}