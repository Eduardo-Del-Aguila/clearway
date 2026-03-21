
interface Props {
  x: number
  y: number
  lat: number
  lng: number
  onAddHospital: (lat: number, lng: number) => void
  onAddAmbulance: (lat: number, lng: number) => void
  onAddTrafficLight: (lat: number, lng: number) => void
  onAddEmergency: (lat: number, lng: number) => void
  onClose: () => void
}

const ContextMenu = ({ x, y, lat, lng, onAddHospital, onAddAmbulance, onAddTrafficLight, onAddEmergency, onClose }: Props) => {
  const options = [
    { label: 'Agregar hospital', action: () => onAddHospital(lat, lng) },
    { label: 'Agregar ambulancia', action: () => onAddAmbulance(lat, lng) },
    { label: 'Agregar semaforo', action: () => onAddTrafficLight(lat, lng) },
    { label: 'Agregar punto de emergencia', action: () => onAddEmergency(lat, lng) },
  ]


  return (
    <div
      style={{ top: y, left: x }}
      className="max-w-70 absolute z-[1000] bg-gray-800 border border-gray-600 rounded-lg shadow-lg py-1 min-w-48"
    >
      {options.map((option) => (
        <button
          key={option.label}
          onClick={() => { option.action(); onClose() }}
          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
        >
          {option.label}
        </button>
      ))}
      <hr className="border-gray-600 my-1" />
      <button
        onClick={onClose}
        
        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
      >
        Cancelar
      </button>
    </div>
  )
}

export default ContextMenu