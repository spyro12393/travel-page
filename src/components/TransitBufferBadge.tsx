interface TransitBufferBadgeProps {
  line: string
  departures: string[]
  bookedIndex: number
}

export default function TransitBufferBadge({
  line,
  departures,
  bookedIndex,
}: TransitBufferBadgeProps) {
  const start = Math.max(0, bookedIndex - 2)
  const end = Math.min(departures.length - 1, bookedIndex + 2)
  const visible = departures.slice(start, end + 1)

  return (
    <div className="mt-3 pt-3 border-t border-journal-200">
      <p className="text-[11px] text-journal-600 font-medium mb-2 flex items-center gap-1.5">
        <span>🕰️</span>
        <span>{line}</span>
      </p>
      <div className="flex gap-1.5 flex-wrap">
        {visible.map((time, i) => {
          const realIdx = start + i
          const offset = realIdx - bookedIndex
          const label =
            offset === 0 ? '已預訂' : offset < 0 ? `T${offset}` : `T+${offset}`
          const isBooked = realIdx === bookedIndex

          return (
            <div
              key={i}
              className={`flex flex-col items-center px-2.5 py-1.5 rounded-lg min-w-[3rem] text-center ${
                isBooked
                  ? 'bg-japan-red text-white shadow-sm'
                  : 'bg-journal-100 text-journal-700'
              }`}
            >
              <span className="text-xs font-bold leading-tight">{time}</span>
              <span
                className={`text-[9px] leading-tight mt-0.5 ${
                  isBooked ? 'text-white/75' : 'text-journal-500'
                }`}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
