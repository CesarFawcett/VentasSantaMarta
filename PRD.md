# PRD: Tienda Virtual de Santa Marta - VentasSantaMarta

## 1. Visión y Objetivos
**Visión:** Convertirse en la plataforma digital líder para la comercialización de productos en Santa Marta, ofreciendo una experiencia de usuario premium, segura y visualmente inspirada en la biodiversidad de la región (Paleta de verdes).

**Objetivos (KPIs):**
*   **Conversión:** Lograr un 3% de conversión de visitantes a compradores en los primeros 6 meses.
*   **Seguridad:** 0 incidentes de seguridad relacionados con la gestión de productos o datos de usuarios.
*   **Rendimiento:** Tiempo de carga inicial inferior a 2 segundos para mejorar el SEO local.

## 2. Investigación de Mercado y Contexto (Santa Marta 2025-2026)
Basado en las tendencias actuales:
*   **Crecimiento Digital:** Colombia proyecta alcanzar US$14.68 mil millones en e-commerce para 2025.
*   **Pagos Locales:** Es crítico integrar opciones como Nequi, Daviplata y PSE, además de tarjetas tradicionales.
*   **Mobile-First:** Más del 60% del tráfico en Colombia es móvil; el diseño debe ser responsivo y ligero.
*   **Contexto Local:** Aprovechar el boom turístico de Santa Marta mediante una interfaz que evoque frescura y naturaleza (uso del verde solicitado por el usuario).

## 3. Historias de Usuario (Priorizadas)
### P0 (Crítico)
*   **Admin:** Como administrador, quiero poder subir, editar y eliminar productos para mantener el catálogo actualizado.
*   **Usuario:** Como visitante, quiero ver el catálogo de productos y promociones para conocer la oferta.
*   **Usuario:** Como comprador, quiero registrarme e iniciar sesión para poder proceder al pago de forma segura.

### P1 (Importante)
*   **Filtros:** Como usuario, quiero filtrar productos por categorías para encontrar lo que busco rápidamente.
*   **Carrito:** Como usuario autenticado, quiero gestionar un carrito de compras para agrupar mis productos.
*   **Promociones:** Como administrador, quiero destacar productos con etiquetas de "Promoción" para incentivar ventas.

### P2 (Deseable)
*   **Wishlist:** Como usuario, quiero guardar productos favoritos para comprarlos después.
*   **Notificaciones:** Como usuario, quiero recibir correos de confirmación de compra.

## 4. Requisitos No Funcionales
*   **Seguridad:** Implementación de Spring Security con JWT (STRICT). Encriptación de contraseñas con BCrypt.
*   **Escalabilidad:** Arquitectura desacoplada (Spring Boot REST API + React SPA) preparada para ser contenida en Docker.
*   **UX/UI:** Estética premium usando paleta de verdes (Esmeralda, Bosque, Menta) y fuentes modernas (Inter/Outfit).
*   **Disponibilidad:** Base de datos PostgreSQL para integridad de datos transaccionales.

## 5. Riesgos y Suposiciones
*   **Riesgo:** Alta latencia en imágenes pesadas. *Mitigación:* Optimización de assets y carga perezosa (lazy loading).
*   **Suposición:** El administrador es el único con permisos de escritura; se asume un rol `ROLE_ADMIN` preconfigurado.
