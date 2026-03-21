const express = require('express')
const router = express.Router()
const pool = require('../db/pool')

router.get('/', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM semaforos')
    res.json(resultado.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

//Creamos nuestros semaforos
router.post('/', async (req, res) => {
  const { latitud, longitud, calle, estado, tiempo_verde, tiempo_amarillo, tiempo_rojo } = req.body
  try {
    const resultado = await pool.query(
      `INSERT INTO semaforos 
        (latitud, longitud, calle, estado, tiempo_verde, tiempo_amarillo, tiempo_rojo) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [latitud, longitud, calle, estado || 'rojo', tiempo_verde || 30, tiempo_amarillo || 5, tiempo_rojo || 30]
    )
    res.json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

//Editamos el estado de emergencia semaforos
router.put('/:id/emergencia', async (req, res) => {
  const { id } = req.params
  const { estado_emergencia } = req.body

  try {
    await pool.query(
      'UPDATE semaforos SET estado_emergencia = $1 WHERE id = $2',
      [estado_emergencia, id]
    )
    res.json({ mensaje: 'Estado de emergencia actualizado' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Actualizamos los datos de un semáforo
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { calle, tiempo_verde, tiempo_amarillo, tiempo_rojo, estado} = req.body
  try {
    const resultado = await pool.query(
      'UPDATE semaforos SET calle = $1, tiempo_verde = $2, tiempo_amarillo = $3, tiempo_rojo = $4, estado = $5 WHERE id = $6 RETURNING *',
      [calle, tiempo_verde, tiempo_amarillo, tiempo_rojo, estado, id]
    )
    res.json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

//Deprecamos a mi hermano semáforo
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM semaforos WHERE id = $1', [id])
    res.json({ mensaje: 'Semaforo eliminado' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router


