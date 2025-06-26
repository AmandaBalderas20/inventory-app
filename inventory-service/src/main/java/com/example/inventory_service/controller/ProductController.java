package com.example.inventory_service.controller;
import com.example.inventory_service.model.InventoryMetric;
import com.example.inventory_service.model.Product;
import com.example.inventory_service.service.ProductService;
import com.example.inventory_service.dto.PageResponse;


import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

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
    @ResponseStatus(HttpStatus.CREATED)
    public Product createProduct(@Valid @RequestBody Product product) {
        return productService.createProduct(product);
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
    public List<Product> getProducts(
        @RequestParam(required = false) String name,
        @RequestParam(required = false) List<String> category,
        @RequestParam(required = false) Boolean inStock
    ) {
        if (name == null && (category == null || category.isEmpty()) && inStock == null) {
            return productService.getAllProducts();
        }
        return productService.getFilteredProducts(name, category, inStock);
    }

    /**
     * Retrieves a product by its ID.
     *
     * @param id the ID of the product to retrieve
     * @return the product with the specified ID
     */
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @Valid @RequestBody Product updatedProduct) {
        return productService.updateProduct(id, updatedProduct);
    }

    /**
     * Deletes a product by its ID.
     *
     * @param id the ID of the product to delete
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteById(id);
    }

    /**
     * Retrieves a paginated list of products.
     *
     * @param page the page number to retrieve (0-based)
     * @param size the number of products per page
     * @return a PageResponse containing the products for the specified page
     */
    @GetMapping("/paginated")
    public PageResponse<Product> getPaginatedProducts(
        @RequestParam int page,
        @RequestParam int size
    ) {
        return productService.getPaginatedProducts(page, size);
    }

    @GetMapping("/metrics")
        public List<InventoryMetric> getInventoryMetrics() {
            return productService.getInventoryMetrics();
    }


}
