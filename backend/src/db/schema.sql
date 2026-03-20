CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE ambulancias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  placa VARCHAR(20) UNIQUE NOT NULL,
  latitud DECIMAL(10, 7),
  longitud DECIMAL(10, 7),
  estado VARCHAR(20) DEFAULT 'libre',
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE semaforos (
  id SERIAL PRIMARY KEY,
  latitud DECIMAL(10, 7) NOT NULL,
  longitud DECIMAL(10, 7) NOT NULL,
  calle VARCHAR(200),
  estado VARCHAR(10) DEFAULT 'rojo',
  prioridad_emergencia BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rutas (
  id SERIAL PRIMARY KEY,
  ambulancia_id INTEGER REFERENCES ambulancias(id),
  punto_inicio GEOMETRY(Point, 4326),
  punto_fin GEOMETRY(Point, 4326),
  geom_ruta GEOMETRY(LineString, 4326),
  tiempo_estimado_min INTEGER,
  creado_en TIMESTAMP DEFAULT NOW()
);