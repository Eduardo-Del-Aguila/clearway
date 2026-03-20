const express = require('express')
const cors = require('cors')
require('dotenv').config()


const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const ambulanciasRouter = require('./routes/ambulancias.route')
const semaforosRouter = require('./routes/semaforos.route')
const rutasRouter = require('./routes/rutas.route')


app.use('/api/semaforos', semaforosRouter)
app.use('/api/ambulancias', ambulanciasRouter)
app.use('/api/rutas', rutasRouter)

app.get('/', (req, res) => {
  res.json({ mensaje: 'ClearWay AI backend funcionando' })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})