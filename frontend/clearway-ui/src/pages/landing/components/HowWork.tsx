import ambulance from '../../../assets/steps/create-ambulance.png'
import hospital from '../../../assets/steps/create-hospital.png'
import traficcLight from '../../../assets/steps/create-traficcLight.png'
import emergencyTl from '../../../assets/steps/create-emergencyLight.png'


const steps = [
  { number: '01', img: hospital ,title: 'Agrega un hospital', description: 'Haz click derecho en el mapa y coloca un hospital en su ubicacion real. Define cuantas ambulancias puede tener.', detils:['3 ambulancias por hospital', 'Restriccionde 500 metros entre hospitales'] },
  { number: '02', img: ambulance ,title: 'Registra ambulancias', description: 'Desde cada hospital agrega sus ambulancias. El sistema las asignara automaticamente segun cercania.', detils:['Nombre', 'Placa de vehiculo'] },
  { number: '03', img: traficcLight ,title: 'Coloca semaforos', description: 'Agrega semaforos en intersecciones reales.', detils:['3 colores comunes', 'Luz de emergencia'] },
  { number: '04', img: emergencyTl ,title: 'Activa la emergencia', description: 'Haz click derecho en cualquier punto del mapa. La ambulancia mas cercana trazara su ruta automaticamente.', detils:['Ambulancia más cercana', 'Varias al mismo tiempo'] },
]
export const HowWork = () => {
  return (
    <section className="px-6 md:px-8 py-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-20">
          Cómo funciona
        </h2>
        <div className="grid gap-10 md:grid-cols-2">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col justify-between bg-[#1A1A1A] rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition"
            >

              <div className="p-6 flex flex-col gap-4">
                <span className="text-5xl font-black text-red-500 opacity-40">
                  {step.number}
                </span>
                <h3 className="text-2xl font-bold">
                  {step.title}
                </h3>
                <hr className='text-red-600'/>
                <p className="text-gray-300 text-md leading-relaxed">
                  {step.description}
                </p>
                <div className='flex flex-col gap-2 '>
                  { step.detils.map((det) => (
                  <span className='bg-gray-500/30 px-2 py-1 w-fit rounded-lg'>  { det } </span>  
                  ))
                  }
                </div>
              </div>
              <div className="h-70 overflow-hidden">
                <img
                  src={step.img}
                  alt={step.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
