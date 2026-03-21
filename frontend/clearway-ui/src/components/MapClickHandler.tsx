import { useMapEvents } from 'react-leaflet'

interface Props {
  onMapClick: (lat: number, lng: number) => void
}

const MapClickHandler = ({ onMapClick }: Props) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng)
    }
  })

  return null
}

export default MapClickHandler