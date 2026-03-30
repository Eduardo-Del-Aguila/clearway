import { useState } from 'react'
import axios from 'axios'
import type { Hospital } from '../../types'

interface Props {
  hospital: Hospital
  onClose: () => void
  onSuccess: () => void
}

const EditHospitalModal = ({ hospital, onClose, onSuccess }: Props) => {
  const [nombre, setNombre] = useState(hospital.nombre)
  const [capacidad, setCapacidad] = useState(hospital.capacidad_ambulancias)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await axios.put(`${API_URL}/hospitales/${hospital.id}`, {
        nombre,
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

  const handleDelete = async () => {
    if (!confirm('Estas seguro de eliminar este hospital?')) return
    try {
      await axios.delete(`${API_URL}/hospitales/${hospital.id}`)
      onSuccess()
      onClose()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="absolute inset-0 z-2000 flex items-center justify-center bg-black/50">
      <div className="bg-gray-800 rounded-lg p-6 w-80 text-white">
        <h2 className="text-lg font-bold mb-4">Editar hospital</h2>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-sm text-gray-400">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full mt-1 bg-gray-700 rounded px-3 py-2 text-sm"
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
        </div>
        <div className='pt-4'>
            <p>Coordenadas: <span> "{ hospital.latitud}"  -  "{hospital.longitud}" </span></p>
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

export default EditHospitalModal