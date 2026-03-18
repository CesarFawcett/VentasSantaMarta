package com.santamarta.api.controllers;

import com.santamarta.api.models.*;
import com.santamarta.api.repositories.OrderRepository;
import com.santamarta.api.repositories.ProductRepository;
import com.santamarta.api.repositories.UserRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody List<CartItemRequest> cartItems
    ) {
        if (cartItems == null || cartItems.isEmpty()) {
            return ResponseEntity.badRequest().body("El carrito está vacío");
        }

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();
        List<Product> productsToUpdate = new ArrayList<>();

        for (CartItemRequest item : cartItems) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + item.getProductId()));

            if (product.getStock() < item.getQuantity()) {
                return ResponseEntity.badRequest().body("Stock insuficiente para: " + product.getName());
            }

            // Calculate item price (at purchase time)
            BigDecimal price = product.getPrice();
            total = total.add(price.multiply(BigDecimal.valueOf(item.getQuantity())));

            // Decrement stock
            product.setStock(product.getStock() - item.getQuantity());
            productsToUpdate.add(product);

            orderItems.add(OrderItem.builder()
                    .product(product)
                    .quantity(item.getQuantity())
                    .priceAtPurchase(price)
                    .build());
        }

        // Create the order
        Order order = Order.builder()
                .user(user)
                .totalAmount(total)
                .status(Order.OrderStatus.COMPLETED)
                .items(orderItems)
                .build();

        // Set order reference in each item
        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }

        // Save all changes
        productRepository.saveAll(productsToUpdate);
        orderRepository.save(order);

        return ResponseEntity.ok(order);
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return ResponseEntity.ok(orderRepository.findByUserOrderByCreatedAtDesc(user));
    }

    @Data
    public static class CartItemRequest {
        private UUID productId;
        private Integer quantity;
    }
}
