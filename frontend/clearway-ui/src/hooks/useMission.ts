import { useState, useRef } from 'react'
import axios from 'axios'
import type { Ambulance, Hospital, Mission, Position, TrafficLight } from '../types'

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
    if (free.length === 0){
        alert('No quedan ambulancias disponibles');
        return null
    } 
    return free.reduce((nearest, current) => {
      const distCurrent = getDistance(emergency.lat, emergency.lng, current.latitud, current.longitud)
      const distNearest = getDistance(emergency.lat, emergency.lng, nearest.latitud, nearest.longitud)
      return distCurrent < distNearest ? current : nearest
    }, free[0])
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

  const driveRoute = (
    missionId: string,
    coords: [number, number][],
    onStep: (position: Position, index: number) => void,
    onComplete: () => void
  ) => {
    let index = 0
    intervalsRef.current[missionId] = setInterval(() => {
      if (index >= coords.length) {
        clearInterval(intervalsRef.current[missionId])
        delete intervalsRef.current[missionId]
        onComplete()
        return
      }
      const position = { lat: coords[index][0], lng: coords[index][1] }
      onStep(position, index)
      index++
    }, 1000)
  }

  const startMission = async (ambulance: Ambulance, emergency: Position, missionColor: string, hospital: Hospital) => {
    if (!isRunning) {
      alert('Inicia la simulacion antes de agregar una emergencia')
      return
    }

    const outboundData = await axios.get(
      `https://router.project-osrm.org/route/v1/driving/${ambulance.longitud},${ambulance.latitud};${emergency.lng},${emergency.lat}?overview=full&geometries=geojson`
    )
    const outboundCoords: [number, number][] = outboundData.data.routes[0].geometry.coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng]
    )

    const returnData = await axios.get(
      `https://router.project-osrm.org/route/v1/driving/${emergency.lng},${emergency.lat};${hospital.longitud},${hospital.latitud}?overview=full&geometries=geojson`
    )
    const returnCoords: [number, number][] = returnData.data.routes[0].geometry.coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng]
    )

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

    setMissions(prev => [...prev, {
      id: missionId,
      ambulance: { ...ambulance, estado: 'en_ruta' },
      emergency,
      route: outboundCoords,
      currentIndex: 0,
      color: missionColor,
      emergenciaId: emergenciaRes.data.id,
      returning: false
    }])

    driveRoute(
      missionId,
      outboundCoords,
      async (position, index) => {
        setMissions(prev => prev.map(m => m.id === missionId ? { ...m, currentIndex: index } : m))
        await checkTrafficLights(position, outboundCoords.slice(index))
      },
      async () => {
        await axios.put(`http://localhost:3001/api/emergencias/${emergenciaRes.data.id}/atendida`)

        setMissions(prev => prev.map(m => m.id === missionId ? {
          ...m,
          route: returnCoords,
          currentIndex: 0,
          returning: true
        } : m))

        driveRoute(
          missionId,
          returnCoords,
          (_position, index) => {
            setMissions(prev => prev.map(m => m.id === missionId ? { ...m, currentIndex: index } : m))
          },
          async () => {
            await axios.put(`http://localhost:3001/api/ambulancias/${ambulance.id}`, {
              nombre: ambulance.nombre,
              placa: ambulance.placa,
              estado: 'libre'
            })
            setMissions(prev => prev.filter(m => m.id !== missionId))
          }
        )
      }
    )
  }

  const stopMission = (missionId: string) => {
    if (intervalsRef.current[missionId]) {
      clearInterval(intervalsRef.current[missionId])
      delete intervalsRef.current[missionId]
    }
    setMissions(prev => prev.filter(m => m.id !== missionId))
  }

    const stopAllMissions = async () => {
      Object.values(intervalsRef.current).forEach(clearInterval)
      intervalsRef.current = {}
    
      for (const mission of missions) {
        await axios.put(`http://localhost:3001/api/ambulancias/${mission.ambulance.id}`, {
          nombre: mission.ambulance.nombre,
          placa: mission.ambulance.placa,
          estado: 'libre'
        })
    
        if (!mission.returning) {
          await axios.put(`http://localhost:3001/api/emergencias/${mission.emergenciaId}/cancelar`)
        }
      }
  
      setMissions([])
    }

  return { missions, startMission, stopMission, stopAllMissions, getNearestAmbulance }
}