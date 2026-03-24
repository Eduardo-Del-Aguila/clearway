import { useState, useRef } from 'react'
import axios from 'axios'
import type { Ambulance, TrafficLight } from '../types'

interface Position {
  lat: number
  lng: number
}

interface Mission {
  id: string
  ambulance: Ambulance
  emergency: Position
  route: [number, number][]
  currentIndex: number
  color: string
  emergenciaId: string
}



export const MISSION_COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7']



export const useMission = (trafficLights: TrafficLight[], isRunning: boolean) => {
  const [missions, setMissions] = useState<Mission[]>([])
  const intervalsRef = useRef<Record<string, ReturnType<typeof setInterval>>>({})

  const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371000
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng/2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  }

  const getNearestAmbulance = (emergency: Position, ambulances: Ambulance[]): Ambulance | null => {
    const free = ambulances.filter(a => a.estado === 'libre' && a.latitud && a.longitud)
    if (free.length === 0) return null
    return free.reduce((nearest, current) => {
      const distCurrent = getDistance(emergency.lat, emergency.lng, current.latitud, current.longitud)
      const distNearest = getDistance(emergency.lat, emergency.lng, nearest.latitud, nearest.longitud)
      return distCurrent < distNearest ? current : nearest
    })
  }

    const completeMission = async (missionId: string, ambulance: Ambulance, emergenciaId: number) => {
      if (intervalsRef.current[missionId]) {
        clearInterval(intervalsRef.current[missionId])
        delete intervalsRef.current[missionId]
      }

      await axios.put(`http://localhost:3001/api/ambulancias/${ambulance.id}`, {
        nombre: ambulance.nombre,
        placa: ambulance.placa,
        estado: 'libre'
      })

      await axios.put(`http://localhost:3001/api/emergencias/${emergenciaId}/atendida`)
      setMissions(prev => prev.filter(m => m.id !== missionId))
    }
  const checkTrafficLights = async (position: Position, remainingRoute: [number, number][]) => {
    const speedMs = 60000 / 3600
    let accumulatedDistance = 0

    for (const tl of trafficLights) {
      for (let i = 1; i < remainingRoute.length; i++) {
        accumulatedDistance += getDistance(remainingRoute[i-1][0], remainingRoute[i-1][1], remainingRoute[i][0], remainingRoute[i][1])
        const distToTl = getDistance(remainingRoute[i][0], remainingRoute[i][1], tl.latitud, tl.longitud)
        
        if (distToTl < 50) {
          const estimatedSeconds = accumulatedDistance / speedMs
          if (estimatedSeconds <= 120 && tl.estado_emergencia === 'apagado') {
            await axios.put(`http://localhost:3001/api/semaforos/${tl.id}/emergencia`, { estado_emergencia: 'verde' })
          }
          break
        }
      }

      const distToAmbulance = getDistance(position.lat, position.lng, tl.latitud, tl.longitud)
      if (distToAmbulance > 10 && tl.estado_emergencia !== 'apagado') {
        await axios.put(`http://localhost:3001/api/semaforos/${tl.id}/emergencia`, { estado_emergencia: 'apagado' })
      }
    }
  }

const startMission = async (ambulance: Ambulance, emergency: Position, missionColor: string) => {
  if (!isRunning) {
    alert('Inicia la simulacion antes de agregar una emergencia')
    return
  }

  const { data } = await axios.get(
    `https://router.project-osrm.org/route/v1/driving/${ambulance.longitud},${ambulance.latitud};${emergency.lng},${emergency.lat}?overview=full&geometries=geojson`
  )

  const coords: [number, number][] = data.routes[0].geometry.coordinates.map(
    ([lng, lat]: [number, number]) => [lat, lng]
  )


  // Marcar ambulancia como en_ruta
  await axios.put(`http://localhost:3001/api/ambulancias/${ambulance.id}`, {
    nombre: ambulance.nombre,
    placa: ambulance.placa,
    estado: 'en_ruta'
  })

  const emergenciaRes = await axios.post('http://localhost:3001/api/emergencias', {
    latitud: emergency.lat,
    longitud: emergency.lng,
    ambulancia_id: ambulance.id
  })

  const missionId = `mission_${Date.now()}`
  const newMission: Mission = {
    id: missionId,
    ambulance: { ...ambulance, estado: 'en_ruta' },
    emergency,
    route: coords,
    currentIndex: 0,
    color: missionColor,
    emergenciaId: emergenciaRes.data.id
  }

  setMissions(prev => [...prev, newMission])

  let index = 0
  intervalsRef.current[missionId] = setInterval(async () => {
    if (index >= coords.length) {
      await completeMission(missionId, ambulance, emergenciaRes.data.id)
      return
    }

    const position = { lat: coords[index][0], lng: coords[index][1] }
    setMissions(prev => prev.map(m => m.id === missionId ? { ...m, currentIndex: index } : m))
    await checkTrafficLights(position, coords.slice(index))
    index++
  }, 2000)
}

  const stopMission = (missionId: string) => {
    if (intervalsRef.current[missionId]) {
      clearInterval(intervalsRef.current[missionId])
      delete intervalsRef.current[missionId]
    }
    setMissions(prev => prev.filter(m => m.id !== missionId))
  }

  const stopAllMissions = () => {
    Object.values(intervalsRef.current).forEach(clearInterval)
    intervalsRef.current = {}
    setMissions([])
  }

  return { missions, startMission, stopMission, stopAllMissions, getNearestAmbulance }
}