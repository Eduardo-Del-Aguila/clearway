
//HOOKS
import { useState } from 'react';
import { useRoute } from '../hooks/useRoute';
import { useSocket } from '../hooks/useSocket'
import { useTrafficLights } from '../hooks/useTraficLights';

//Modals
import AddHospitalModal from './modals/AddHospitalModal'
import AddTrafficLightModal from './modals/AddTrafficLightModal'
import EditTrafficLightModal from './modals/EditTrafficLightModal'

//Mi fiel amigo leaflet
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet'
import L from 'leaflet'

//componentes
// import MapClickHandler from './MapClickHandler';
import MapRightClickHandler from './MapRightClickHandler';
import ContextMenu from './ContextMenu';

// Ambulancia Eduardo-SAC
const ambulanceIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1048/1048313.png',
    iconSize: [40, 40],
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
    <div style="display: flex; flex-direction: column; align-items: center; gap: 2px;">
      <div style="
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: ${estado === 'verde' ? '#22c55e' : estado === 'amarillo' ? '#eab308' : '#ef4444'};
        border: 2px solid white;
      "></div>
      ${estadoEmergencia !== 'apagado' ? `
        <div style="
          width: 25px;
          height: 25px;
          border-radius: 50%;
          background: ${estadoEmergencia === 'verde' ? '#22c55e' : '#ef4444'};
          border: 2px solid white;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">🚑</div>
      ` : ''}
    </div>
  `,
  iconSize: [20, 40],
})

interface Emergency {
  lat: number
  lng: number
}

interface ContextMenuState {
  x: number
  y: number
  lat: number
  lng: number
}


const Map = () => {
    //Obtenemos la posicion en tiempo real via Socket.io
    const { position } = useSocket()
    const { trafficLights } = useTrafficLights()
    const { routeCoords, calculateRoute } = useRoute()
    const [emergency, setEmergency] = useState<Emergency | null>(null)
    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)
    //Mis modales
    const [showHospitalModal, setShowHospitalModal] = useState<{lat: number, lng: number} | null>(null)
    const [showTrafficLightModal, setShowTrafficLightModal] = useState<{lat: number, lng: number} | null>(null)
    const [editTrafficLight, setEditTrafficLight] = useState<any | null>(null)
    
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
                icon={getTrafficLightIcon(tl.estado, tl.estado_emergencia)}
                eventHandlers={{ click: () => setEditTrafficLight(tl) }}
              >
                <Tooltip>
                  <div className='flex flex-col gap-1 p-1'>
                    <span>{tl.calle}</span>
                    <hr className='w-full'/>
                    <span>Estado: {tl.estado}</span>
                    <span>Estado de <span className='text-red-400'>emergencia</span>: {tl.estado_emergencia}</span>
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
        {showHospitalModal && (
          <AddHospitalModal
            lat={showHospitalModal.lat}
            lng={showHospitalModal.lng}
            onClose={() => setShowHospitalModal(null)}
            onSuccess={() => console.log('Hospital agregado')}
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