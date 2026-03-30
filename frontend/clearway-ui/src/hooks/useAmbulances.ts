import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'
import type { Ambulance } from '../types'

const socket = io('http://localhost:3001')
const API_URL = import.meta.env.VITE_URL_API


export const useAmbulances = (hospitalIds: number[]) => {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([])

  const fetchAmbulances = async () => {
    if (hospitalIds.length === 0) return
    const results = await Promise.all(
      hospitalIds.map(id => axios.get(`${API_URL}/ambulancias/hospital/${id}`))
    )
    setAmbulances(results.flatMap(r => r.data))
  }

  useEffect(() => {
    fetchAmbulances()

    socket.on('ambulancias:update', fetchAmbulances)
    return () => { socket.off('ambulancias:update') }
  }, [hospitalIds.length])

  return { ambulances }
}

