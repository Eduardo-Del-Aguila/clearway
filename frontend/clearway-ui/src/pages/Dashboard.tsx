import Map from '../components/Map'

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-64 bg-gray-800 p-4">
        <h1 className="text-xl font-bold text-red-500 mb-4">ClearWay</h1>
        <p className="text-gray-400 text-sm">Central SAMU</p>
      </div>

      <div className="flex-1">
        <Map />
      </div>

      <div className="w-64 bg-gray-800 p-4">
        <h2 className="text-lg font-bold mb-4">Emergencia activa</h2>
        <p className="text-gray-400 text-sm">Sin emergencias</p>
      </div>
    </div>
  )
}

export default Dashboard