import { useMap } from '../MapView/map-context.js'
import { CITY } from '../../config/map-config.js'
import { streetViewProvider } from '../../providers/map-provider.js'
import './MapControls.css'

// Floating controls: zoom, reset bearing/pitch, and dive to street level.
const MapControls = ({ onEnterStreetLevel }) => {
  const map = useMap()
  const svAvailable = streetViewProvider() !== 'none'

  const zoomBy = (delta) => map?.easeTo({ zoom: map.getZoom() + delta, duration: 300 })

  const resetNorth = () =>
    map?.easeTo({ bearing: 0, pitch: CITY.pitch, duration: 500 })

  const enterStreetLevel = () => {
    if (!map) return
    const c = map.getCenter()
    onEnterStreetLevel({ lng: c.lng, lat: c.lat })
  }

  return (
    <div className="map-controls">
      <div className="map-controls__group">
        <button onClick={() => zoomBy(1)} aria-label="Zoom in">＋</button>
        <button onClick={() => zoomBy(-1)} aria-label="Zoom out">－</button>
      </div>

      <button className="map-controls__btn" onClick={resetNorth} aria-label="Reset north">
        🧭
      </button>

      {svAvailable && (
        <button className="map-controls__street" onClick={enterStreetLevel}>
          👁 Street level
        </button>
      )}
    </div>
  )
}

export default MapControls
