import { useState, useEffect } from 'react'
import axios from 'axios'
import { useGeocoding } from '../../hooks/useGeocoding'

interface Props {
  lat: number
  lng: number
  onClose: () => void
  onSuccess: () => void
}

const AddTrafficLightModal = ({ lat, lng, onClose, onSuccess }: Props) => {
  const [calle, setCalle] = useState('')
  const [tiempoVerde, setTiempoVerde] = useState(30)
  const [tiempoAmarillo, setTiempoAmarillo] = useState(5)
  const [tiempoRojo, setTiempoRojo] = useState(30)
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(true)
  const [isValid, setIsValid] = useState(false)
  const [estado, setEstado] = useState('rojo')
  const { getRoadName, isOnRoad } = useGeocoding()

  useEffect(() => {
    const validate = async () => {
      setValidating(true)
      const onRoad = await isOnRoad(lat, lng)
      if (onRoad) {
        const road = await getRoadName(lat, lng)
        setCalle(road || '')
        setIsValid(true)
      } else {
        setIsValid(false)
      }
      setValidating(false)
    }
    validate()
  }, [lat, lng])

  const handleSubmit = async () => {
    if (!calle) return
    setLoading(true)
    try {
    await axios.post('http://localhost:3001/api/semaforos', {
      latitud: lat,
      longitud: lng,
      calle,
      estado,
      tiempo_verde: tiempoVerde,
      tiempo_amarillo: tiempoAmarillo,
      tiempo_rojo: tiempoRojo
    })
      onSuccess()
      onClose()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="absolute inset-0 z-2000 flex items-center justify-center bg-black/50">
      <div className="bg-gray-800 rounded-lg p-6 w-80 text-white">
        <h2 className="text-lg font-bold mb-4">Agregar semaforo</h2>

        {validating ? (
          <p className="text-sm text-gray-400">Validando ubicacion...</p>
        ) : !isValid ? (
          <div>
            <p className="text-sm text-red-400 mb-4">Este punto no esta en una carretera. Por favor selecciona un punto sobre una calle.</p>
            <button onClick={onClose} className="w-full py-2 rounded bg-gray-700 text-sm">Cerrar</button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-sm text-gray-400">Calle detectada</label>
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
            <div>
              <label className="text-sm text-gray-400">Estado inicial</label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full mt-1 bg-gray-700 rounded px-3 py-2 text-sm"
              >
                <option value="rojo">Rojo</option>
                <option value="amarillo">Amarillo</option>
                <option value="verde">Verde</option>
              </select>
            </div>            
            <p className="text-xs text-gray-500">Coordenadas: {lat.toFixed(4)}, {lng.toFixed(4)}</p>
            <div className="flex gap-2 mt-2">
              <button onClick={onClose} className="flex-1 py-2 rounded bg-gray-700 text-sm">Cancelar</button>
              <button onClick={handleSubmit} disabled={loading} className="flex-1 py-2 rounded bg-red-600 text-sm font-bold">
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AddTrafficLightModal