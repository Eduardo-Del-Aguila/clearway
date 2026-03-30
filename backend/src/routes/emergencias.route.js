const express = require('express')
const router = express.Router()
const pool = require('../db/pool')

router.get('/', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM emergencias ORDER BY created_at DESC')
    res.status(200).json(resultado.rows);
    
  } catch (error) {
    console.log('Soy el error: ',error);
    res.status(500).json({ error: error.message })
  }
})

router.get('/count-by-ambulance', async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT 
        a.id,
        a.nombre,
        COUNT(e.id) as total
      FROM emergencias e
      JOIN ambulancias a ON e.ambulancia_id = a.id
      WHERE e.ambulancia_id IS NOT NULL
      GROUP BY a.id, a.nombre
      ORDER BY total DESC
    `)

    res.status(200).json(
      resultado.rows.map(row => ({
        ...row,
        total: Number(row.total)
      }))
    )

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  const { latitud, longitud, ambulancia_id } = req.body
  try {
    const resultado = await pool.query(
      'INSERT INTO emergencias (latitud, longitud, ambulancia_id) VALUES ($1, $2, $3) RETURNING *',
      [latitud, longitud, ambulancia_id || null]
    )
    global.io.emit('emergencias:update')
    res.json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/:id/cancelar', async (req, res) => {
  const { id } = req.params
  try {
    await pool.query(
      'UPDATE emergencias SET estado = $1, resolved_at = NOW() WHERE id = $2',
      ['cancelada', id]
    )
    global.io.emit('emergencias:update')
    res.json({ mensaje: 'Emergencia cancelada' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/:id/atendida', async (req, res) => {
  const { id } = req.params
  try {
    await pool.query(
      'UPDATE emergencias SET estado = $1, resolved_at = NOW() WHERE id = $2',
      ['atendida', id]
    )
    global.io.emit('emergencias:update')
    res.json({ mensaje: 'Emergencia atendida' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router