import Map from '../components/Map'
import { useTrafficLights } from '../hooks/useTraficLights'
import { useSimulation } from '../hooks/useSimulation'
import { useHospitals } from '../hooks/useHospitals'
import { useAmbulances } from '../hooks/useAmbulances'

const Dashboard = () => {
  const { trafficLights } = useTrafficLights()
  const { hospitals } = useHospitals()
  const { ambulances } = useAmbulances(hospitals.map(h => h.id))
  const { isRunning, localStates, counters, startSimulation, stopSimulation } = useSimulation(trafficLights)

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-64 bg-gray-800 p-4 flex flex-col gap-4 overflow-y-auto">
        <div>
          <h1 className="text-xl font-bold text-red-500">ClearWay</h1>
          <p className="text-gray-400 text-sm">Central SAMU</p>
        </div>

        <button
          onClick={isRunning ? stopSimulation : startSimulation}
          className={`py-2 px-4 rounded font-bold text-sm ${isRunning ? 'bg-gray-600' : 'bg-red-600'}`}
        >
          {isRunning ? 'Detener simulacion' : 'Iniciar simulacion'}
        </button>

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

      <div className="flex-1">
        <Map localStates={localStates} counters={counters} isRunning={isRunning} />
      </div>

      <div className="w-64 bg-gray-800 p-4">
        <h2 className="text-lg font-bold mb-4">Emergencia activa</h2>
        <p className="text-gray-400 text-sm">Sin emergencias</p>
      </div>
    </div>
  )
}

export default Dashboard