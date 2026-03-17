package com.santamarta.api.repositories;

import com.santamarta.api.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    List<Product> findByIsPromotionTrue();
    List<Product> findByCategory_NameContainingIgnoreCase(String categoryName);
}
