package com.example.inventory_service.service;

import com.example.inventory_service.model.Product;
import com.example.inventory_service.repository.InMemoryProductRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

public class ProductServiceTest {

    private ProductService productService;
    private InMemoryProductRepository productRepository;

    @BeforeEach
    public void setUp() {
        productRepository = new InMemoryProductRepository();
        productService = new ProductService(productRepository);
    }

    @Test
    public void testCreateProduct() {
        Product p = new Product();
        p.setName("Leche");
        p.setCategory("Lácteos");
        p.setUnitPrice(20.5);
        p.setStockQuantity(10);
        p.setExpirationDate(LocalDate.now().plusDays(10));

        Product created = productService.createProduct(p);

        assertNotNull(created.getId());
        assertEquals("Leche", created.getName());
        assertFalse(created.isOutOfStock());
        assertEquals(1, productService.getAllProducts().size());
    }

    @Test
    public void testUpdateProduct() {
        Product p = new Product();
        p.setName("Pan");
        p.setCategory("Panadería");
        p.setUnitPrice(15.0);
        p.setStockQuantity(5);
        p.setExpirationDate(LocalDate.now().plusDays(5));

        Product created = productService.createProduct(p);
        Long id = created.getId();

        Product updated = new Product();
        updated.setName("Pan Integral");
        updated.setCategory("Panadería");
        updated.setUnitPrice(18.0);
        updated.setStockQuantity(12);
        updated.setExpirationDate(LocalDate.now().plusDays(7));

        Product result = productService.updateProduct(id, updated);

        assertEquals("Pan Integral", result.getName());
        assertEquals(18.0, result.getUnitPrice());
        assertEquals(12, result.getStockQuantity());
    }
}
