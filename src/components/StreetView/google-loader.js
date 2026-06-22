// Loads the Google Maps JS API once and caches the promise.
let promise = null

export const loadGoogleMaps = (key) => {
  if (promise) return promise
  promise = new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve(window.google)
      return
    }
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&v=weekly`
    script.async = true
    script.onload = () => resolve(window.google)
    script.onerror = () => reject(new Error('Failed to load Google Maps JS API'))
    document.head.appendChild(script)
  })
  return promise
}
