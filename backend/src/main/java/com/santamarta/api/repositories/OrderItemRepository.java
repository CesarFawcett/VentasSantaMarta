package com.santamarta.api.repositories;

import com.santamarta.api.models.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {
}
