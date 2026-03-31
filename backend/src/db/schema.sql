CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE hospitales (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  latitud DECIMAL(10, 7) NOT NULL,
  longitud DECIMAL(10, 7) NOT NULL,
  capacidad_ambulancias INTEGER DEFAULT 3,
  deleted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ambulancias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  placa VARCHAR(20) UNIQUE NOT NULL,
  latitud DECIMAL(10, 7),
  longitud DECIMAL(10, 7),
  estado VARCHAR(20) DEFAULT 'libre',
  hospital_id INTEGER REFERENCES hospitales(id),
  deleted_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE semaforos (
  id SERIAL PRIMARY KEY,
  latitud DECIMAL(10, 7) NOT NULL,
  longitud DECIMAL(10, 7) NOT NULL,
  calle VARCHAR(200),
  estado VARCHAR(10) DEFAULT 'rojo',
  estado_emergencia VARCHAR(10) DEFAULT 'apagado',
  prioridad_emergencia BOOLEAN DEFAULT FALSE,
  tiempo_verde INTEGER DEFAULT 30,
  tiempo_amarillo INTEGER DEFAULT 5,
  tiempo_rojo INTEGER DEFAULT 30,
  contador INTEGER DEFAULT 0,
  deleted_at TIMESTAMP,
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

CREATE TABLE emergencias (
  id SERIAL PRIMARY KEY,
  latitud DECIMAL(10, 7) NOT NULL,
  longitud DECIMAL(10, 7) NOT NULL,
  estado VARCHAR(20) DEFAULT 'activa',
  ambulancia_id INTEGER REFERENCES ambulancias(id),
  deleted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);