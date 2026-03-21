const express = require('express')
const router = express.Router()
const pool = require('../db/pool')

router.get('/', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM hospitales')
    res.json(resultado.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  const { nombre, latitud, longitud, capacidad_ambulancias } = req.body
  try {
    const resultado = await pool.query(
      'INSERT INTO hospitales (nombre, latitud, longitud, capacidad_ambulancias) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, latitud, longitud, capacidad_ambulancias || 3]
    )
    res.json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router