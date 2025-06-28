package com.example.inventory_service.repository;

import com.example.inventory_service.model.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class InMemoryProductRepositoryTest {

    private InMemoryProductRepository repository;


    @BeforeEach
    void setup() {
        repository = new InMemoryProductRepository();
    }

    @Test
    void saveAssignsIdWhenNull() {
        Product p = new Product();
        p.setId(null);
        p.setName("Test Product");
        p.setCategory("Category A");
        p.setStockQuantity(5);

        Product saved = repository.save(p);

        assertNotNull(saved.getId(), "ID should be assigned when null");
        assertEquals(p, saved, "Saved product should be same as input");
    }

    @Test
    void findByIdReturnsProduct() {
        Product p = new Product();
        p.setId(null);
        p.setName("Test Product");
        p.setCategory("Category A");
        p.setStockQuantity(5);

        Product saved = repository.save(p);

        Product found = repository.findById(saved.getId());
        assertEquals(saved, found, "findById should return the saved product");
    }

    @Test
    void findByIdReturnsNullIfNotFound() {
        assertNull(repository.findById(999L), "findById should return null if product not found");
    }

    @Test
    void deleteByIdRemovesProduct() {
        Product p = new Product();
        p.setId(null);
        p.setName("Test Product");
        p.setCategory("Category A");
        p.setStockQuantity(5);
        
        Product saved = repository.save(p);

        repository.deleteById(saved.getId());
        assertNull(repository.findById(saved.getId()), "Product should be deleted");
    }

    @Test
    void existsByIdWorks() {
        Product p = new Product();
        p.setId(null);
        p.setName("Test Product");
        p.setCategory("Category A");
        p.setStockQuantity(5);
        
        Product saved = repository.save(p);

        assertTrue(repository.existsById(saved.getId()), "existsById should return true for existing product");
        assertFalse(repository.existsById(999L), "existsById should return false for non-existing product");
    }

    @Test
    void clearRemovesAll() {
        Product p = new Product();
        p.setId(null);
        p.setName("Test Product A");
        p.setCategory("Category A");
        p.setStockQuantity(10);

        repository.save(p);

        Product p2 = new Product();
        p2.setId(null);
        p2.setName("Test Product B");
        p2.setCategory("Category B");
        p2.setStockQuantity(20);
        
        repository.save(p2);

        repository.clear();
        assertTrue(repository.findAll().isEmpty(), "Repository should be empty after clear");
    }

    @Test
    void findAllReturnsAllProducts() {
        repository.clear();
        
        Product p = new Product();
        p.setId(null);
        p.setName("Test Product A");
        p.setCategory("Category A");
        p.setStockQuantity(10);

        repository.save(p);

        Product p2 = new Product();
        p2.setId(null);
        p2.setName("Test Product B");
        p2.setCategory("Category B");
        p2.setStockQuantity(20);
        
        repository.save(p2);

        var all = repository.findAll();
        assertEquals(2, all.size(), "findAll should return all saved products");
        assertTrue(all.contains(p), "findAll should contain first product");
        assertTrue(all.contains(p2), "findAll should contain second product");
    }
}
