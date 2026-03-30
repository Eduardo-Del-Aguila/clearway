import React from 'react'

const features = [
  'Rutas optimas calculadas en tiempo real por calles reales',
  'Semaforos con luz de emergencia independiente',
  'Protocolo de emergencia — la ambulancia no se detiene en rojo',
  'Sin protocolo — la ambulancia respeta los semaforos',
  'Multiples emergencias simultaneas',
  'Panel de control centralizado para el operador del SAMU',
]

export const Tips = () => {
  return (
      <section className=" bg-[#1A1A1A] ">
        <div className='px-8 py-24 max-w-4xl mx-auto'>
          <h2 className="text-3xl font-bold text-center mb-16">Que puedes hacer en la simulacion</h2>
          <div className="grid grid-cols-1 gap-3">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-4 bg-gray-800 rounded-lg px-6 py-4">
                <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                <p className="text-gray-300 text-sm">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}
