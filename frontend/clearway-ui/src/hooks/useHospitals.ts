import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'
import type { Hospital } from '../types'

const API_URL = import.meta.env.VITE_URL_API
const socket = io(`${API_URL}`)


export const useHospitals = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([])

  const fetchHospitals = async () => {
    const { data } = await axios.get(`${API_URL}/hospitales`)
    setHospitals(data)
  }

  useEffect(() => {
    fetchHospitals()

    socket.on('hospitales:update', fetchHospitals)
    return () => { socket.off('hospitales:update') }
  }, [])

  return { hospitals }
}