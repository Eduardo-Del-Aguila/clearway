//HOOKS
import { useState } from 'react';
import { useTrafficLights } from '../hooks/useTraficLights';
import { useAmbulances } from '../hooks/useAmbulances'
import { useHospitals } from '../hooks/useHospitals'
import { MISSION_COLORS } from '../hooks/useMission'

//Modals
import AddHospitalModal from './modals/AddHospitalModal'
import AddTrafficLightModal from './modals/AddTrafficLightModal'
import EditTrafficLightModal from './modals/EditTrafficLightModal'
import EditHospitalModal from './modals/EditHospitalModal'
import HospitalDetailModal from './modals/HospitalDetailModal'

import { MapContainer, TileLayer, Marker, Tooltip, Polyline, Circle } from 'react-leaflet'
import L from 'leaflet'

import MapRightClickHandler from './MapRightClickHandler';
import ContextMenu from './ContextMenu';
import type { Ambulance, Hospital, Mission, Position } from '../types';

const ambulanceIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1048/1048313.png',
  iconSize: [40, 40],
  
})

const hospitalIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/619/619153.png',
  iconSize: [60, 60],
})

const emergencyIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1828/1828843.png',
  iconSize: [50, 50],
})

const getTrafficLightIcon = (estado: string, estadoEmergencia: string) => L.divIcon({
  className: '',
  html: `
    <div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
      <div style="width:20px;height:20px;border-radius:50%;
        background:${estado === 'verde' ? '#22c55e' : estado === 'amarillo' ? '#eab308' : '#ef4444'};
        border:2px solid white;"></div>
      <div style="width:25px;height:25px;border-radius:50%;
        background:${estadoEmergencia === 'verde' ? '#22c55e' : estadoEmergencia === 'rojo' ? '#ef4444' : '#6b7280'};
        border:2px solid white;font-size:14px;display:flex;align-items:center;justify-content:center;">🚑</div>
    </div>`,
  iconSize: [25, 50],
})

interface ContextMenuState {
  x: number
  y: number
  lat: number
  lng: number
}

interface Props {
  localStates: Record<number, string>
  emergencyStates: Record<number, string>
  counters: Record<number, number>
  isRunning: boolean
  missions: Mission[]
  startMission: (ambulance: Ambulance, emergency: Position, color: string, hospital: Hospital) => Promise<void>
  getNearestAmbulance: (emergency: Position, ambulances: Ambulance[]) => Ambulance | null
  protocolActive: boolean
}

