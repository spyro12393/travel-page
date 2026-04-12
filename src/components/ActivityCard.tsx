import { Activity, ActivityCategory } from '@/data/itinerary'

const categoryConfig: Record<
  ActivityCategory,
  { bg: string; text: string; border: string; dot: string; label: string }
> = {
  flight:    { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    dot: 'bg-blue-500',    label: '航班' },
  transport: { bg: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200',  dot: 'bg-violet-400',  label: '交通' },
  food:      { bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200',  dot: 'bg-orange-400',  label: '美食' },
  attraction:{ bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500', label: '景點' },
  shopping:  { bg: 'bg-pink-50',    text: 'text-pink-700',    border: 'border-pink-200',    dot: 'bg-pink-400',    label: '購物' },
  hotel:     { bg: 'bg-indigo-50',  text: 'text-indigo-700',  border: 'border-indigo-200',  dot: 'bg-indigo-400',  label: '住宿' },
  task:      { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   dot: 'bg-amber-400',   label: '任務' },
}

function MapLink({ query }: { query: string }) {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-2.5 py-1 rounded-full transition-colors whitespace-nowrap"
    >
      <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
      地圖
    </a>
  )
}

interface ActivityCardProps {
  activity: Activity
  isLast: boolean
}

export default function ActivityCard({ activity, isLast }: ActivityCardProps) {
  const cfg = categoryConfig[activity.category]

  return (
    <div className={`flex gap-3 ${isLast ? '' : 'pb-5'}`}>
      {/* Timeline spine */}
      <div className="flex flex-col items-center w-4 flex-shrink-0">
        <div className={`w-3 h-3 rounded-full ${cfg.dot} ring-2 ring-white shadow-sm mt-1.5 flex-shrink-0`} />
        {!isLast && <div className="w-px bg-gray-200 flex-grow mt-1" />}
      </div>

      {/* Card */}
      <div className={`flex-1 border ${cfg.border} ${cfg.bg} rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow`}>
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            <span className="text-xl flex-shrink-0">{activity.icon}</span>
            <div className="min-w-0">
              {activity.time && (
                <span className={`text-xs font-semibold ${cfg.text} block mb-0.5`}>
                  {activity.time}
                </span>
              )}
              <h3 className="font-semibold text-gray-800 text-sm leading-snug">
                {activity.title}
              </h3>
              {activity.subtitle && (
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  {activity.subtitle}
                </p>
              )}
            </div>
          </div>
          {activity.mapQuery && (
            <div className="flex-shrink-0 mt-0.5">
              <MapLink query={activity.mapQuery} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
