import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'
import type { TrafficLight } from '../types'

const socket = io('http://localhost:3001')

export const useTrafficLights = () => {
  const [trafficLights, setTrafficLights] = useState<TrafficLight[]>([])

  const fetchTrafficLights = async () => {
    const { data } = await axios.get('http://localhost:3001/api/semaforos')
    setTrafficLights(data)
  }

  useEffect(() => {
    fetchTrafficLights()

    socket.on('semaforos:update', fetchTrafficLights)
    return () => { socket.off('semaforos:update') }
  }, [])

  return { trafficLights }
}