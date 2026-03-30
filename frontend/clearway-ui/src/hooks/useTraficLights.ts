import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'
import type { TrafficLight } from '../types'

const API_URL = import.meta.env.VITE_URL_API
const socket = io(`${API_URL}`)

export const useTrafficLights = () => {
  const [trafficLights, setTrafficLights] = useState<TrafficLight[]>([])

  const fetchTrafficLights = async () => {
    const { data } = await axios.get(`${API_URL}/semaforos`)
    setTrafficLights(data)
  }

  useEffect(() => {
    fetchTrafficLights()

    socket.on('semaforos:update', fetchTrafficLights)
    return () => { socket.off('semaforos:update') }
  }, [])

  return { trafficLights }
}