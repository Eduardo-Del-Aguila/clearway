export interface TrafficLight {
  id: number
  latitud: number
  longitud: number
  calle: string
  estado: string
  prioridad_emergencia: boolean
  estado_emergencia: string
  tiempo_verde: number
  tiempo_amarillo: number
  tiempo_rojo: number
  contador: number
}

export interface Hospital {
  id: number
  nombre: string
  latitud: number
  longitud: number
  capacidad_ambulancias: number
}

export interface Ambulance {
  id: number
  nombre: string
  placa: string
  latitud: number
  longitud: number
  estado: string
  hospital_id: number
}

export interface Emergency {
  id?: number
  lat: number
  lng: number
  estado?: string
  ambulancia_id?: number
}

export interface Position {
  lat: number
  lng: number
}

export interface Mission {
  id: string
  ambulance: Ambulance
  emergency: Position
  route: [number, number][]
  currentIndex: number
  color: string
  emergenciaId: string
  returning: boolean
}