'use client'

import { useState, useEffect } from 'react'
import { DayItinerary } from '@/data/itinerary'

interface DayNavProps {
  days: Pick<DayItinerary, 'day' | 'date' | 'weekday' | 'themeIcon'>[]
}

export default function DayNav({ days }: DayNavProps) {
  const [activeDay, setActiveDay] = useState(1)

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    days.forEach((day) => {
      const el = document.getElementById(`day-${day.day}`)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveDay(day.day)
        },
        { threshold: 0.15, rootMargin: '-64px 0px -55% 0px' }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [days])

  const scrollToDay = (dayNum: number) => {
    document.getElementById(`day-${dayNum}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <nav className="sticky top-0 z-50 bg-journal-50/95 backdrop-blur-sm border-b border-journal-200 shadow-sm">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex overflow-x-auto gap-1 py-2.5 scrollbar-hide">
          {days.map((day) => (
            <button
              key={day.day}
              onClick={() => scrollToDay(day.day)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeDay === day.day
                  ? 'bg-japan-red text-white shadow-sm'
                  : 'text-journal-600 hover:bg-journal-200 hover:text-journal-800'
              }`}
            >
              <span>{day.themeIcon}</span>
              <div className="flex flex-col items-start leading-tight">
                <span className="font-bold">Day {day.day}</span>
                <span
                  className={`text-[10px] ${
                    activeDay === day.day ? 'text-white/75' : 'text-journal-500'
                  }`}
                >
                  {day.date}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
