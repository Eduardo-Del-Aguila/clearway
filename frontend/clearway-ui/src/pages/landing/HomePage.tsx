import React from 'react'
import { Header } from './components/Header'
import { Link, useNavigate } from 'react-router-dom'
import { Problem } from './components/Problem'
import { Footer } from './components/Footer'
import { HowWork } from './components/HowWork'

export const HomePage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen text-white bg-[#0F0F0F]">
      <div className="progress h-1 bg-red-500 fixed top-0 left-0 z-50"></div>
      <Header />
      <section
        id="inicio"
        className="flex flex-col items-center justify-center min-h-screen px-6 md:px-8 text-center"
      >
        <span className="text-xs font-bold tracking-widest text-red-500 uppercase mb-6">
          Sistema de emergencias urbanas
        </span>
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
          Chuya<span className="text-red-500">Ñam</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-4">
          Optimización de rutas de ambulancias en tiempo real mediante semáforos inteligentes y gestión centralizada de emergencias.
        </p>

        <p className="text-sm text-gray-500 mb-10">
          Desarrollado para LA Hackamidu — Lima, Perú
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-10 py-4 rounded-xl text-lg transition hover:scale-105"
        >
          Iniciar simulación
        </button>
        <p className="text-xs text-gray-600 mt-4">
          No se requiere cuenta. La simulación es completamente interactiva.
        </p>
      </section>
      <section id="problem">
        <Problem />
      </section>
      <section id="howWork">
        <HowWork />
      </section>
      <section className="bg-red-600 px-6 md:px-8 py-28 text-center">
        <h2 className="text-3xl md:text-4xl font-black mb-6">
          ¿Listo para ver ChuyaÑam en acción?
        </h2>
        <p className="text-red-200 mb-10 max-w-xl mx-auto">
          La simulación es interactiva. Agrega hospitales, ambulancias y semáforos en el mapa real de Lima.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-white text-red-600 font-black px-10 py-4 rounded-xl text-lg hover:bg-red-50 transition hover:scale-105"
        >
          Abrir el dashboard
        </button>
      </section>
      <Footer />
    </div>
  )
}
