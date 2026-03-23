
//HOOKS
import { useState } from 'react';
import { useRoute } from '../hooks/useRoute';
import { useSocket } from '../hooks/useSocket'
import { useTrafficLights } from '../hooks/useTraficLights';
import { useHospitals } from '../hooks/useHospitals'
//Modals
import AddHospitalModal from './modals/AddHospitalModal'
import AddTrafficLightModal from './modals/AddTrafficLightModal'
import EditTrafficLightModal from './modals/EditTrafficLightModal'
import EditHospitalModal from './modals/EditHospitalModal'
import HospitalDetailModal from './modals/HospitalDetailModal'

//Mi fiel amigo leaflet
import { MapContainer, TileLayer, Marker, Tooltip, Polyline, Circle } from 'react-leaflet'
import L from 'leaflet'

//componentes
// import MapClickHandler from './MapClickHandler';
import MapRightClickHandler from './MapRightClickHandler';
import ContextMenu from './ContextMenu';
import type { Emergency, Hospital } from '../types';

// Ambulancia Eduardo-SAC
const ambulanceIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1048/1048313.png',
    iconSize: [40, 40],
})

const hospitalIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/619/619153.png',
  iconSize: [36, 36],
})

// merry chismas
const emergencyIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1828/1828843.png',
    iconSize: [36, 36],
})



