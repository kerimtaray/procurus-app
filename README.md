# Procurus App

## Requisitos Previos
- Node.js
- PostgreSQL

## Pasos para Ejecutar

1. Instalar dependencias:
```bash
npm install
```

2. Configurar base de datos:
- Crear archivo `.env` en la raíz del proyecto
- Agregar la URL de la base de datos:
```
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/procurus
```

3. Ejecutar migraciones:
```bash
npm run db:push
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000` 