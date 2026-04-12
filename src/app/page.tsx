import { itinerary } from '@/data/itinerary'
import DaySection from '@/components/DaySection'
import DayNav from '@/components/DayNav'
import Checklist from '@/components/Checklist'

export default function Home() {
  const navDays = itinerary.map(({ day, date, weekday, themeIcon }) => ({
    day,
    date,
    weekday,
    themeIcon,
  }))

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="relative bg-gradient-to-br from-japan-red via-[#8B001F] to-japan-navy text-white overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <div className="absolute -top-4 right-4 text-[160px] font-bold leading-none opacity-[0.07]">
            旅
          </div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-white/10" />
          {/* Subtle circle decorations */}
          <div className="absolute top-12 left-8 w-32 h-32 rounded-full bg-white/5" />
          <div className="absolute bottom-8 right-24 w-20 h-20 rounded-full bg-white/5" />
        </div>

        <div className="relative max-w-2xl mx-auto px-4 pt-10 pb-8">
          {/* Country tag */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🇯🇵</span>
            <span className="text-white/60 text-xs font-semibold tracking-[0.2em] uppercase">
              Japan 2026
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-1 leading-tight">
            名古屋 · 飛驒高山
          </h1>
          <p className="text-white/70 text-lg font-medium mb-1">
            上高地 · 白川鄉 · 吉卜力公園
          </p>
          <p className="text-white/50 text-sm mb-6">
            2026年 04.16 (四) — 04.21 (二) · 6 天 5 夜
          </p>

          {/* Flight cards */}
          <div className="flex flex-wrap gap-3 mb-5">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3 border border-white/10">
              <span className="text-lg">✈️</span>
              <div>
                <div className="text-white/50 text-[10px] font-semibold uppercase tracking-wide">去程</div>
                <div className="text-sm font-bold">CI0154 · TPE ➔ NGO</div>
                <div className="text-white/50 text-xs">07:30 出發</div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3 border border-white/10">
              <span className="text-lg">✈️</span>
              <div>
                <div className="text-white/50 text-[10px] font-semibold uppercase tracking-wide">回程</div>
                <div className="text-sm font-bold">CI0155 · NGO ➔ TPE</div>
                <div className="text-white/50 text-xs">12:20 出發</div>
              </div>
            </div>
          </div>

          {/* Destination tags */}
          <div className="flex flex-wrap gap-2">
            {['犬山城', '飛驒高山老街', '上高地', '新穗高纜車', '合掌村', '吉卜力公園', '熱田神宮'].map(
              (place) => (
                <span
                  key={place}
                  className="text-xs bg-white/15 text-white/85 px-3 py-1 rounded-full border border-white/10"
                >
                  {place}
                </span>
              )
            )}
          </div>
        </div>
      </header>

      {/* Sticky day navigation */}
      <DayNav days={navDays} />

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Checklist */}
        <Checklist />

        {/* Day sections */}
        <div className="space-y-12">
          {itinerary.map((day) => (
            <DaySection key={day.day} day={day} />
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center pb-10">
          <div className="w-16 h-px bg-gray-200 mx-auto mb-6" />
          <div className="text-3xl mb-3">🌸</div>
          <p className="text-gray-500 text-sm font-medium">良い旅を！</p>
          <p className="text-gray-400 text-xs mt-1">祝你有個美好的日本旅程</p>
        </footer>
      </main>
    </div>
  )
}
