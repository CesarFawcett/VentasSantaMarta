# 🔍 AUDIT.md — VentasSantaMarta
> **Generado por:** Repository Analyzer Agent  
> **Fecha:** 2026-03-17  
> **Repositorio:** https://github.com/CesarFawcett/VentasSantaMarta  
> **Stack:** Spring Boot 3.2.3 (Java 17) + React 18 (Vite + TypeScript) + PostgreSQL 15 + Docker

---

## 1. 📊 Resumen del Estado Actual

### Puntuación de Salud del Proyecto: `42 / 100` ⚠️

| Dimensión               | Estado             | Puntuación |
|-------------------------|--------------------|------------|
| Arquitectura Backend    | ❌ Incompleta       | 3/20       |
| Seguridad               | 🔴 Crítica         | 2/20       |
| Frontend                | ✅ Aceptable        | 14/20      |
| Docker / DevOps         | ⚠️ Mejorable       | 10/20      |
| Testing                 | ❌ Ausente          | 0/10       |
| Calidad de Código       | ⚠️ Deuda media     | 13/30      |

### Diagnóstico Rápido

El proyecto tiene una **base sólida en el frontend** (React 18, TypeScript estricto, componentes bien separados, Tailwind, buena UX). Sin embargo, el **backend es una cáscara vacía con deuda técnica severa**: Spring Security está incluido como dependencia pero **jamás fue configurado**, JJWT está declarado en el `pom.xml` pero **sin una sola línea de implementación JWT**, no existen endpoints de autenticación, y el controlador de productos viola el principio de responsabilidad única al acceder directamente al repositorio.  

La infraestructura Docker existe y es funcional, pero tiene **credenciales hardcodeadas**, healthchecks ausentes, y el puerto de la base de datos innecesariamente expuesto al host.

---

## 2. 🔴 Dependencias Críticas a Actualizar

### Backend (Maven - `backend/pom.xml`)

| Dependencia                    | Versión Actual | Versión Recomendada | Prioridad | Razón                                         |
|--------------------------------|----------------|---------------------|-----------|-----------------------------------------------|
| `spring-boot-starter-parent`   | `3.2.3`        | `3.3.x` o `3.4.x`  | MEDIA     | Versión con parches de seguridad y mejoras JPA |
| `jjwt-api`                     | `0.11.5`       | `0.12.6`            | **ALTA**  | 0.12.x trae breaking changes + mejoras de seguridad; la API cambió completamente |
| `jjwt-impl`                    | `0.11.5`       | `0.12.6`            | **ALTA**  | Debe coincidir con `jjwt-api`                 |
| `jjwt-jackson`                 | `0.11.5`       | `0.12.6`            | **ALTA**  | Debe coincidir con `jjwt-api`                 |
| `maven:3.8.4-openjdk-17` (Docker) | `3.8.4`   | `3.9-eclipse-temurin-21` | MEDIA | Imagen base desactualizada; Maven 3.9 es LTS actual |

