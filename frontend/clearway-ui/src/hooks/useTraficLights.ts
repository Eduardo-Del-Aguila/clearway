import { useEffect, useState } from 'react'
import axios from 'axios'

interface TrafficLight {
  id: number
  latitud: number
  longitud: number
  calle: string
  estado: string
  prioridad_emergencia: boolean
  estado_emergencia: string
}


export const useTrafficLights = () => {
  const [trafficLights, setTrafficLights] = useState<TrafficLight[]>([])

  useEffect(() => {
    const fetchTrafficLights = async () => {
    const { data } = await axios.get('http://localhost:3001/api/semaforos')
      setTrafficLights(data)
    }

    fetchTrafficLights()
    const interval = setInterval(fetchTrafficLights, 3000)

    return () => clearInterval(interval)
  }, [])

  return { trafficLights }
}