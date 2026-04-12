'use client'

import { useState } from 'react'
import { checklist } from '@/data/itinerary'

export default function Checklist() {
  const [checked, setChecked] = useState<Set<number>>(new Set())

  const toggle = (id: number) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const allChecked = checked.size === checklist.length

  return (
    <div className="bg-white border border-journal-200 rounded-2xl p-5 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-journal-800 flex items-center gap-2 text-sm">
          <span>🎒</span>
          <span>出發前的小清單</span>
        </h2>
        {allChecked && (
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-semibold">
            ✓ 準備完成！
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        {checklist.map((item) => (
          <button
            key={item.id}
            onClick={() => toggle(item.id)}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-journal-50 transition-colors text-left"
          >
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                checked.has(item.id)
                  ? 'bg-japan-red border-japan-red'
                  : 'border-journal-300'
              }`}
            >
              {checked.has(item.id) && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span
              className={`text-sm ${
                checked.has(item.id) ? 'line-through text-journal-400' : 'text-journal-700'
              }`}
            >
              {item.icon} {item.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
