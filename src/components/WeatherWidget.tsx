'use client'

import { useState, useEffect } from 'react'

// WMO Weather Interpretation Codes → display info
const WMO: Record<number, { emoji: string; label: string }> = {
  0:  { emoji: '☀️',  label: '晴朗' },
  1:  { emoji: '🌤️', label: '大致晴朗' },
  2:  { emoji: '⛅',  label: '局部多雲' },
  3:  { emoji: '☁️',  label: '陰天' },
  45: { emoji: '🌫️', label: '霧' },
  48: { emoji: '🌫️', label: '霧（霜）' },
  51: { emoji: '🌦️', label: '毛毛雨（輕）' },
  53: { emoji: '🌦️', label: '毛毛雨' },
  55: { emoji: '🌦️', label: '毛毛雨（強）' },
  61: { emoji: '🌧️', label: '小雨' },
  63: { emoji: '🌧️', label: '雨' },
  65: { emoji: '🌧️', label: '大雨' },
  71: { emoji: '🌨️', label: '小雪' },
  73: { emoji: '🌨️', label: '雪' },
  75: { emoji: '🌨️', label: '大雪' },
  77: { emoji: '🌨️', label: '冰珠' },
  80: { emoji: '🌦️', label: '陣雨（輕）' },
  81: { emoji: '🌦️', label: '陣雨' },
  82: { emoji: '⛈️',  label: '強陣雨' },
  95: { emoji: '⛈️',  label: '雷雨' },
  96: { emoji: '⛈️',  label: '雷雨＋冰雹' },
  99: { emoji: '⛈️',  label: '激烈雷雨＋冰雹' },
}

function decodeWMO(code: number) {
  return WMO[code] ?? { emoji: '🌡️', label: `天氣代碼 ${code}` }
}

interface WeatherData {
  code: number
  maxTemp: number
  minTemp: number
}

interface WeatherWidgetProps {
  date: string           // "04.16"
  weatherLat: number
  weatherLng: number
  weatherLocation: string
}

export default function WeatherWidget({
  date,
  weatherLat,
  weatherLng,
  weatherLocation,
}: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    // Convert "04.16" → "2026-04-16"
    const iso = `2026-${date.replace('.', '-')}`
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${weatherLat}&longitude=${weatherLng}` +
      `&daily=weathercode,temperature_2m_max,temperature_2m_min` +
      `&timezone=Asia%2FTokyo` +
      `&start_date=${iso}&end_date=${iso}`

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const code = data?.daily?.weathercode?.[0]
        const max  = data?.daily?.temperature_2m_max?.[0]
        const min  = data?.daily?.temperature_2m_min?.[0]
        if (code !== undefined && max !== undefined) {
          setWeather({ code, maxTemp: Math.round(max), minTemp: Math.round(min) })
        } else {
          setError(true)
        }
      })
      .catch(() => setError(true))
  }, [date, weatherLat, weatherLng])

  if (error) return null

  if (!weather) {
    return (
      <div className="flex items-center gap-3 bg-journal-100 border border-journal-200 rounded-xl px-4 py-3 mb-4 animate-pulse">
        <div className="w-9 h-9 bg-journal-300 rounded-full flex-shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-journal-300 rounded w-28" />
          <div className="h-3 bg-journal-200 rounded w-20" />
        </div>
      </div>
    )
  }

  const { emoji, label } = decodeWMO(weather.code)

  return (
    <div className="flex items-center gap-3 bg-journal-50 border border-journal-200 rounded-xl px-4 py-3 mb-4">
      <span className="text-3xl leading-none flex-shrink-0">{emoji}</span>
      <div className="min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-semibold text-journal-800 text-sm">{label}</span>
          <span className="text-journal-500 text-xs">{weatherLocation}</span>
        </div>
        <div className="flex items-center gap-2 text-xs mt-0.5">
          <span className="text-rose-500 font-medium">↑ {weather.maxTemp}°C</span>
          <span className="text-journal-300">·</span>
          <span className="text-blue-500 font-medium">↓ {weather.minTemp}°C</span>
        </div>
      </div>
      <span className="ml-auto text-[10px] text-journal-400 hidden sm:block whitespace-nowrap">
        Open-Meteo
      </span>
    </div>
  )
}
