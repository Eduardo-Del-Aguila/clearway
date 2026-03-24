const express = require('express')
const router = express.Router()
const pool = require('../db/pool')

router.get('/hospital/:hospitalId', async (req, res) => {
  const { hospitalId } = req.params
  try {
    const resultado = await pool.query(
      'SELECT * FROM ambulancias WHERE hospital_id = $1 AND deleted_at IS NULL',
      [hospitalId]
    )
    res.json(resultado.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})


router.post('/', async (req, res) => {
  const { nombre, placa, hospital_id, latitud, longitud } = req.body
  try {
    const resultado = await pool.query(
      'INSERT INTO ambulancias (nombre, placa, hospital_id, latitud, longitud) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, placa, hospital_id, latitud, longitud]
    )
    res.status(500).json({ error: error.message })
    res.json(resultado.rows[0])
  } catch (error) {
    global.io.emit('hospitales:update')
  }
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { nombre, placa, estado } = req.body
  try {
    const resultado = await pool.query(
      'UPDATE ambulancias SET nombre = $1, placa = $2, estado = $3 WHERE id = $4 RETURNING *',
      [nombre, placa, estado, id]
    )
    global.io.emit('hospitales:update')
    res.json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    await pool.query(
      'UPDATE ambulancias SET deleted_at = NOW() WHERE id = $1',
      [id]
    )
    res.status(500).json({ error: error.message })
    res.json({ mensaje: 'Ambulancia eliminada' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router