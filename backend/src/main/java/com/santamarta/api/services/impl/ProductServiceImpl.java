package com.santamarta.api.services.impl;

import com.santamarta.api.models.Product;
import com.santamarta.api.repositories.ProductRepository;
import com.santamarta.api.services.ProductService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        log.debug("Fetching all products");
        return productRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Product> getProductById(UUID id) {
        log.debug("Fetching product with id: {}", id);
        return productRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getPromotions() {
        log.debug("Fetching products with active promotions");
        return productRepository.findByIsPromotionTrue();
    }

    @Override
    @Transactional
    public Product createProduct(Product product) {
        log.info("Creating new product: {}", product.getName());
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public Product updateProduct(UUID id, Product updated) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));

        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setStock(updated.getStock());
        existing.setImageUrl(updated.getImageUrl());
        existing.setIsPromotion(updated.getIsPromotion());
        existing.setDiscountPercentage(updated.getDiscountPercentage());
        existing.setCategory(updated.getCategory());

        log.info("Updating product with id: {}", id);
        return productRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteProduct(UUID id) {
        if (!productRepository.existsById(id)) {
            throw new EntityNotFoundException("Product not found with id: " + id);
        }
        log.info("Deleting product with id: {}", id);
        productRepository.deleteById(id);
    }
}
