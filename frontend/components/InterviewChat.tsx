"use client"
import { useState } from "react"

export default function InterviewChat() {
  const [messages, setMessages] = useState<string[]>([
    "Hello! Let's start your interview. Tell me about yourself."
  ])
  const [input, setInput] = useState("")

  const sendMessage = () => {
    if (!input) return

    setMessages([...messages, input])
    setInput("")
  }

  return (
    <div className="max-w-3xl mx-auto">
      
      <div className="h-[60vh] overflow-y-auto bg-gray-900 p-6 rounded-xl mb-4">
        {messages.map((msg, i) => (
          <div key={i} className="mb-3">
            {msg}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <input
          className="flex-1 bg-gray-800 p-3 rounded-lg outline-none"
          placeholder="Type your answer..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 px-6 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  )
}