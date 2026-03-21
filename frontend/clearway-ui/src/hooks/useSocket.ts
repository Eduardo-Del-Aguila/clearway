import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3001')

interface Position {
  id: number
  latitude: number
  longitude: number
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