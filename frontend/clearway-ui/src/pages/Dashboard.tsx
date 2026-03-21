import Map from '../components/Map'
import { useTrafficLights } from '../hooks/useTraficLights'
import { useSimulation } from '../hooks/useSimulation'

const Dashboard = () => {
  const { trafficLights } = useTrafficLights()
  const { isRunning, localStates, counters, startSimulation, stopSimulation } = useSimulation(trafficLights)

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-64 bg-gray-800 p-4 flex flex-col gap-4">
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
          <p className="text-sm text-gray-400 mb-2">Semaforos activos: {trafficLights.length}</p>
          {trafficLights.map(tl => (
            <div key={tl.id} className="flex items-center gap-2 mb-1">
              <div className={`w-3 h-3 rounded-full ${
                (localStates[tl.id] || tl.estado) === 'verde' ? 'bg-green-500' :
                (localStates[tl.id] || tl.estado) === 'amarillo' ? 'bg-yellow-400' : 'bg-red-500'
              }`} />
              <span className="text-xs text-gray-300 truncate">{tl.calle}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <Map localStates={localStates} counters={counters} />
      </div>

      <div className="w-64 bg-gray-800 p-4">
        <h2 className="text-lg font-bold mb-4">Emergencia activa</h2>
        <p className="text-gray-400 text-sm">Sin emergencias</p>
      </div>
    </div>
  )
}

export default Dashboard