// funcionaaaa
const getTrafficLightIcon = (estado: string, estadoEmergencia: string) => L.divIcon({
  className: '',
  html: `
    <div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
      <div style="
        width:20px;height:20px;border-radius:50%;
        background:${estado === 'verde' ? '#22c55e' : estado === 'amarillo' ? '#eab308' : '#ef4444'};
        border:2px solid white;
      "></div>
      <div style="
        width:25px;height:25px;border-radius:50%;
        background:${estadoEmergencia === 'verde' ? '#22c55e' : estadoEmergencia === 'rojo' ? '#ef4444' : '#6b7280'};
        border:2px solid white;font-size:14px;
        display:flex;align-items:center;justify-content:center;
      ">🚑</div>
    </div>
  `,
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
  counters: Record<number, number>
}

const raidusCircle = 1500

const Map = ({ localStates, counters }: Props) => {
    // hooks personalizados
    const { hospitals } = useHospitals()
    const { position } = useSocket()
    const { trafficLights } = useTrafficLights()
    const { routeCoords, calculateRoute } = useRoute()
    // hooks normales
    const [emergency, setEmergency] = useState<Emergency | null>(null)
    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)
    //Mis modales
    const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null)
    const [showHospitalModal, setShowHospitalModal] = useState<{lat: number, lng: number} | null>(null)
    const [showTrafficLightModal, setShowTrafficLightModal] = useState<{lat: number, lng: number} | null>(null)
    const [hospitalDetail, setHospitalDetail] = useState<Hospital | null>(null)
    //Modals EDITACION
    const [editTrafficLight, setEditTrafficLight] = useState<any | null>(null)
    const [editHospital, setEditHospital] = useState<Hospital | null>(null)
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if(e.key == 'Enter'){
        setContextMenu(null);
      }
    }


    // const handleMapClick = (lat: number, lng: number) => {setEmergency({lat, lng}) if (position) { calculateRoute({ lat: position.latitude, lng: position.longitude }, { lat, lng })}}
  const handleRightClick = (lat: number, lng: number, x: number, y: number) => {
    setContextMenu({ lat, lng, x, y })
  }
  const handleAddEmergency = (lat: number, lng: number) => {
    setEmergency({ lat, lng })
    if (position) {
      calculateRoute(
        { lat: position.latitud, lng: position.longitud },
        { lat, lng }
      )
    }
  }

  //Funciones para aniadir elementos deseados
  const handleAddHospital = (lat: number, lng: number) => {
    setShowHospitalModal({ lat, lng })
  }

  const handleAddAmbulance = (lat: number, lng: number) => {
    console.log('Agregar ambulancia en:', lat, lng)
  }

  const handleAddTrafficLight = (lat: number, lng: number) => {
    setShowTrafficLightModal({ lat, lng })
  }

    return (
        //MapContainer mi caballo ganador
        // MapContainer: el contenedor principal del mapa, centrado en Lima
      <div className="relative w-full h-full"
        onKeyDown={handleKeyDown}
        onClick={ () => setContextMenu(null)}
      >
        <MapContainer
          center={[-12.0464, -77.0428]}
          zoom={13}
          className="w-full h-full"
          
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="OpenStreetMap"
          />
            {/* <MapClickHandler onMapClick={handleMapClick} /> */}

            <MapRightClickHandler onRightClick={handleRightClick}/>

            {/* INICIO SECCION DE AMBULANCIA */}
            {position && (
              <Marker
                position={[position.latitud, position.longitud]}
                icon={ambulanceIcon}
              >
                <Tooltip>Ambulancia A-01</Tooltip>
              </Marker>
            )}
            {/* INICIO DE PUNTO DE EMERGENCIA */}
            {emergency && (
              <Marker
                position={[emergency.lat, emergency.lng]}
                icon={emergencyIcon}
              >
                <Tooltip>Punto de emergencia</Tooltip>
              </Marker>
            )}

            {/* FIN DE PUNTO DE EMERGENCIA */}

            {trafficLights.map((tl) => (
              <Marker
                key={tl.id}
                position={[tl.latitud, tl.longitud]}
                icon={getTrafficLightIcon(localStates[tl.id] || tl.estado, tl.estado_emergencia)}
                eventHandlers={{ click: () => setEditTrafficLight(tl) }}
              >
              <Tooltip>
                <div className='flex flex-col gap-1 p-1'>
                  <span>{tl.calle}</span>
                  <hr className='w-full'/>
                  <span>Estado: {localStates[tl.id] || tl.estado}</span>
                  <span>Estado de <span className='text-red-400'>emergencia</span>: {tl.estado_emergencia}</span>
                  <hr className='w-full'/>
                  <div className='flex w-full justify-around'>
                    <span>Luz roja: {tl.tiempo_rojo}s</span>
                    <span>Luz verde: {tl.tiempo_verde}s</span>
                  </div>
                  {counters[tl.id] !== undefined && (
                    <span className='text-center font-bold text-yellow-400'>
                      Cambia en: {counters[tl.id]}s
                    </span>
                  )}
                </div>
              </Tooltip>
              </Marker>
            ))}
            {routeCoords.length > 0 && (
              <Polyline
                positions={routeCoords}
                color="#ef4444"
                weight={4}
              />
            )}
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
          {editHospital && (
            <EditHospitalModal
              hospital={editHospital}
              onClose={() => setEditHospital(null)}
              onSuccess={() => setEditHospital(null)}
            />
          )}

          {selectedHospital && (
            <Circle
              center={[selectedHospital.latitud, selectedHospital.longitud]}
              radius={raidusCircle}
              pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.1 }}
            />
          )}

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


        {/* INICIO DE MODALES */}
        {/* MODAL HOSPITAL */}
        {hospitalDetail && (
        <HospitalDetailModal
            hospital={hospitalDetail}
            onClose={() => setHospitalDetail(null)}
            onEdit={() => {
              setEditHospital(hospitalDetail)
              setHospitalDetail(null)
            }}
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
        {/* MODAL SEMAFOROS */}
        {showTrafficLightModal && (
          <AddTrafficLightModal
            lat={showTrafficLightModal.lat}
            lng={showTrafficLightModal.lng}
            onClose={() => setShowTrafficLightModal(null)}
            onSuccess={() => console.log('Semaforo agregado')}
          />
        )}
        {/* MODAL EDICION DE SEMAFORS */}
        {editTrafficLight && (
          <EditTrafficLightModal
            trafficLight={editTrafficLight}
            onClose={() => setEditTrafficLight(null)}
            onSuccess={() => setEditTrafficLight(null)}
          />
        )}
        {/* FIN DE MODALES */}
        </div>
    )
}

export default Map