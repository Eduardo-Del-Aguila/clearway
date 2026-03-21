import { useState } from 'react';
import { useRoute } from '../hooks/useRoute';

import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet'
import { useSocket } from '../hooks/useSocket'
import { useTrafficLights } from '../hooks/useTraficLights';
import MapClickHandler from './MapClickHandler';
import L from 'leaflet'

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


const Map = () => {
    //Obtenemos la posicion en tiempo real via Socket.io
    const { position } = useSocket()
    const { trafficLights } = useTrafficLights()
    const { routeCoords, calculateRoute } = useRoute()

    const [emergency, setEmergency] = useState<Emergency | null>(null)

    const handleMapClick = (lat: number, lng: number) => {
        setEmergency({lat, lng})
        if (position) {
            calculateRoute(
              { lat: position.latitude, lng: position.longitude },
              { lat, lng }
            )
  }
    }

    return (
        //MapContainer mi caballo ganador
        // MapContainer: el contenedor principal del mapa, centrado en Lima
        <MapContainer
          center={[-12.0464, -77.0428]}
          zoom={13}
          className="w-full h-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="OpenStreetMap"
          />
            <MapClickHandler onMapClick={handleMapClick} />

            {/* INICIO SECCION DE AMBULANCIA */}
            {position && (
              <Marker
                position={[position.latitude, position.longitude]}
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

            {trafficLights.map((trafficLight) => (
              <Marker
                key={trafficLight.id}
                position={[trafficLight.latitud, trafficLight.longitud]}
                icon={getTrafficLightIcon(trafficLight.estado, trafficLight.estado_emergencia)}
              >
                <Tooltip>
                  <div className='flex flex-col gap-1 p-1'>
                    <span>{trafficLight.calle}</span>
                    <hr className='w-full'/>
                    <span>Estado: {trafficLight.estado}</span>
                    <span>Estado de <span className='text-red-400'>emergencia</span>: {trafficLight.estado_emergencia}</span>
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
    )
}

export default Map