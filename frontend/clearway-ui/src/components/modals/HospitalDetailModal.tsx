import { useState, useEffect } from 'react'
import axios from 'axios'
import type { Hospital } from '../../types'


interface Ambulance {
  id: number
  nombre: string
  placa: string
  estado: string
  hospital_id: number
}

interface Props {
  hospital: Hospital
  onClose: () => void
  onEdit: () => void
}

const HospitalDetailModal = ({ hospital, onClose, onEdit }: Props) => {
    const [ambulances, setAmbulances] = useState<Ambulance[]>([])
    const [showAddForm, setShowAddForm] = useState(false)
    const [nombre, setNombre] = useState('')
    const [placa, setPlaca] = useState('')
    const [loading, setLoading] = useState(false)

    const [editingAmbulance, setEditingAmbulance] = useState<Ambulance | null>(null)
    const [editNombre, setEditNombre] = useState('')
    const [editPlaca, setEditPlaca] = useState('')
    const [editEstado, setEditEstado] = useState('')

    const fetchAmbulances = async () => {
      const { data } = await axios.get(`http://localhost:3001/api/ambulancias/hospital/${hospital.id}`)
      console.log('funcioanandoDetail');
      setAmbulances(data)
    }

    useEffect(() => {
      fetchAmbulances()
    }, [hospital.id])
    
    //CRUD AMBULANCIAS
    const handleEditAmbulance = async (id: number) => {
      try {
        await axios.put(`http://localhost:3001/api/ambulancias/${id}`, {
          nombre: editNombre,
          placa: editPlaca,
          estado: editEstado
        })
        setEditingAmbulance(null)
        fetchAmbulances()
      } catch (error) {
        console.error(error)
      }
    }
    const handleDeleteAmbulance = async (id: number) => {
      if (!confirm('Estas seguro de eliminar esta ambulancia?')) return
      try {
        await axios.delete(`http://localhost:3001/api/ambulancias/${id}`)
        fetchAmbulances()
      } catch (error) {
        console.error(error)
      }
    }
    const handleAddAmbulance = async () => {
      if (!nombre || !placa) return
      if (ambulances.length >= hospital.capacidad_ambulancias) {
        alert(`Este hospital ya tiene el maximo de ${hospital.capacidad_ambulancias} ambulancias`)
        return
      }

      setLoading(true)
      try {
        await axios.post('http://localhost:3001/api/ambulancias', {
          nombre,
          placa,
          hospital_id: hospital.id,
          latitud: hospital.latitud,
          longitud: hospital.longitud
        })
        setNombre('')
        setPlaca('')
        setShowAddForm(false)
        fetchAmbulances()
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    return (
      <div className="absolute inset-0 z-2000 flex items-center justify-center bg-black/50">
        <div className="bg-gray-800 rounded-lg p-6 w-96 text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{hospital.nombre}</h2>
            <button onClick={onEdit} className="text-xs text-gray-400 hover:text-white">Editar</button>
          </div>

          <p className="text-sm text-gray-400 mb-4">
            Capacidad: {ambulances.length}/{hospital.capacidad_ambulancias} ambulancias
          </p>

          <div className="flex flex-col gap-2 mb-4">
            {ambulances.length === 0 && (
              <p className="text-sm text-gray-500">No hay ambulancias registradas</p>
            )}
            {ambulances.map(amb => (
              <div key={amb.id} className="bg-gray-700 rounded px-3 py-2">
                {editingAmbulance?.id === amb.id ? (
                  <div className="flex flex-col gap-2">
                    <input value={editNombre} onChange={(e) => setEditNombre(e.target.value)} className="bg-gray-600 rounded px-2 py-1 text-sm" />
                    <input value={editPlaca} onChange={(e) => setEditPlaca(e.target.value)} className="bg-gray-600 rounded px-2 py-1 text-sm" />
                    <select value={editEstado} onChange={(e) => setEditEstado(e.target.value)} className="bg-gray-600 rounded px-2 py-1 text-sm">
                      <option value="libre">Libre</option>
                      <option value="inactiva">Inactiva</option>
                    </select>
                    <div className="flex gap-2">
                      <button onClick={() => handleDeleteAmbulance(amb.id)} className="py-1 px-2 rounded bg-red-900 text-xs">Eliminar</button>
                      <button onClick={() => setEditingAmbulance(null)} className="flex-1 py-1 rounded bg-gray-600 text-xs">Cancelar</button>
                      <button onClick={() => handleEditAmbulance(amb.id)} className="flex-1 py-1 rounded bg-red-600 text-xs font-bold">Guardar</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold">{amb.nombre}</p>
                      <p className="text-xs text-gray-400">{amb.placa}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${amb.estado === 'libre' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                        {amb.estado}
                      </span>
                      <button onClick={() => {
                        setEditingAmbulance(amb)
                        setEditNombre(amb.nombre)
                        setEditPlaca(amb.placa)
                        setEditEstado(amb.estado)
                      }} className="text-xs text-gray-400 hover:text-white">Editar</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {showAddForm ? (
            <div className="flex flex-col gap-2 mb-4">
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre ej: Ambulancia A-01"
                className="bg-gray-700 rounded px-3 py-2 text-sm"
              />
              <input
                type="text"
                value={placa}
                onChange={(e) => setPlaca(e.target.value)}
                placeholder="Placa ej: ABC-123"
                className="bg-gray-700 rounded px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <button onClick={() => setShowAddForm(false)} className="flex-1 py-2 rounded bg-gray-700 text-sm">Cancelar</button>
                <button onClick={handleAddAmbulance} disabled={loading} className="flex-1 py-2 rounded bg-red-600 text-sm font-bold">
                  {loading ? 'Guardando...' : 'Agregar'}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-2 rounded bg-gray-700 text-sm mb-4"
            >
              + Agregar ambulancia
            </button>
          )}

          <button onClick={onClose} className="w-full py-2 rounded bg-gray-600 text-sm">Cerrar</button>
        </div>
      </div>
    )
}   

export default HospitalDetailModal