const Map = ({ localStates, emergencyStates, counters, isRunning, missions, protocolActive, startMission, getNearestAmbulance }: Props) => {
  const { hospitals } = useHospitals()
  const { ambulances } = useAmbulances(hospitals.map(h => h.id))
  const { trafficLights } = useTrafficLights()

  const [missionColorIndex, setMissionColorIndex] = useState(0)
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null)
  const [showHospitalModal, setShowHospitalModal] = useState<{lat: number, lng: number} | null>(null)
  const [showTrafficLightModal, setShowTrafficLightModal] = useState<{lat: number, lng: number} | null>(null)
  const [hospitalDetail, setHospitalDetail] = useState<Hospital | null>(null)
  const [editTrafficLight, setEditTrafficLight] = useState<any | null>(null)
  const [editHospital, setEditHospital] = useState<Hospital | null>(null)

  const handleRightClick = (lat: number, lng: number, x: number, y: number) => {
    setContextMenu({ lat, lng, x, y })
  }

  const handleAddEmergency = async (lat: number, lng: number) => {
    if (!isRunning) {
      alert('Inicia la simulacion primero')
      return
    }
    const nearest = getNearestAmbulance({ lat, lng }, ambulances)
    if (!nearest) return
    const hospital = hospitals.find(h => h.id === nearest.hospital_id)
    if (!hospital) return
    const color = MISSION_COLORS[missionColorIndex % MISSION_COLORS.length]
    setMissionColorIndex(prev => prev + 1)
    await startMission(nearest, { lat, lng }, color, hospital)
  }

  const handleAddHospital = (lat: number, lng: number) => setShowHospitalModal({ lat, lng })
  const handleAddAmbulance = (_lat: number, _lng: number) => console.log('pendiente')
  const handleAddTrafficLight = (lat: number, lng: number) => setShowTrafficLightModal({ lat, lng })

  return (
    <div className="relative w-full h-full" onClick={() => setContextMenu(null)}>

      {/* Indicador de protocolo activo */}
      {protocolActive && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-1000 bg-red-600 text-white text-xs font-bold px-4 py-1 rounded-full">
          Protocolo de emergencia ACTIVO
        </div>
      )}

      <MapContainer center={[-12.0464, -77.0428]} zoom={13} className="w-full h-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="OpenStreetMap" />
        <MapRightClickHandler onRightClick={handleRightClick} />

        {trafficLights.map((tl) => (
          <Marker
            key={tl.id}
            position={[tl.latitud, tl.longitud]}
            icon={getTrafficLightIcon(
              localStates[tl.id] || tl.estado,
              emergencyStates[tl.id] || tl.estado_emergencia
            )}
            eventHandlers={{ click: () => setEditTrafficLight(tl) }}
          >
            <Tooltip>
              <div className='flex flex-col gap-1 p-1'>
                <span>{tl.calle}</span>
                <hr className='w-full' />
                <span>Estado: {localStates[tl.id] || tl.estado}</span>
                <span>Emergencia: {emergencyStates[tl.id] || tl.estado_emergencia}</span>
                <div className='flex w-full justify-around'>
                  <span>Rojo: {tl.tiempo_rojo}s</span>
                  <span>Verde: {tl.tiempo_verde}s</span>
                </div>
                {counters[tl.id] !== undefined && (
                  <span className='text-center font-bold text-yellow-400'>Cambia en: {counters[tl.id]}s</span>
                )}
              </div>
            </Tooltip>
          </Marker>
        ))}

        {hospitals.map((hospital) => (
          <Marker
            key={hospital.id}
            position={[hospital.latitud, hospital.longitud]}
            icon={hospitalIcon}
            eventHandlers={{
              click: () => setSelectedHospital(selectedHospital?.id === hospital.id ? null : hospital),
              dblclick: () => setHospitalDetail(hospital)
            }}
          >
            <Tooltip>{hospital.nombre}</Tooltip>
          </Marker>
        ))}

        {selectedHospital && (
          <Circle
            center={[selectedHospital.latitud, selectedHospital.longitud]}
            radius={500}
            pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.1 }}
          />
        )}

        {missions.map((mission) => (
          <>
            <Marker
              key={`amb_${mission.id}`}
              position={mission.route[mission.currentIndex] || [mission.ambulance.latitud, mission.ambulance.longitud]}
              icon={ambulanceIcon}
            >
              <Tooltip>{mission.ambulance.nombre} — {mission.returning ? 'regresando' : 'en mision'}</Tooltip>
            </Marker>

            <Polyline
              key={`route_${mission.id}`}
              positions={mission.route}
              color={mission.color}
              weight={4}
            />

            <Marker
              key={`emerg_${mission.id}`}
              position={[mission.emergency.lat, mission.emergency.lng]}
              icon={emergencyIcon}
            >
              <Tooltip>Emergencia — {mission.ambulance.nombre}</Tooltip>
            </Marker>
          </>
        ))}

        {ambulances
          .filter(amb => !missions.find(m => m.ambulance.id === amb.id))
          .map(amb => amb.latitud && amb.longitud ? (
            <Marker key={amb.id} position={[amb.latitud, amb.longitud]} icon={ambulanceIcon}>
              <Tooltip>{amb.nombre} — {amb.estado}</Tooltip>
            </Marker>
          ) : null)
        }
      </MapContainer>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          lat={contextMenu.lat}
          lng={contextMenu.lng}
          onAddHospital={handleAddHospital}
          onAddAmbulance={handleAddAmbulance}
          onAddTrafficLight={handleAddTrafficLight}
          onAddEmergency={handleAddEmergency}
          onClose={() => setContextMenu(null)}
        />
      )}

      {hospitalDetail && (
        <HospitalDetailModal
          hospital={hospitalDetail}
          onClose={() => setHospitalDetail(null)}
          onEdit={() => { setEditHospital(hospitalDetail); setHospitalDetail(null) }}
        />
      )}

      {showHospitalModal && (
        <AddHospitalModal
          lat={showHospitalModal.lat}
          lng={showHospitalModal.lng}
          onClose={() => setShowHospitalModal(null)}
          onSuccess={() => setShowHospitalModal(null)}
          existingHospitals={hospitals}
        />
      )}

      {showTrafficLightModal && (
        <AddTrafficLightModal
          lat={showTrafficLightModal.lat}
          lng={showTrafficLightModal.lng}
          onClose={() => setShowTrafficLightModal(null)}
          onSuccess={() => setShowTrafficLightModal(null)}
        />
      )}

      {editTrafficLight && (
        <EditTrafficLightModal
          trafficLight={editTrafficLight}
          onClose={() => setEditTrafficLight(null)}
          onSuccess={() => setEditTrafficLight(null)}
        />
      )}

      {editHospital && (
        <EditHospitalModal
          hospital={editHospital}
          onClose={() => setEditHospital(null)}
          onSuccess={() => setEditHospital(null)}
        />
      )}
    </div>
  )
}

export default Map