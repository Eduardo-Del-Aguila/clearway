const express = require('express')
const router = express.Router()
const pool = require('../db/pool')

router.get('/optima', async (req, res) => {
  const { origenLat, origenLng, destinoLat, destinoLng } = req.query

  try {
    const resultado = await pool.query(`
      SELECT 
        ST_AsGeoJSON(
          ST_MakeLine(
            ST_SetSRID(ST_MakePoint($1, $2), 4326),
            ST_SetSRID(ST_MakePoint($3, $4), 4326)
          )
        ) AS ruta_geojson,
        ST_Distance(
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
          ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography
        ) AS distancia_metros
    `, [origenLng, origenLat, destinoLng, destinoLat])

    res.json(resultado.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router