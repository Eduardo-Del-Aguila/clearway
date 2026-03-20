const express = require('express')
const router = express.Router()
const pool = require('../db/pool')

router.post('/location', async (req, res) => {
  const { id, latitud, longitud } = req.body

  try {
    await pool.query(
      'UPDATE ambulancias SET latitud = $1, longitud = $2, updated_at = NOW() WHERE id = $3',
      [latitud, longitud, id]
    )
    res.json({ mensaje: 'Ubicación actualizada' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router