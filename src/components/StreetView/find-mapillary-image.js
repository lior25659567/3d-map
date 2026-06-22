// Finds the Mapillary image closest to a clicked coordinate using the Graph API.
// Returns an image id, or null if there's no coverage nearby.
import { KEYS } from '../../config/map-config.js'

const haversine = ([lng1, lat1], [lng2, lat2]) => {
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * 6371000 * Math.asin(Math.sqrt(a))
}

export const findMapillaryImage = async (lng, lat) => {
  const d = 0.0015 // ~150m search box
  const bbox = [lng - d, lat - d, lng + d, lat + d].join(',')
  const url =
    `https://graph.mapillary.com/images?access_token=${KEYS.mapillary}` +
    `&fields=id,computed_geometry&bbox=${bbox}&limit=30`

  const res = await fetch(url)
  if (!res.ok) return null
  const { data } = await res.json()
  if (!data?.length) return null

  let best = null
  let bestDist = Infinity
  for (const img of data) {
    const coords = img.computed_geometry?.coordinates
    if (!coords) continue
    const dist = haversine([lng, lat], coords)
    if (dist < bestDist) {
      bestDist = dist
      best = img.id
    }
  }
  return best
}
