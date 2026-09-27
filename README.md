# FraudexPy.Front (React + Vite + TypeScript + Tailwind CSS)

Frontend moderno para la plataforma de monitoreo y análisis de fraude **FraudexPy**.

## Características

- **Stack:** React 19 / Vite / TypeScript / Tailwind CSS
- **Iconografía:** Lucide React
- **Cliente HTTP:** Axios con inyección automática de token JWT e interceptores
- **Funcionalidades:**
  - Dashboard de monitoreo con métricas y KPIs de fraude
  - Listado y búsqueda avanzada con filtrado por estado y nivel de riesgo
  - Modal de registro y login con autenticación JWT
  - Creación de casos de fraude con adjunto de evidencias multimedia directo a MinIO / S3
  - Descarga de evidencias mediante URLs prefirmadas seguras
- **Despliegue:** Preparado para CapRover con Nginx, Dockerfile multi-stage y `captain-definition`

## Variables de Entorno

- `VITE_API_URL`: URL base de la API backend (por ejemplo `https://api.fraudex.py` o vacío para usar el proxy inverso).
