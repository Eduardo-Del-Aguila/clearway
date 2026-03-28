import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'
import type { Hospital } from '../types'

const socket = io('http://localhost:3001')

export const useHospitals = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([])

  const fetchHospitals = async () => {
    const { data } = await axios.get('http://localhost:3001/api/hospitales')
    setHospitals(data)
  }

  useEffect(() => {
    fetchHospitals()

    socket.on('hospitales:update', fetchHospitals)
    return () => { socket.off('hospitales:update') }
  }, [])

  return { hospitals }
}