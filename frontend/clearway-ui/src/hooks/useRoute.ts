import { useState } from 'react'
import axios from 'axios'

interface RouteCoords {
  lat: number
  lng: number
}

export const useRoute = () => {
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([])

  const calculateRoute = async (origin: RouteCoords, destination: RouteCoords) => {
    const { data } = await axios.get(
      `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`
    )

    const coords = data.routes[0].geometry.coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng] as [number, number]
    )

    setRouteCoords(coords)
  }

  return { routeCoords, calculateRoute }
}