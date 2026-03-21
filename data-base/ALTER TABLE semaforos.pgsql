ALTER TABLE semaforos 
ADD COLUMN tiempo_verde INTEGER DEFAULT 30,
ADD COLUMN tiempo_amarillo INTEGER DEFAULT 5,
ADD COLUMN tiempo_rojo INTEGER DEFAULT 30,
ADD COLUMN contador INTEGER DEFAULT 0;

ALTER TABLE semaforos ADD COLUMN estado_emergencia VARCHAR(10) DEFAULT 'apagado';

INSERT INTO ambulancias (nombre, placa, latitud, longitud) 
VALUES ('Ambulancia A-01', 'ABC-123', -12.0464, -77.0428);


INSERT INTO semaforos (latitud, longitud, calle, estado, prioridad_emergencia)
VALUES 
  (-12.0464, -77.0428, 'Av. Javier Prado con Av. La Marina', 'rojo', true),
  (-12.0510, -77.0350, 'Av. Arequipa con Av. Angamos', 'rojo', true),
  (-12.0600, -77.0300, 'Av. Brasil con Av. Salaverry', 'rojo', false);


SELECT column_name FROM information_schema.columns WHERE table_name = 'semaforos';


SELECT id, calle, estado, estado_emergencia FROM semaforos;

SELECT * FROM semaforos;
SELECT * FROM ambulancias;