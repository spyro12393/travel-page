import { DayItinerary } from '@/data/itinerary'
import ActivityCard from './ActivityCard'

interface DaySectionProps {
  day: DayItinerary
}

export default function DaySection({ day }: DaySectionProps) {
  return (
    <section id={`day-${day.day}`} className="scroll-mt-16">
      {/* Day header card */}
      <div className={`bg-gradient-to-r ${day.gradient} rounded-2xl p-5 mb-6 shadow-md`}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-white/25 text-white text-xs font-bold px-2.5 py-0.5 rounded-full tracking-wide">
                DAY {day.day}
              </span>
              <span className="text-white/80 text-sm font-medium">
                {day.date} ({day.weekday})
              </span>
            </div>
            <h2 className="text-lg font-bold text-white leading-snug">
              {day.theme}
            </h2>
          </div>
          <span className="text-4xl flex-shrink-0 drop-shadow-sm">{day.themeIcon}</span>
        </div>
      </div>

      {/* Activities timeline */}
      <div className="pl-1">
        {day.activities.map((activity, index) => (
          <ActivityCard
            key={index}
            activity={activity}
            isLast={index === day.activities.length - 1}
          />
        ))}
      </div>
    </section>
  )
}
