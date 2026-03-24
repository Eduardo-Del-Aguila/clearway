const express = require('express')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')
require('dotenv').config()


global.io = io

const ambulanciasRouter = require('./routes/ambulancias.route')
const semaforosRouter = require('./routes/semaforos.route')
const rutasRouter = require('./routes/rutas.route')
const hospitalesRouter = require('./routes/hospitales.route')
const emergenciasRouter = require('./routes/emergencias.route')

const app = express()
const PORT = process.env.PORT || 3001
const server = http.createServer(app)
const io = new Server(server, {
    cors: 
    {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
})

app.use(cors())
app.use(express.json())

app.use('/api/semaforos', semaforosRouter)
app.use('/api/ambulancias', ambulanciasRouter)
app.use('/api/rutas', rutasRouter)
app.use('/api/hospitales', hospitalesRouter)
app.use('/api/emergencias', emergenciasRouter)

app.get('/', (req, res) => {
  res.json({ mensaje: 'ClearWay AI backend funcionando' })
})

// Coneccion al servidor via Socket.io https://socket.io/docs/v4/server-api/
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id)

  // Escuchamos el evento 'ambulancia:movimiento'
  // Este evento lo emite el simulador cada 2 segundos
  socket.on('ambulancia:movimiento', (data) => {
    console.log('Posicion recibida:', data)
    
    // io.emit reenvía el evento a TODOS los clientes conectados
    // Esto incluye el frontend, que actualizara el mapa automaticamente
    io.emit('ambulancia:movimiento', data)
  })

  // Cuando un cliente se desconecta
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id)
  })
})

server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})