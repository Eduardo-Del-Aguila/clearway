import { useEffect, useState } from "react"
import axios from "axios"
import { io } from "socket.io-client"

const API_URL = import.meta.env.VITE_URL_API

export interface EmergencyCount {
  id: number
  nombre: string
  total: number
}

const SOCKET_URL = import.meta.env.VITE_URL_API.replace('/api', '')
const socket = io(SOCKET_URL)

const useEmergency = () => {
  const [counts, setCounts] = useState<EmergencyCount[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCounts = async () => {
    try {
      const res = await axios.get(`${API_URL}/emergencias/count-by-ambulance`)
      
      const data: EmergencyCount[] = res.data.map((item: any) => ({
        id: item.id,
        nombre: item.nombre,
        total: Number(item.total)
      }))

      setCounts(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCounts()
    socket.on('emergencias:update', fetchCounts)
    return () => {
      socket.off('emergencias:update', fetchCounts)
    }
  }, [])

  return {
    counts,
    loading,
    refetch: fetchCounts
  }
}

export default useEmergency