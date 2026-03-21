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

//Crear ambulancias EDUARDO SAC
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

//Editar ambulancias EDUARDO SAC
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { nombre, capacidad_ambulancias } = req.body
  try {
    const resultado = await pool.query(
      'UPDATE hospitales SET nombre = $1, capacidad_ambulancias = $2 WHERE id = $3 RETURNING *',
      [nombre, capacidad_ambulancias, id]
    )
    res.json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

//Adios vaquero
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM hospitales WHERE id = $1', [id])
    res.json({ mensaje: 'Hospital eliminado' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router