> ⚠️ **NOTA CRÍTICA:** La migración de JJWT `0.11.x` → `0.12.x` implica **breaking changes en la API**. La clase `Jwts.parserBuilder()` fue renombrada a `Jwts.parser()`, y `Keys.hmacShaKeyFor()` y otros métodos cambiaron de firma. Revisar la [guía de migración oficial](https://github.com/jwtk/jjwt#whats-new-in-0120) antes de actualizar.

### Frontend (npm - `frontend/package.json`)

| Dependencia              | Versión Actual | Versión Recomendada | Prioridad | Razón                               |
|--------------------------|----------------|---------------------|-----------|-------------------------------------|
| `axios`                  | `^1.6.8`       | `^1.7.x`            | BAJA      | Parches menores de seguridad        |
| `react`                  | `^18.2.0`      | `^18.3.x`           | BAJA      | Parches de estabilidad              |
| `react-dom`              | `^18.2.0`      | `^18.3.x`           | BAJA      | Alineado con `react`                |
| `react-router-dom`       | `^6.22.3`      | `^6.28.x`           | BAJA      | Parches menores                     |
| `lucide-react`           | `^0.358.0`     | `^0.460.x`          | BAJA      | Nuevos iconos y fixes               |
| `vite`                   | `^5.2.0`       | `^5.4.x`            | MEDIA     | Fix de vulnerabilidades de build    |
| `eslint`                 | `^8.57.0`      | `^9.x`              | MEDIA     | ESLint 9 es la versión actual LTS   |
| `typescript`             | `^5.2.2`       | `^5.7.x`            | MEDIA     | Mejoras de inferencia de tipos      |
| `tailwindcss`            | `^3.4.3`       | `^3.4.17`           | BAJA      | Parches estables                    |

---

## 3. 🛠 Patrones de Código a Refactorizar

### 3.1 🔴 CRÍTICO — Ausencia total de capa de Seguridad JWT

**Problema:** `spring-boot-starter-security` está en el `pom.xml` pero sin configuración. Esto activa la seguridad básica de Spring por defecto (genera password aleatorio en consola), lo que bloquea **TODOS los endpoints** en producción. No existe ninguno de estos archivos requeridos:

- `src/.../config/SecurityConfig.java` → **NO EXISTE**
- `src/.../config/JwtService.java` → **NO EXISTE**  
- `src/.../config/JwtAuthFilter.java` → **NO EXISTE**
- `src/.../controllers/AuthController.java` → **NO EXISTE**
- `src/.../repositories/UserRepository.java` → **NO EXISTE**
- `src/.../services/ProductService.java` → **NO EXISTE**

**Impacto:** La aplicación **no puede desplegarse en producción** tal como está. El backend tiene dependencias JWT sin uso que inflaman el JAR ~200KB innecesariamente, y la seguridad básica de Spring bloqueará el acceso a `/api/products`.

---

### 3.2 🔴 CRÍTICO — `@CrossOrigin(origins = "*")` sin restricción

**Archivo:** `backend/src/main/java/com/santamarta/api/controllers/ProductController.java`, **línea 14**

```java
@CrossOrigin(origins = "*") // For development, update in production
```

**Problema:** Permite peticiones de **cualquier dominio** a la API. En producción expone la API a ataques CSRF y scraping masivo. Esto debe migrarse a una configuración centralizada en `SecurityConfig` usando `CorsConfigurationSource`.

---

### 3.3 🔴 CRÍTICO — Controlador accediendo directamente al Repositorio (violación SRP)

**Archivo:** `backend/src/main/java/com/santamarta/api/controllers/ProductController.java`

```java
private final ProductRepository productRepository; // ← Controlador inyecta repositorio directamente
```

**Problema:** Viola el **Principio de Responsabilidad Única** y la arquitectura en capas. La lógica de negocio debe residir en una capa `Service`. Además, el `@PostMapping createProduct` no tiene:
- Validación con `@Valid`
- Manejo de errores con try-catch o `@ControllerAdvice`
- Protección de rol (cualquiera puede crear productos)

**Refactor requerido:** Crear `ProductService.java` y `ProductServiceImpl.java`.

---

### 3.4 🟡 IMPORTANTE — API JPA deprecada en `@GenericGenerator`

**Archivos:** `Product.java` líneas 20-21, `User.java` líneas 18-19

```java
@GeneratedValue(generator = "UUID")
@GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator") // DEPRECATED
```

**Problema:** `@GenericGenerator` fue **deprecada en Hibernate 6** (incluida con Spring Boot 3.x). Genera warnings en compilación. La forma moderna es:

```java
@GeneratedValue(strategy = GenerationType.UUID)
```

---

### 3.5 🟡 IMPORTANTE — `createdAt` no usa `@PrePersist`

**Archivos:** `Product.java` línea 52, `User.java` línea 35

```java
private LocalDateTime createdAt = LocalDateTime.now(); // Se asigna al instanciar el objeto Java
```

**Problema:** El timestamp se asigna cuando se instancia el objeto en memoria Java, no cuando se persiste en BD. Si el objeto se crea y se guarda segundos después, habrá un skew. La forma correcta es usar `@CreationTimestamp` de Hibernate o un método `@PrePersist`.

---

### 3.6 🟡 IMPORTANTE — Contraseñas sin hashear en `User.java`

**Archivo:** `backend/src/main/java/com/santamarta/api/models/User.java`, **línea 26**

```java
@Column(nullable = false)
private String password; // Campo declarado pero sin evidencia de BCrypt/hashing
```

**Problema:** No existe ningún servicio que hashee la contraseña antes de guardar. Si el `DataSeeder` u otro proceso crea usuarios con contraseña en texto plano, es una **vulnerabilidad OWASP A02:2021 (Cryptographic Failures)**.

---

### 3.7 🟡 IMPORTANTE — `docker-compose.yml`: Credenciales hardcodeadas

**Archivo:** `docker-compose.yml`, líneas 7-8, 22-23

```yaml
POSTGRES_USER: santa_user
POSTGRES_PASSWORD: santa_password  # ← RIESGO DE SEGURIDAD
```

**Problema:** Credenciales de base de datos en texto plano en el control de versiones. Aunque el proyecto es open source educativo, es un anti-patrón grave.

**Adicionalmente:**
- Puerto `5432` de PostgreSQL expuesto al host (línea 11) — innecesario, solo el backend necesita acceso interno
- `depends_on: db` sin `healthcheck` — el backend puede intentar conectar antes de que Postgres esté listo
- `SPRING_JPA_HIBERNATE_DDL_AUTO: update` — **nunca debe usarse en producción**

---

### 3.8 🟡 IMPORTANTE — URL de API hardcodeada en frontend

**Archivo:** `frontend/src/services/productService.ts`, **línea 5**

```typescript
const API_BASE_URL = '/api'; // hardcodeado
```

**Problema:** No se usa `import.meta.env.VITE_API_URL`. Si el base path cambia, hay que modificar el código fuente. Debe movarse a una variable de entorno Vite.

---

### 3.9 🟠 MODERADO — `ProductGrid.tsx` manejo de error silencioso

**Archivo:** `frontend/src/components/ProductGrid.tsx`, líneas 21-23

```tsx
} catch {
  setError('No se pudieron cargar los productos.');
}
```

**Problema:** El error original se suprime completamente. En desarrollo dificulta el debugging. Debería al menos loggearse el error original.

---

### 3.10 🔵 MENOR — Ausencia total de tests

No existe ningún archivo de test en todo el repositorio:
- Backend: **0 archivos** en `src/test/`
- Frontend: **0 archivos** `*.spec.ts` o `*.test.tsx`

`spring-boot-starter-test` y `spring-security-test` están declarados en el `pom.xml` pero sin un solo test escrito.

---

## 4. 📋 Plan de Acción Inmediata

### FASE A — Correcciones Críticas de Seguridad y Arquitectura (Backend)

| Paso | Acción | Archivo(s) a crear/modificar | Agente responsable |
|------|--------|-----------------------------|--------------------|
| A1 | Crear `UserRepository.java` | `repositories/UserRepository.java` | refactoring-engineer |
| A2 | Crear capa de servicio `ProductService` + `ProductServiceImpl` | `services/ProductService.java`, `services/impl/ProductServiceImpl.java` | refactoring-engineer |
| A3 | Refactorizar `ProductController` para inyectar el servicio, agregar `@Valid`, manejo de errores | `controllers/ProductController.java` | refactoring-engineer |
| A4 | Implementar `JwtService.java` con JJWT 0.11.5 (sin actualizar aún) | `config/JwtService.java` | refactoring-engineer |
| A5 | Crear `JwtAuthenticationFilter.java` | `config/JwtAuthenticationFilter.java` | refactoring-engineer |
| A6 | Crear `SecurityConfig.java` con CORS centralizado, rutas públicas/protegidas, y `UserDetailsService` | `config/SecurityConfig.java` | refactoring-engineer |
| A7 | Crear `AuthController.java` con endpoints `/api/auth/login` y `/api/auth/register` | `controllers/AuthController.java` | refactoring-engineer |
| A8 | Reemplazar `@GenericGenerator` deprecated por `GenerationType.UUID` | `models/Product.java`, `models/User.java` | refactoring-engineer |
| A9 | Añadir `@CreationTimestamp` a `createdAt` | `models/Product.java`, `models/User.java` | refactoring-engineer |

### FASE B — Actualización de Dependencias

| Paso | Comando | Archivo afectado |
|------|---------|-----------------|
| B1 | Actualizar `jjwt-*` a `0.12.6` en `pom.xml` y adaptar API | `backend/pom.xml` + `JwtService.java` |
| B2 | Actualizar `spring-boot-starter-parent` a `3.3.x` si es posible | `backend/pom.xml` |
| B3 | `npm update` en frontend | `frontend/package.json` |
| B4 | Actualizar imagen Docker Maven a `3.9-eclipse-temurin-21` | `backend/Dockerfile` |

### FASE C — Mejoras de Infraestructura Docker

| Paso | Acción | Archivo |
|------|--------|---------|
| C1 | Crear `.env.example` con variables sin valores reales | `.env.example` |
| C2 | Mover credenciales a variables `${POSTGRES_PASSWORD}` en docker-compose | `docker-compose.yml` |
| C3 | Eliminar exposición del puerto `5432` al host | `docker-compose.yml` |
| C4 | Agregar `healthcheck` a servicio `db` y `condition: service_healthy` en backend | `docker-compose.yml` |
| C5 | Agregar `restart: on-failure` al backend | `docker-compose.yml` |

### FASE D — Frontend y Calidad

| Paso | Acción | Archivo |
|------|--------|---------|
| D1 | Crear `.env.example` con `VITE_API_URL=/api` | `frontend/.env.example` |
| D2 | Usar `import.meta.env.VITE_API_URL` en `productService.ts` | `frontend/src/services/productService.ts` |
| D3 | Mejorar manejo de errores en `ProductGrid.tsx` | `frontend/src/components/ProductGrid.tsx` |

### FASE E — Testing

| Paso | Acción |
|------|--------|
| E1 | Escribir tests unitarios para `ProductService` con Mockito |
| E2 | Escribir tests de integración para `ProductController` con `@WebMvcTest` |
| E3 | Verificar que `mvn test` corre sin errores |

---

> **Nota para el agente refactoring-engineer:** Prioriza estrictamente en orden A → C → B → D → E. No actualices JJWT hasta haber completado la implementación con 0.11.5, para luego migrar en un segundo paso controlado.
