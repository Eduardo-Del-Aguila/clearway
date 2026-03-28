import Map from '../components/Map'
import { useTrafficLights } from '../hooks/useTraficLights'
import { useSimulation } from '../hooks/useSimulation'
import { useHospitals } from '../hooks/useHospitals'
import { useAmbulances } from '../hooks/useAmbulances'
import { useMission } from '../hooks/useMission'
import { useState } from 'react'

const Dashboard = () => {
  const { trafficLights } = useTrafficLights()
  const { hospitals } = useHospitals()
  const { ambulances } = useAmbulances(hospitals.map(h => h.id))
  const { isRunning, localStates, counters, startSimulation, stopSimulation } = useSimulation(trafficLights)
  const [protocolActive, setProtocolActive] = useState(false)
  const { missions, emergencyStates, stopAllMissions, startMission, getNearestAmbulance,  } = useMission(trafficLights, isRunning, protocolActive)
  
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-64 bg-gray-800 p-4 flex flex-col gap-4 overflow-y-auto">
        <div>
          <h1 className="text-xl font-bold text-red-500">ClearWay</h1>
          <p className="text-gray-400 text-sm">Central SAMU</p>
        </div>

        <button
          onClick={isRunning ? () => { stopSimulation(); stopAllMissions() } : startSimulation}
          className={`py-2 px-4 rounded font-bold text-sm ${isRunning ? 'bg-gray-600' : 'bg-red-600'}`}
        >
          {isRunning ? 'Detener simulacion' : 'Iniciar simulacion'}
        </button>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Protocolo emergencia</span>
          <button
            onClick={() => setProtocolActive(prev => !prev)}
            className={`relative w-12 h-6 rounded-full transition-colors ${protocolActive ? 'bg-red-600' : 'bg-gray-600'}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${protocolActive ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
        
        <div>
          <p className="text-sm text-gray-400 mb-2">Semaforos: {trafficLights.length}</p>
          {trafficLights.map(tl => (
            <div key={tl.id} className="flex items-center gap-2 mb-1">
              <div className={`w-3 h-3 rounded-full shrink-0 ${
                (localStates[tl.id] || tl.estado) === 'verde' ? 'bg-green-500' :
                (localStates[tl.id] || tl.estado) === 'amarillo' ? 'bg-yellow-400' : 'bg-red-500'
              }`} />
              <span className="text-xs text-gray-300 truncate">{tl.calle}</span>
            </div>
          ))}
        </div>

        <div>
          <p className="text-sm text-gray-400 mb-2">Hospitales: {hospitals.length}</p>
          {hospitals.map(hospital => {
            const hospitalAmbulances = ambulances.filter(a => a.hospital_id === hospital.id)
            return (
              <div key={hospital.id} className="mb-3 bg-gray-700 rounded p-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
                  <span className="text-xs font-bold text-white truncate">{hospital.nombre}</span>
                </div>
                {hospitalAmbulances.length === 0 ? (
                  <p className="text-xs text-gray-500 ml-5">Sin ambulancias</p>
                ) : (
                  hospitalAmbulances.map(amb => (
                    <div key={amb.id} className="flex items-center justify-between ml-5 mb-1">
                      <span className="text-xs text-gray-300">{amb.nombre}</span>
                      <span className={`text-xs px-1 rounded ${amb.estado === 'libre' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                        {amb.estado}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden"> 

        <div className='absolute top-0 left-0 w-full z-1000'>
          <div className='relative group h-20 flex justify-center items-center'>

            <div className="flex h-10 justify-center items-center absolute z-1100 bg-red-600/60 group-hover:bg-red-600 
                            rounded-lg backdrop-blur-sm
                            transition-all duration-500 ease-in-out
                            w-10 group-hover:w-[70%] "> 
                            <span className='text-center group-hover:hidden'>...</span>
              <ul className="hidden group-hover:flex gap-4 p-4 items-center justify-center w-full">
                <li className="cursor-pointer hover:text-red-400">Opcióni</li>
                <li className="cursor-pointer hover:text-red-400">Opcióni</li>
                <li className="cursor-pointer hover:text-red-400">Opcióni</li>
              </ul> 
            </div>

          </div>
        </div>
        <Map 
          localStates={localStates} 
          emergencyStates={emergencyStates}
          counters={counters} 
          isRunning={isRunning}
          missions={missions}
          startMission={startMission}
          getNearestAmbulance={getNearestAmbulance}
          protocolActive={protocolActive}
        />  
      </div>

      <div className="flex flex-col w-64 bg-gray-800 p-4">
        <h2 className="text-lg font-bold mb-4">Emergencia activa</h2>
        <p className="text-gray-400 text-sm">Sin emergencias</p>
      </div>
    </div>
  )
}

export default Dashboard