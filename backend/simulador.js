const { io } = require('socket.io-client')

const socket = io('http://localhost:3001')

socket.on('connect_error', (error) => {
  console.log('Error de conexion:', error.message)
})

const ruta = [
  { lat: -12.0464, lng: -77.0428 },
  { lat: -12.0480, lng: -77.0410 },
  { lat: -12.0500, lng: -77.0390 },
  { lat: -12.0520, lng: -77.0370 },
  { lat: -12.0540, lng: -77.0350 },
  { lat: -12.0560, lng: -77.0330 },
  { lat: -12.0580, lng: -77.0310 },
  { lat: -12.0600, lng: -77.0300 },
]

let indice = 0

socket.on('connect', () => {
  console.log('Simulador conectado al servidor')

  setInterval(() => {
    const posicion = ruta[indice % ruta.length]
    console.log(`Enviando posicion: ${posicion.lat}, ${posicion.lng}`)
    
    socket.emit('ambulancia:movimiento', {
      id: 1,
      latitud: posicion.lat,
      longitud: posicion.lng
    })

    indice++
  }, 2000)
})