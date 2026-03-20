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

module.exports = router