import { useCallback, useState } from 'react'
import MapView from './components/MapView/MapView.jsx'
import Photoreal3DLayer from './components/Photoreal3DLayer/Photoreal3DLayer.jsx'
import MapControls from './components/MapControls/MapControls.jsx'
import PlacePicker from './components/PlacePicker/PlacePicker.jsx'
import StreetView from './components/StreetView/StreetView.jsx'
import Attribution from './components/Attribution/Attribution.jsx'
import { canUsePhotoreal } from './providers/map-provider.js'
import { CITY } from './config/map-config.js'
import './App.css'

const App = () => {
  const [place, setPlace] = useState(CITY)
  const [streetLocation, setStreetLocation] = useState(null)
  const [googleCredits, setGoogleCredits] = useState('')
  const photorealAvailable = canUsePhotoreal()

  const handleAttribution = useCallback((credits) => setGoogleCredits(credits), [])

  return (
    <div className="app">
      <header className="app__title">
        <strong>{place.name}</strong>
        <span>Photorealistic 3D</span>
      </header>

      {photorealAvailable ? (
        <MapView>
          <Photoreal3DLayer onAttribution={handleAttribution} />
          <PlacePicker activeId={place.id} onChange={setPlace} />
          <MapControls onEnterStreetLevel={setStreetLocation} />
          <Attribution googleCredits={googleCredits} />
        </MapView>
      ) : (
        <div className="app__notice">
          Add a Google Maps key (<code>VITE_GOOGLE_MAPS_KEY</code> in <code>.env</code>) to view the 3D map.
        </div>
      )}

      {streetLocation && (
        <StreetView location={streetLocation} onClose={() => setStreetLocation(null)} />
      )}
    </div>
  )
}

export default App
