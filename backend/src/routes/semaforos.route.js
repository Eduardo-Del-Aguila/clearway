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

//Creamos nuestras ambulancias
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

module.exports = router