# ChuyanÑam 

Sistema inteligente de gestión de emergencias médicas que coordina ambulancias y semáforos en tiempo real.

##  Demo
http://144.225.147.96

##  ¿Qué hace?
Cuando se activa una emergencia, el sistema:
- Asigna automáticamente la ambulancia más cercana disponible
- Calcula la ruta óptima usando OpenRouteService
- Pone en verde los semáforos del trayecto en tiempo real
- Actualiza el mapa en vivo para todos los usuarios conectados

##  Stack
- **Frontend:** React + TypeScript + Leaflet + Socket.io
- **Backend:** Node.js + Express + Socket.io
- **Base de datos:** PostgreSQL + PostGIS
- **Infraestructura:** Docker Compose + DokPloy

##  CubePath
Toda la infraestructura está desplegada en el VPS de CubePath: frontend, backend y base de datos, gestionados con Docker Compose mediante DokPloy.

##  Capturas
./screenshots/
