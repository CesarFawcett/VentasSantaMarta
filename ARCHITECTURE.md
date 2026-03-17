# ARQUITECTURA TÉCNICA: VentasSantaMarta

## 1. Visión General de Arquitectura
**VentasSantaMarta** se basa en una arquitectura de **Cliente-Servidor desacoplada** para garantizar escalabilidad e independencia en el despliegue.
*   **Backend:** REST API robusta basada en Spring Boot (Java), siguiendo el patrón de diseño por capas (Controller, Service, Repository, Entity/DTO).
*   **Frontend:** Single Page Application (SPA) con React, enfocada en una experiencia de usuario fluida y estética premium.
*   **Filosofía:** API-First, Seguridad por defecto (Stateful/Stateless via JWT) y contenedores para consistencia en entornos de desarrollo y producción.

## 2. Stack Tecnológico Detallado

### Backend
- **Lenguaje:** Java 17+
- **Framework:** Spring Boot 3.x (Spring Web, Spring Security, Spring Data JPA)
- **Justificación:** Spring Boot es el estándar industrial para APIs seguras y escalables. Spring Security permite implementar JWT de forma nativa para cumplir con el requisito de autenticación obligatoria en compras. 
- **Validación:** Hibernate/Bean Validation para integridad de datos.

### Frontend
- **Framework:** React 18+ (Vite como bundler por velocidad)
- **Estado:** Context API / Zustand (ligero y eficiente)
- **Estilos:** Vanilla CSS / CSS Modules para control total sobre la paleta de verdes premium (Esmeralda, Bosque, Menta).
- **Icons:** React Icons / Lucide React.

### Base de Datos
- **Principal:** PostgreSQL 15+
- **Justificación:** Base de datos relacional robusta, ideal para transacciones de compras (ACID) y relaciones jerárquicas de productos/categorías.

### Infraestructura y Despliegue (Contenedores)
- **Engine:** Docker & Docker Compose.
- **Servicios:**
    - `backend`: Contenedor Java/Spring.
    - `frontend`: Contenedor Nginx (Sirviendo el bundle de React).
    - `db`: Contenedor PostgreSQL.

## 3. Modelo de Datos (ERD)
```sql
ENTITY User {
  id UUID PK
  email VARCHAR(150) UNIQUE NOT NULL
  password_hash VARCHAR(255) NOT NULL
  full_name VARCHAR(100)
  role ENUM ['USER', 'ADMIN'] DEFAULT 'USER'
  created_at TIMESTAMP
}

ENTITY Product {
  id UUID PK
  name VARCHAR(200) NOT NULL
  description TEXT
  price DECIMAL(10,2) NOT NULL
  stock INT DEFAULT 0
  image_url VARCHAR(500)
  is_promotion BOOLEAN DEFAULT FALSE
  discount_percentage INT DEFAULT 0
  category_id FK -> Category.id
  created_at TIMESTAMP
}

ENTITY Category {
  id UUID PK
  name VARCHAR(100) UNIQUE NOT NULL
  icon_name VARCHAR(50)
}

ENTITY Order {
  id UUID PK
  user_id FK -> User.id
  total_amount DECIMAL(10,2)
  status ENUM ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
  created_at TIMESTAMP
}

ENTITY OrderItem {
  id UUID PK
  order_id FK -> Order.id
  product_id FK -> Product.id
  quantity INT
  price_at_purchase DECIMAL(10,2)
}
```

## 4. Estructura del Proyecto (Monorepo)
```text
/VentasSantaMarta
├── backend/            # Spring Boot Application
│   ├── src/main/java/com/santamarta/api/
│   │   ├── config/     # Security, Docker Config
│   │   ├── controllers/# REST Endpoints
│   │   ├── models/     # Entities, Enums
│   │   ├── services/   # Business Logic
│   │   └── repositories/# JPA Interfaces
├── frontend/           # React SPA (Vite)
│   ├── src/
│   │   ├── components/ # Reusable UI
│   │   ├── pages/      # Views: Home, Login, Catalog, Admin
│   │   ├── styles/     # Premium Green CSS Theme
│   │   └── services/   # API Clients
├── docker-compose.yml  # Orchestration
├── .gitignore          # Root ignores
└── README.md           # Instructions
```
