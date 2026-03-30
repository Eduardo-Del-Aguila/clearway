import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const API_URL = import.meta.env.VITE_URL_APIC
const socket = io(`${API_URL}`)

interface Position {
  id: number
  latitud: number
  longitud: number
}

export const useSocket = () => {
  const [position, setPosition] = useState<Position | null>(null)

  useEffect(() => {
    socket.on('ambulancia:movimiento', (data: Position) => {
      setPosition(data)
    })

    return () => {
      socket.off('ambulancia:movimiento')
    }
  }, [])

  return { position }
}