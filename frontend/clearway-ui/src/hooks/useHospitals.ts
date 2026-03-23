import { useEffect, useState } from 'react'
import axios from 'axios'
import type { Hospital } from '../types'

export const useHospitals = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([])

  useEffect(() => {
    const fetchHospitals = async () => {
      const { data } = await axios.get('http://localhost:3001/api/hospitales')
      setHospitals(data)
    }

    fetchHospitals()
    const interval = setInterval(fetchHospitals, 5000)
    return () => clearInterval(interval)
  }, [])

  return { hospitals, setHospitals }
}