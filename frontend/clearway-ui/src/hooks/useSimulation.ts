import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import type { TrafficLight } from '../types'

export const useSimulation = (trafficLights: TrafficLight[]) => {
  const [isRunning, setIsRunning] = useState(false)
  const [localStates, setLocalStates] = useState<Record<number, string>>({})
  const [counters, setCounters] = useState<Record<number, number>>({})
  const timeoutsRef = useRef<Record<number, ReturnType<typeof setTimeout>>>({})
  const intervalsRef = useRef<Record<number, ReturnType<typeof setInterval>>>({})

  const startCycle = (tl: TrafficLight) => {
    const durations: Record<string, number> = {
      verde: tl.tiempo_verde,
      amarillo: tl.tiempo_amarillo,
      rojo: tl.tiempo_rojo,
    }

    const nextState: Record<string, string> = {
      verde: 'amarillo',
      amarillo: 'rojo',
      rojo: 'verde',
    }

    const tick = (currentState: string) => {
      setLocalStates(prev => ({ ...prev, [tl.id]: currentState }))
      
      let remaining = durations[currentState]
      setCounters(prev => ({ ...prev, [tl.id]: remaining }))

      if (intervalsRef.current[tl.id]) clearInterval(intervalsRef.current[tl.id])
      
      intervalsRef.current[tl.id] = setInterval(() => {
        remaining--
        setCounters(prev => ({ ...prev, [tl.id]: remaining }))
        if (remaining <= 0) clearInterval(intervalsRef.current[tl.id])
      }, 1000)

      axios.put(`http://localhost:3001/api/semaforos/${tl.id}`, {
        calle: tl.calle,
        tiempo_verde: tl.tiempo_verde,
        tiempo_amarillo: tl.tiempo_amarillo,
        tiempo_rojo: tl.tiempo_rojo,
        estado: currentState
      })

      const next = nextState[currentState]
      timeoutsRef.current[tl.id] = setTimeout(() => tick(next), durations[currentState] * 1000)
    }

    tick(tl.estado)
  }

  const startSimulation = () => {
    setIsRunning(true)
    trafficLights.forEach(tl => startCycle(tl))
  }

  const stopSimulation = () => {
    setIsRunning(false)
    Object.values(timeoutsRef.current).forEach(clearTimeout)
    Object.values(intervalsRef.current).forEach(clearInterval)
    timeoutsRef.current = {}
    intervalsRef.current = {}
    setLocalStates({})
    setCounters({})
  }

  useEffect(() => {
    return () => stopSimulation()
  }, [])

  return { isRunning, localStates, counters, startSimulation, stopSimulation }
}