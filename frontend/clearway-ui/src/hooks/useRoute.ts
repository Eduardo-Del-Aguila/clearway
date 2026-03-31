import { useState } from 'react'
import axios from 'axios'

const ORS_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjI3Y2RjMzVhNmQwMTQ0YzJiMGNiNmUzMjFjMDY3YWEzIiwiaCI6Im11cm11cjY0In0='

interface RouteCoords {
  lat: number
  lng: number
}

export const useRoute = () => {
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([])

  const calculateRoute = async (origin: RouteCoords, destination: RouteCoords) => {
    const { data } = await axios.get(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_KEY}&start=${origin.lng},${origin.lat}&end=${destination.lng},${destination.lat}`
    )

    const coords = data.features[0].geometry.coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng] as [number, number]
    )

    setRouteCoords(coords)
  }

  return { routeCoords, calculateRoute }
}