import axios from 'axios'

export const useGeocoding = () => {
  const getRoadName = async (lat: number, lng: number): Promise<string | null> => {
    try {
      const { data } = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'Accept-Language': 'es' } }
      )

      const road = data.address?.road || data.address?.pedestrian || data.address?.path

      if (!road) return null

      return road
    } catch (error) {
      return null
    }
  }

  const isOnRoad = async (lat: number, lng: number): Promise<boolean> => {
    const road = await getRoadName(lat, lng)
    return road !== null
  }

  return { getRoadName, isOnRoad }
}