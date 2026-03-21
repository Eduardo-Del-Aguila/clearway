import { useEffect, useState } from 'react'
import axios from 'axios'

interface TraficLight {
  id: number
  latitud: number
  longitud: number
  calle: string
  estado: string
  prioridad_emergencia: boolean
}

export const useTraficlights = () => {
  const [traficLight, setTraficlight] = useState<TraficLight[]>([])

  useEffect(() => {
    const fetchtraficlights = async () => {
      const { data } = await axios.get('http://localhost:3001/api/semaforos')
      setTraficlight(data)
    }

    fetchtraficlights()
  }, [])

  return { traficLight }
}