import { useState } from 'react'
import axios from 'axios'
import type { Hospital } from '../../types'

interface Props {
  lat: number
  lng: number
  onClose: () => void
  onSuccess: () => void
  existingHospitals: Hospital[]
}

const radiusCircle = 500
const API_URL = import.meta.env.VITE_URL_API


const AddHospitalModal = ({ lat, lng, onClose, onSuccess, existingHospitals }: Props) => {
  const [nombre, setNombre] = useState('')
  const [capacidad, setCapacidad] = useState(3)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!nombre) return
    setLoading(true)
    const tooClose = existingHospitals.some(h => {
      const R = 6371000
      const dLat = (h.latitud - lat) * Math.PI / 180
      const dLng = (h.longitud - lng) * Math.PI / 180
      const a = Math.sin(dLat/2) ** 2 + Math.cos(lat * Math.PI / 180) * Math.cos(h.latitud * Math.PI / 180) * Math.sin(dLng/2) ** 2
      const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      return distance < radiusCircle
    })

    if (tooClose) {
      alert('Ya existe un hospital a menos de 500 metros de este punto')
      return
    }

    try {
      await axios.post(`${API_URL}/hospitales`, {
        nombre,
        latitud: lat,
        longitud: lng,
        capacidad_ambulancias: capacidad
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
        <h2 className="text-lg font-bold mb-4">Agregar hospital</h2>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-sm text-gray-400">Nombre del hospital</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full mt-1 bg-gray-700 rounded px-3 py-2 text-sm"
              placeholder="Ej: Hospital Rebagliati"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Capacidad de ambulancias</label>
            <input
              type="number"
              value={capacidad}
              onChange={(e) => setCapacidad(Number(e.target.value))}
              min={1}
              max={3}
              className="w-full mt-1 bg-gray-700 rounded px-3 py-2 text-sm"
            />
          </div>
          <p className="text-xs text-gray-500">Coordenadas: {lat.toFixed(4)}, {lng.toFixed(4)}</p>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 py-2 rounded bg-gray-700 text-sm">Cancelar</button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2 rounded bg-red-600 text-sm font-bold"
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddHospitalModal