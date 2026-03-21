import { useEffect, useState } from 'react'
import axios from 'axios'
import type { TrafficLight } from '../types'


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