# Historias de Usuario: VentasSantaMarta

| ID | Como... | Quiero... | Para... | Prioridad | Criterios de Aceptación |
|:---|:---|:---|:---|:---|:---|
| US01 | Administrador | Crear un nuevo producto con nombre, descripción, precio, stock e imagen. | Ofrecer nuevos artículos a los clientes. | Must | El producto debe guardarse en la BD y ser visible en el catálogo. |
| US02 | Administrador | Editar la información de un producto existente. | Corregir errores o actualizar precios/stock. | Must | Los cambios deben reflejarse inmediatamente en la web. |
| US03 | Administrador | Eliminar un producto del catálogo. | Quitar artículos que ya no se venden. | Must | El producto no debe aparecer más en las búsquedas ni en el catálogo. |
| US04 | Administrador | Marcar un producto como "Promoción" y asignar un porcentaje de descuento. | Incentivar la venta de artículos específicos. | Should | Debe mostrarse el precio original tachado y el nuevo precio destacado. |
| US05 | Visitante | Ver la lista completa de productos disponibles. | Conocer la oferta de la tienda sin necesidad de registro. | Must | La lista debe cargar en < 2s y mostrar fotos claras. |
| US06 | Visitante | Ver el detalle de un producto (descripción amplia, especificaciones). | Tomar una decisión de compra informada. | Must | Debe abrirse una vista detallada al hacer clic en el producto. |
| US07 | Visitante | Filtrar productos por categoría (ej. artesanías, comida, ropa). | Encontrar rápidamente lo que busco. | Should | Los filtros deben aplicarse sin recargar toda la página. |
| US08 | Visitante | Buscar productos por nombre usando una barra de búsqueda. | Localizar un artículo específico de forma directa. | Should | La búsqueda debe ser insensible a mayúsculas/minúsculas. |
| US09 | Usuario | Registrarme en la plataforma con mi correo y contraseña. | Tener una cuenta personal para realizar compras. | Must | Validación de correo único y contraseña segura (BCrypt). |
| US10 | Usuario | Iniciar sesión de forma segura. | Acceder a mi carrito y realizar pedidos. | Must | Retorno de un token JWT válido por 24h. |
| US11 | Comprador | Añadir productos a un carrito de compras. | Agrupar varios artículos para un solo pago. | Must | El carrito debe persistir durante la sesión del usuario. |
| US12 | Comprador | Modificar cantidades o eliminar items del carrito. | Ajustar mi compra antes de pagar. | Must | El subtotal y total deben actualizarse automáticamente. |
| US13 | Comprador | Realizar el "Checkout" (finalizar compra). | Adquirir formalmente los productos. | Must | Solo accesible para usuarios autenticados. Genera un pedido en la BD. |
| US14 | Comprador | Ver mi historial de pedidos realizados. | Hacer seguimiento de mis compras pasadas. | Should | Lista de pedidos con fecha, total y estado. |
| US15 | Usuario | Recuperar mi contraseña mediante el correo electrónico. | Volver a acceder a mi cuenta si olvido mis credenciales. | Could | Envío de un token temporal por email. |
| US16 | Comprador | Guardar productos en una "Lista de Deseos". | Comprarlos en el futuro o seguirlos. | Could | Icono de corazón que guarda el item en el perfil. |
| US17 | Administrador | Ver un dashboard con el resumen de ventas diarias. | Monitorear el rendimiento del negocio. | Should | Gráfico simple o tabla con ventas del día. |
| US18 | Administrador | Gestionar el estado de los pedidos (Pendiente, Enviado, Entregado). | Mantener informado al cliente sobre su compra. | Should | El cambio de estado debe ser visible para el usuario final. |
| US19 | Visitante | Ver banners de promociones destacadas en el Home. | Enterarme de las mejores ofertas apenas entro. | Should | Carrusel visual con los verdes de la marca. |
| US20 | Usuario | Cerrar sesión de forma segura. | Proteger mi cuenta en dispositivos compartidos. | Must | Invalidación del token en el cliente. |
