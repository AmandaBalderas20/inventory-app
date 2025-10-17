package com.example.inventory_service.service;

import com.example.inventory_service.dto.PageResponse;
import com.example.inventory_service.model.Product;
import com.example.inventory_service.model.InventoryMetric;
import com.example.inventory_service.repository.InMemoryProductRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for ProductService class.
 * Covers both happy and error paths to improve test coverage (>75%).
 */
public class ProductServiceTest {

    private ProductService productService;
    private InMemoryProductRepository productRepository;

    @BeforeEach
    public void setUp() {
        productRepository = new InMemoryProductRepository();
        productService = new ProductService(productRepository);
    }

    @Test
    public void givenValidProduct_whenCreateProduct_thenProductIsCreated() {
        Product p = new Product();
        p.setName("Leche");
        p.setCategory("Lácteos");
        p.setUnitPrice(20.5);
        p.setStockQuantity(10);
        p.setExpirationDate(LocalDate.now().plusDays(10));

        Product created = productService.createProduct(p);

        assertNotNull(created.getId());
        assertEquals("Leche", created.getName());
        assertEquals(1, productService.getAllProducts().size());
    }

    @Test
    public void givenDuplicateName_whenCreateProduct_thenThrowsIllegalArgumentException() {
        Product p1 = new Product();
        p1.setName("Leche");
        p1.setCategory("Lácteos");
        p1.setUnitPrice(10.0);
        p1.setStockQuantity(5);
        p1.setExpirationDate(LocalDate.now().plusDays(5));
        productService.createProduct(p1);

        Product p2 = new Product();
        p2.setName("Leche");
        p2.setCategory("Lácteos");
        p2.setUnitPrice(15.0);
        p2.setStockQuantity(8);
        p2.setExpirationDate(LocalDate.now().plusDays(5));

        assertThrows(IllegalArgumentException.class, () -> productService.createProduct(p2));
    }

    @Test
    public void givenExistingProduct_whenUpdateProduct_thenUpdatesSuccessfully() {
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

    @Test
    public void givenNonExistingId_whenUpdateProduct_thenThrowsNoSuchElementException() {
        Product updated = new Product();
        updated.setName("Cereal");
        updated.setCategory("Desayuno");
        updated.setUnitPrice(10.0);
        updated.setStockQuantity(5);
        updated.setExpirationDate(LocalDate.now().plusDays(5));

        assertThrows(NoSuchElementException.class, () -> productService.updateProduct(999L, updated));
    }

    @Test
    public void givenExistingProduct_whenDeleteById_thenProductIsDeleted() {
        Product p = new Product();
        p.setName("Yogurt");
        p.setCategory("Lácteos");
        p.setUnitPrice(12.0);
        p.setStockQuantity(6);
        p.setExpirationDate(LocalDate.now().plusDays(10));
        Product created = productService.createProduct(p);

        productService.deleteById(created.getId());
        assertTrue(productService.getAllProducts().isEmpty());
    }

    @Test
    public void givenNonExistingId_whenDeleteById_thenThrowsNoSuchElementException() {
        assertThrows(NoSuchElementException.class, () -> productService.deleteById(100L));
    }

    @Test
    public void whenGetFilteredProducts_thenReturnsMatchingResults() {
        Product p1 = new Product();
        p1.setName("Manzana");
        p1.setCategory("Frutas");
        p1.setUnitPrice(5.0);
        p1.setStockQuantity(10);
        productService.createProduct(p1);

        List<Product> filtered = productService.getFilteredProducts("Manzana", List.of("Frutas"), true);
        assertEquals(1, filtered.size());
        assertEquals("Manzana", filtered.get(0).getName());
    }

    @Test
    public void whenGetFilteredProductsWithEmptyFilters_thenReturnsAll() {
        Product p1 = new Product();
        p1.setName("Leche");
        p1.setCategory("Lácteos");
        p1.setUnitPrice(20.0);
        p1.setStockQuantity(5);
        productService.createProduct(p1);

        List<Product> all = productService.getProductsByFilters(null, null, null);
        assertEquals(1, all.size());
    }

    @Test
    public void whenGetPaginatedProducts_thenReturnsPageResults() {
        for (int i = 0; i < 5; i++) {
            Product p = new Product();
            p.setName("Prod" + i);
            p.setCategory("Cat" + i);
            p.setUnitPrice(10.0 + i);
            p.setStockQuantity(3 + i);
            productService.createProduct(p);
        }

        PageResponse<Product> page = productService.getPaginatedProducts(0, 3, "name", "asc", null, null);
        assertEquals(3, page.getContent().size());
        assertEquals(5, page.getTotalElements());
    }

    @Test
    public void whenGetInventoryMetrics_thenReturnsCategoryAndOverallMetrics() {
        Product p1 = new Product();
        p1.setName("Jugo");
        p1.setCategory("Bebidas");
        p1.setUnitPrice(8.0);
        p1.setStockQuantity(10);
        productService.createProduct(p1);

        Product p2 = new Product();
        p2.setName("Agua");
        p2.setCategory("Bebidas");
        p2.setUnitPrice(5.0);
        p2.setStockQuantity(20);
        productService.createProduct(p2);

        List<InventoryMetric> metrics = productService.getInventoryMetrics();
        assertFalse(metrics.isEmpty());
        assertTrue(metrics.stream().anyMatch(m -> m.getCategory().equals("Bebidas")));
        assertTrue(metrics.stream().anyMatch(m -> m.getCategory().equals("Overall")));
    }
}
