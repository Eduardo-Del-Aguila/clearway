import { useMapEvents } from 'react-leaflet'

interface Props {
  onRightClick: (lat: number, lng: number, x: number, y: number) => void
}

const MapRightClickHandler = ({ onRightClick }: Props) => {
  useMapEvents({
    contextmenu: (e) => {
        e.originalEvent.preventDefault()
        const container = e.target.getContainer()
        const rect = container.getBoundingClientRect()
      onRightClick(
        e.latlng.lat,
        e.latlng.lng,
        e.originalEvent.clientX - rect.left,
        e.originalEvent.clientY - rect.top
      )
    }
  })

  return null
}

export default MapRightClickHandler