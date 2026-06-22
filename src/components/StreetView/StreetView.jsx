import { useEffect, useRef, useState } from 'react'
import { Viewer as MapillaryViewer } from 'mapillary-js'
import 'mapillary-js/dist/mapillary.css'
import { KEYS } from '../../config/map-config.js'
import { streetViewProvider } from '../../providers/map-provider.js'
import { loadGoogleMaps } from './google-loader.js'
import { findMapillaryImage } from './find-mapillary-image.js'
import './StreetView.css'

// Full-screen ground-level viewer opened at a clicked coordinate.
// Uses Google Street View when a Google key exists, else Mapillary (free).
const StreetView = ({ location, onClose }) => {
  const containerRef = useRef(null)
  const [status, setStatus] = useState('loading') // loading | ready | empty | error
  const provider = streetViewProvider()

  useEffect(() => {
    if (!location || !containerRef.current) return
    const el = containerRef.current
    let viewer = null
    let cancelled = false

    const openGoogle = async () => {
      const google = await loadGoogleMaps(KEYS.google)
      if (cancelled) return
      const svService = new google.maps.StreetViewService()
      svService.getPanorama(
        { location: { lat: location.lat, lng: location.lng }, radius: 80 },
        (data, gStatus) => {
          if (cancelled) return
          if (gStatus !== 'OK') {
            setStatus('empty')
            return
          }
          // eslint-disable-next-line no-new
          new google.maps.StreetViewPanorama(el, {
            pano: data.location.pano,
            pov: { heading: 0, pitch: 0 },
            zoom: 0,
            addressControl: true,
            fullscreenControl: false,
          })
          setStatus('ready')
        },
      )
    }

    const openMapillary = async () => {
      const imageId = await findMapillaryImage(location.lng, location.lat)
      if (cancelled) return
      if (!imageId) {
        setStatus('empty')
        return
      }
      viewer = new MapillaryViewer({
        accessToken: KEYS.mapillary,
        container: el,
        imageId,
      })
      setStatus('ready')
    }

    setStatus('loading')
    const run = provider === 'google' ? openGoogle : openMapillary
    run().catch(() => !cancelled && setStatus('error'))

    return () => {
      cancelled = true
      if (viewer) {
        try {
          viewer.remove()
        } catch {
          // ignore
        }
      }
      el.innerHTML = ''
    }
  }, [location, provider])

  if (!location) return null

  return (
    <div className="street-view">
      <div ref={containerRef} className="street-view__canvas" />

      {status !== 'ready' && (
        <div className="street-view__message">
          {status === 'loading' && 'Finding street-level imagery…'}
          {status === 'empty' && 'No street-level imagery here. Try a road nearby.'}
          {status === 'error' && 'Could not load street view.'}
        </div>
      )}

      <button className="street-view__close" onClick={onClose} aria-label="Close street view">
        ✕ Back to map
      </button>

      <div className="street-view__credit">
        {provider === 'google' ? 'Imagery © Google' : 'Imagery © Mapillary contributors'}
      </div>
    </div>
  )
}

export default StreetView
