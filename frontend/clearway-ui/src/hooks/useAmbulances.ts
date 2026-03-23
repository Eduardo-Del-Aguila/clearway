import { useEffect, useState } from 'react'
import axios from 'axios'
import type { Ambulance } from '../types'

export const useAmbulances = (hospitalIds: number[]) => {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([])

  useEffect(() => {
    if (hospitalIds.length === 0) return

    const fetchAmbulances = async () => {
      const results = await Promise.all(
        hospitalIds.map(id => axios.get(`http://localhost:3001/api/ambulancias/hospital/${id}`))
      )
      const all = results.flatMap(r => r.data)
      setAmbulances(all)
    }

    fetchAmbulances()
    const interval = setInterval(fetchAmbulances, 5000)
    return () => clearInterval(interval)
  }, [hospitalIds.length])

  return { ambulances }
}