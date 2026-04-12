import { Loader } from '@googlemaps/js-api-loader'

// Singleton — ensures the Maps <script> is injected only once even when
// multiple DayMap components mount simultaneously.
let mapsPromise: Promise<void> | null = null

export function getGoogleMaps(): Promise<void> {
  if (mapsPromise) return mapsPromise

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

  const loader = new Loader({
    apiKey,
    version: 'weekly',
    libraries: ['maps'],
  })

  mapsPromise = loader.load().then(() => {})
  return mapsPromise
}
