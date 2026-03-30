export const Problem = () => {
  return (
    <section className="bg-[#1A1A1A] py-28 px-6 md:px-8 min-h-screen">
      <div className="max-w-6xl mx-auto text-center">
        
        {/* Título */}
        <h2 className="text-4xl md:text-5xl font-black mb-8">
          El problema que resolvemos
        </h2>

        {/* Texto */}
        <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
          En Lima, las ambulancias pierden minutos críticos atrapadas en el tráfico urbano.
          Esos minutos, en emergencias cardíacas o accidentes graves, pueden ser la diferencia entre la vida y la muerte.
          <span className="text-white font-semibold"> ChuyaÑam </span>
          coordina en tiempo real la ruta de cada ambulancia y prepara los semáforos antes de su llegada.
        </p>

        {/* Stats */}
        <div className="grid gap-8 mt-20 md:grid-cols-3">
          
          <div className="bg-[#0F0F0F] rounded-2xl p-8 shadow-md hover:scale-105 transition">
            <p className="text-5xl font-black text-red-500 mb-3">8 min</p>
            <p className="text-gray-400 text-sm">
              Tiempo promedio perdido en tráfico por emergencia
            </p>
          </div>

          <div className="bg-[#0F0F0F] rounded-2xl p-8 shadow-md hover:scale-105 transition">
            <p className="text-5xl font-black text-red-500 mb-3">-40%</p>
            <p className="text-gray-400 text-sm">
              Reducción estimada en tiempo de respuesta con ChuyaÑam
            </p>
          </div>

          <div className="bg-[#0F0F0F] rounded-2xl p-8 shadow-md hover:scale-105 transition">
            <p className="text-5xl font-black text-red-500 mb-3">0</p>
            <p className="text-gray-400 text-sm">
              Semáforos inteligentes activos en Lima hoy
            </p>
          </div>

        </div>

      </div>
    </section>
  )
}