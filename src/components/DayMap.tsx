'use client'

import { useEffect, useRef } from 'react'
import { getGoogleMaps } from '@/lib/googleMapsLoader'
import type { ActivityCategory } from '@/data/itinerary'

export interface MapPoint {
  lat: number
  lng: number
  title: string
  category: ActivityCategory
}

// Cream-toned map style — warm paper aesthetic
const MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#f5ede0' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5ede0' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#e0d0ba' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#cbb9a0' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#c9a87c' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#b5864c' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#a8c0d0' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#5c6878' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#c0d8b8' }] },
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
]

const CATEGORY_COLORS: Record<ActivityCategory, string> = {
  flight:     '#3B82F6',
  transport:  '#7C3AED',
  food:       '#EA580C',
  attraction: '#059669',
  shopping:   '#DB2777',
  hotel:      '#4F46E5',
  task:       '#B45309',
}

interface DayMapProps {
  points: MapPoint[]
  dayNum: number
}

export default function DayMap({ points, dayNum }: DayMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  useEffect(() => {
    if (!mapRef.current || !apiKey || points.length === 0) return

    getGoogleMaps().then(() => {
      if (!mapRef.current) return
      const g = window.google

      const map = new g.maps.Map(mapRef.current, {
        zoom: 13,
        styles: MAP_STYLE,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
      })

      const bounds = new g.maps.LatLngBounds()
      const path: { lat: number; lng: number }[] = []

      points.forEach((pt, i) => {
        const position = { lat: pt.lat, lng: pt.lng }
        bounds.extend(position)
        path.push(position)

        new g.maps.Marker({
          position,
          map,
          title: pt.title,
          label: {
            text: String(i + 1),
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '11px',
          },
          icon: {
            path: g.maps.SymbolPath.CIRCLE,
            fillColor: CATEGORY_COLORS[pt.category],
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            scale: 14,
          },
        })
      })

      if (path.length > 1) {
        new g.maps.Polyline({
          path,
          geodesic: true,
          strokeColor: '#9B2C2C',
          strokeOpacity: 0.55,
          strokeWeight: 2,
          map,
        })
      }

      map.fitBounds(bounds, 48)
    })
  // dayNum ensures re-mount when switching days in the same tree
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, dayNum])

  if (!apiKey) {
    return (
      <div className="h-48 bg-journal-100 border border-journal-200 rounded-xl flex flex-col items-center justify-center gap-2 text-journal-600 text-sm mb-4">
        <span className="text-3xl">🗺️</span>
        <p className="font-medium text-journal-700">地圖需要 Google Maps API Key</p>
        <p className="text-[11px] text-journal-500">
          設定環境變數 <code className="bg-journal-200 px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>
        </p>
      </div>
    )
  }

  if (points.length === 0) return null

  return (
    <div
      ref={mapRef}
      className="h-56 md:h-64 w-full rounded-xl overflow-hidden border border-journal-200 shadow-sm mb-4"
    />
  )
}
