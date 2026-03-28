import { useState } from 'react'
import axios from 'axios'
import type { TrafficLight } from '../../types'


interface Props {
  trafficLight: TrafficLight
  onClose: () => void
  onSuccess: () => void
}

const EditTrafficLightModal = ({ trafficLight, onClose, onSuccess }: Props) => {
  const [calle, setCalle] = useState(trafficLight.calle)
  const [tiempoVerde, setTiempoVerde] = useState(trafficLight.tiempo_verde)
  const [tiempoAmarillo, setTiempoAmarillo] = useState(trafficLight.tiempo_amarillo)
  const [tiempoRojo, setTiempoRojo] = useState(trafficLight.tiempo_rojo)
  const [loading, setLoading] = useState(false)
  const [estado, setEstado] = useState(trafficLight.estado)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await axios.put(`http://localhost:3001/api/semaforos/${trafficLight.id}`, {
        calle,
        tiempo_verde: tiempoVerde,
        tiempo_amarillo: tiempoAmarillo,
        tiempo_rojo: tiempoRojo,
        estado
      })
      onSuccess()
      onClose()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Estas seguro de eliminar este semaforo?')) return
    try {
      await axios.delete(`http://localhost:3001/api/semaforos/${trafficLight.id}`)
      onSuccess()
      onClose()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="absolute inset-0 z-2000 flex items-center justify-center bg-black/50">
      <div className="bg-gray-800 rounded-lg p-6 w-80 text-white">
        <h2 className="text-lg font-bold mb-4">Editar semaforo</h2>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-sm text-gray-400">Calle</label>
            <input
              type="text"
              value={calle}
              onChange={(e) => setCalle(e.target.value)}
              className="w-full mt-1 bg-gray-700 rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Tiempo en verde (seg)</label>
            <input type="number" value={tiempoVerde} onChange={(e) => setTiempoVerde(Number(e.target.value))} className="w-full mt-1 bg-gray-700 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm text-gray-400">Tiempo en amarillo (seg)</label>
            <input type="number" value={tiempoAmarillo} onChange={(e) => setTiempoAmarillo(Number(e.target.value))} className="w-full mt-1 bg-gray-700 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm text-gray-400">Tiempo en rojo (seg)</label>
            <input type="number" value={tiempoRojo} onChange={(e) => setTiempoRojo(Number(e.target.value))} className="w-full mt-1 bg-gray-700 rounded px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-400">Estado</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full mt-1 bg-gray-700 rounded px-3 py-2 text-sm"
          >
            <option value="rojo">Rojo</option>
            <option value="verde">Verde</option>
          </select>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleDelete} className="py-2 px-3 rounded bg-red-900 text-sm">Eliminar</button>
          <button onClick={onClose} className="flex-1 py-2 rounded bg-gray-700 text-sm">Cancelar</button>
          <button onClick={handleSubmit} disabled={loading} className="flex-1 py-2 rounded bg-red-600 text-sm font-bold">
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditTrafficLightModal