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

    // This method runs before each test to set up the initial state of the product repository and service
    @BeforeEach
    public void setUp() {
        productRepository = new InMemoryProductRepository();
        productService = new ProductService(productRepository);
    }

    // Test to verify that the service can create a product
    @Test
    public void testCreateProduct() {
        Product p = new Product();

        // Setting product details
        p.setName("Leche");
        p.setCategory("Lácteos");
        p.setUnitPrice(20.5);
        p.setStockQuantity(10);
        p.setExpirationDate(LocalDate.now().plusDays(10));

        Product created = productService.createProduct(p);

        // Assertions to verify the product was created correctly
        assertNotNull(created.getId());
        assertEquals("Leche", created.getName());
        assertFalse(created.isOutOfStock());
        assertEquals(1, productService.getAllProducts().size());
    }

    // Test to verify that the service can retrieve all products
    @Test
    public void testUpdateProduct() {
        Product p = new Product();
        p.setName("Pan");
        p.setCategory("Panadería");
        p.setUnitPrice(15.0);
        p.setStockQuantity(5);
        p.setExpirationDate(LocalDate.now().plusDays(5));

        // Create a product to update
        Product created = productService.createProduct(p);
        Long id = created.getId();

        // Update the product details
        Product updated = new Product();
        updated.setName("Pan Integral");
        updated.setCategory("Panadería");
        updated.setUnitPrice(18.0);
        updated.setStockQuantity(12);
        updated.setExpirationDate(LocalDate.now().plusDays(7));

        Product result = productService.updateProduct(id, updated);

        // Assertions to verify the product was updated correctly
        assertEquals("Pan Integral", result.getName());
        assertEquals(18.0, result.getUnitPrice());
        assertEquals(12, result.getStockQuantity());
    }
}
