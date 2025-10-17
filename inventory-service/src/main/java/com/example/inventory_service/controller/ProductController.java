package com.example.inventory_service.controller;

import com.example.inventory_service.model.InventoryMetric;
import com.example.inventory_service.model.Product;
import com.example.inventory_service.service.ProductService;
import com.example.inventory_service.dto.PageResponse;

import jakarta.validation.Valid;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller class for handling product-related API endpoints.
 */
@RestController
@RequestMapping("/products")
public class ProductController {
    private final ProductService productService;

    /**
     * Constructor for ProductController.
     *
     * @param productService the service to handle product operations
     */
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * Creates a new product.
     *
     * @param product the product to create
     * @return the created product
     */
    @PostMapping
    public ResponseEntity<?> createProduct(@Valid @RequestBody Product product) {
        try {
            Product created = productService.createProduct(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Unexpected error while creating product: " + e.getMessage());
        }
    }

    /**
     * Retrieves all products or filters them based on the provided parameters.
     *
     * @param name      the name of the product to filter by (optional)
     * @param category  the category of the product to filter by (optional)
     * @param inStock   whether to filter products that are in stock (optional)
     * @return a list of products matching the criteria
     */
    @GetMapping
    public ResponseEntity<?> getProducts(
        @RequestParam(required = false) String name,
        @RequestParam(required = false) List<String> category,
        @RequestParam(required = false) Boolean inStock
    ) {
        try {
            List<Product> products = productService.getProductsByFilters(name, category, inStock);
            if (products.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Error retrieving products: " + e.getMessage());
        }
    }

    /**
     * Updates a product by its ID.
     *
     * @param id the ID of the product to update
     * @param updatedProduct the new product data
     * @return the updated product
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @Valid @RequestBody Product updatedProduct) {
        try {
            Product updated = productService.updateProduct(id, updatedProduct);
            return ResponseEntity.ok(updated);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Unexpected error while updating product: " + e.getMessage());
        }
    }

    /**
     * Deletes a product by its ID.
     *
     * @param id the ID of the product to delete
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Error deleting product: " + e.getMessage());
        }
    }

    /**
     * Retrieves a paginated list of products.
     *
     * @param page the page number to retrieve (0-based)
     * @param size the number of products per page
     * @return a PageResponse containing the products for the specified page
     */
    @GetMapping("/paginated")
    public ResponseEntity<?> getPaginatedProducts(
        @RequestParam int page,
        @RequestParam int size,
        @RequestParam(required = false) String sortBy1,
        @RequestParam(required = false) String direction1,
        @RequestParam(required = false) String sortBy2,
        @RequestParam(required = false) String direction2
    ) {
        try {
            PageResponse<Product> response = productService.getPaginatedProducts(page, size, sortBy1, direction1, sortBy2, direction2);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Error retrieving paginated products: " + e.getMessage());
        }
    }

    /**
     * Retrieves inventory metrics such as total quantity and average prices grouped by category.
     *
     * @return a list of InventoryMetric objects containing the calculated metrics
     */
    @GetMapping("/metrics")
    public ResponseEntity<?> getInventoryMetrics() {
        try {
            List<InventoryMetric> metrics = productService.getInventoryMetrics();
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Error retrieving inventory metrics: " + e.getMessage());
        }
    }
}
