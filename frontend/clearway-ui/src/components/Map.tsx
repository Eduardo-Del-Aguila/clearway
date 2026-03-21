import { useState } from 'react';
import { useRoute } from '../hooks/useRoute';

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import { useSocket } from '../hooks/useSocket'
import { useTraficlights } from '../hooks/useTraficLights';
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
const getTraficLightIcon = (estado: string) => L.divIcon({
  className: '',
  html: `<div style="
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${estado === 'verde' ? '#22c55e' : estado === 'amarillo' ? '#eab308' : '#ef4444'};
    border: 2px solid white;
  "></div>`,
  iconSize: [20, 20],
})

interface Emergency {
  lat: number
  lng: number
}


const Map = () => {
    //Obtenemos la posicion en tiempo real via Socket.io
    const { position } = useSocket()
    const { traficLight } = useTraficlights()
    const { routeCoords, calculateRoute } = useRoute()

    const [emergency, setEmergency] = useState<Emergency | null>(null)

    const handleMapClick = (lat: number, lng: number) => {
        setEmergency({lat, lng})
        if (position) {
            calculateRoute(
              { lat: position.latitud, lng: position.longitud },
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
                position={[position.latitud, position.longitud]}
                icon={ambulanceIcon}
              >
                <Popup>Ambulancia A-01</Popup>
              </Marker>
            )}
            {/* INICIO DE PUNTO DE EMERGENCIA */}
            {emergency && (
              <Marker
                position={[emergency.lat, emergency.lng]}
                icon={emergencyIcon}
              >
                <Popup>Punto de emergencia</Popup>
              </Marker>
            )}

            {/* FIN DE PUNTO DE EMERGENCIA */}

            {traficLight.map((traficLight) => (
              <Marker
                key={traficLight.id}
                position={[traficLight.latitud, traficLight.longitud]}
                icon={getTraficLightIcon(traficLight.estado)}
              >
                <Popup>
                  <p>{traficLight.calle}</p>
                  <p>Estado: {traficLight.estado}</p>
                </Popup>
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