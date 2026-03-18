# 🛍️ VentasSantaMarta - Tienda Virtual Premium

![Status](https://img.shields.io/badge/Status-Modernized-brightgreen)
![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.4.3-6DB33F?logo=springboot)
![React](https://img.shields.io/badge/Frontend-React%2018.2%20%2B%20Vite%206-61DAFB?logo=react)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2015-336791?logo=postgresql)
![Docker](https://img.shields.io/badge/Infrastructure-Docker-2496ED?logo=docker)

**VentasSantaMarta** es una plataforma de comercio electrónico moderna, segura y escalable. Diseñada con una estética premium y una arquitectura robusta, ofrece una experiencia de usuario fluida tanto para clientes como para administradores.

---

## 🚀 Tecnologías Principales

### Backend
- **Framework:** Spring Boot 3.4.3
- **Seguridad:** Spring Security + JWT (JJWT 0.12.5)
- **Persistencia:** Spring Data JPA + Hibernate
- **Base de Datos:** PostgreSQL 15
- **Documentación:** Auditoría técnica detallada en `AUDIT.md`

### Frontend
- **Framework:** React 18.2 (Type Script)
- **Herramienta de Construcción:** Vite 6.0.0
- **Estilos:** Tailwind CSS (Diseño responsivo y moderno)
- **Iconografía:** Lucide React
- **Navegación:** React Router DOM

---

## 🛠️ Instalación y Configuración

### Requisitos Previos
- Docker y Docker Compose instalados.
- Git.

### Despliegue con Docker (Recomendado)
El proyecto está completamente dockerizado para facilitar el despliegue local.

1. **Clonar el repositorio** (si no lo has hecho):
   ```bash
   git clone https://github.com/CesarFawcett/VentasSantaMarta.git
   cd VentasSantaMarta
   ```

2. **Levantar los servicios**:
   ```bash
   docker-compose up -d --build
   ```

3. **Acceder a la aplicación**:
   - **Frontend:** [http://localhost:3000](http://localhost:3000)
   - **Backend API:** [http://localhost:8080](http://localhost:8080)

---

## 🔐 Seguridad y Acceso

El sistema implementa autenticación basada en JWT y roles (ADMIN/USER).

### Credenciales de Administrador (Default)
El sistema incluye un `DataSeeder` que genera un usuario administrador inicial:
- **Email:** `admin@santamarta.com`
- **Password:** `admin123`

### Características de Seguridad
- Endpoints de consulta protegidos/públicos según el recurso.
- Gestión de CORS configurada para integración segura con el frontend.
- Filtros de seguridad a nivel de petición en el backend.

---

## 📁 Estructura del Proyecto

```text
VentasSantaMarta/
├── backend/            # API REST (Spring Boot)
│   ├── src/            # Código fuente (Config, Controllers, Services, Models)
│   └── Dockerfile      # Configuración de contenedor backend
├── frontend/           # Interfaz de Usuario (React + Vite)
│   ├── src/            # Componentes, Páginas y Servicios
│   └── Dockerfile      # Configuración de contenedor frontend
├── docker-compose.yml  # Orquestación de servicios (DB, API, UI)
└── AUDIT.md           # Reporte detallado de modernización y estado técnico
```

---

## 📝 Auditoría Técnica
Para conocer los detalles profundos de la refactorización, actualizaciones de dependencias y cambios en la API de seguridad, consulta el archivo [AUDIT.md](./AUDIT.md).

---

