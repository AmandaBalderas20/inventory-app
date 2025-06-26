package com.example.inventory_service.service; 

import com.example.inventory_service.dto.PageResponse;
import com.example.inventory_service.model.Product;
import com.example.inventory_service.model.InventoryMetric;
import com.example.inventory_service.repository.InMemoryProductRepository;

import jakarta.validation.Valid;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;
import java.util.Comparator;

@Service
@Validated
public class ProductService {
    private final InMemoryProductRepository repository;
    private int nextId = 1;

    public ProductService(InMemoryProductRepository repository) {
        this.repository = repository;
    }

    /**
     * Retrieves all products.
     * @return List of all products.
     */
    public Product createProduct(@Valid Product product) {
        boolean exists = repository.findAll().stream()
        .anyMatch(p -> p.getName().equalsIgnoreCase(product.getName()));

        if (exists) {
            throw new IllegalArgumentException("Product with the same name already exists.");
        }

        product.setId((long) nextId++);
        product.setCreationDate(LocalDate.now());
        product.setLastUpdatedDate(LocalDate.now());
        
        return repository.save(product);
    }

    /**
     * Retrieves all products.
     * @return List of all products.
     */
    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    /**
     * Filters products by their stock status.
     * @param name
     * @param categories
     * @param inStock
     * @return List of products that match the given stock status.
     */
    public List<Product> getFilteredProducts(String name, List<String> categories, Boolean inStock) {
        return repository.findAll().stream()
            .filter(p -> name == null || p.getName().toLowerCase().contains(name.toLowerCase()))
            .filter(p -> categories == null || categories.isEmpty() || categories.stream().anyMatch(cat -> 
                p.getCategory().toLowerCase().trim().contains(cat.toLowerCase().trim())))
            .filter(p -> inStock == null || (inStock ? p.getStockQuantity() > 0 : p.getStockQuantity() <= 0))
            .toList();
    }

    /**
     * Updates an existing product.
     * @param id The ID of the product to update.
     * @param updatedProduct The product object containing updated details.
     * @return The updated product.
     */
    public Product updateProduct(Long id, Product updatedProduct) {
        Product existing = repository.findById(id);
        if (existing == null) {
            throw new RuntimeException("Product with ID " + id + " not found.");
        }

        existing.setName(updatedProduct.getName());
        existing.setCategory(updatedProduct.getCategory());
        existing.setUnitPrice(updatedProduct.getUnitPrice());
        existing.setStockQuantity(updatedProduct.getStockQuantity());
        existing.setExpirationDate(updatedProduct.getExpirationDate());
        existing.setLastUpdatedDate(LocalDate.now());

        repository.save(existing);
        return existing;
    }

    /**
     * Deletes a product by its ID.
     * @param id The ID of the product to delete.
     */
    public void deleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new NoSuchElementException("Product with ID " + id + " not found");
        }
        repository.deleteById(id);
    }

    /**
     * Retrieves a product by its ID.
     * @param id The ID of the product to retrieve.
     * @return The product with the specified ID.
     */
    public PageResponse<Product> getPaginatedProducts(int page, int size, String sortBy1, String direction1, String sortBy2, String direction2) {
        List<Product> allProducts = this.repository.findAll();
        
        Comparator<Product> comparator = Comparator.comparing(Product::getId); // default (no-op)

        if (sortBy1 != null) {
            comparator = getComparator(sortBy1, direction1);
            if (sortBy2 != null) {
                comparator = comparator.thenComparing(getComparator(sortBy2, direction2));
            }
            allProducts = allProducts.stream().sorted(comparator).toList();
        }
        
        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, allProducts.size());

        if (fromIndex > allProducts.size()) {
            return new PageResponse<>(List.of(), page, size, allProducts.size());
        }

        List<Product> paginatedList = allProducts.subList(fromIndex, toIndex);

        return new PageResponse<>(paginatedList, page, size, allProducts.size());
    }

    /**
     * Returns a comparator based on the specified field and direction.
     * @param field The field to sort by (e.g., "name", "category", "unitPrice", etc.).
     * @param direction The direction of sorting ("asc" or "desc").
     * @return A Comparator for the Product class.
     */
    private Comparator<Product> getComparator(String field, String direction) {
        boolean asc = direction == null || direction.equalsIgnoreCase("asc");

        Comparator<Product> comparator = switch (field) {
            case "name" -> Comparator.comparing(Product::getName, String.CASE_INSENSITIVE_ORDER);
            case "category" -> Comparator.comparing(Product::getCategory, String.CASE_INSENSITIVE_ORDER);
            case "unitPrice" -> Comparator.comparing(Product::getUnitPrice);
            case "stockQuantity" -> Comparator.comparing(Product::getStockQuantity);
            case "expirationDate" -> Comparator.comparing(p -> p.getExpirationDate() != null ? p.getExpirationDate() : LocalDate.MAX);
            default -> Comparator.comparing(Product::getId); // fallback
        };

        return asc ? comparator : comparator.reversed();
    }

    /**
     * Retrieves inventory metrics grouped by product category.
     * @return List of InventoryMetric objects containing metrics for each category.
     */
    public List<InventoryMetric> getInventoryMetrics() {
        Map<String, List<Product>> grouped = repository.findAll().stream()
            .filter(p -> !p.isOutOfStock())
            .collect(Collectors.groupingBy(Product::getCategory));

        List<InventoryMetric> metrics = new ArrayList<>();

        int overallTotalProducts = 0;
        double overallTotalValue = 0;

        for (Map.Entry<String, List<Product>> entry : grouped.entrySet()) {
            String category = entry.getKey();
            List<Product> products = entry.getValue();

            int totalQty = products.stream().mapToInt(Product::getStockQuantity).sum();
            double totalValue = products.stream()
                .mapToDouble(p -> p.getUnitPrice() * p.getStockQuantity()).sum();
            double avgPrice = totalQty == 0 ? 0 : totalValue / totalQty;

            metrics.add(new InventoryMetric(category, totalQty, totalValue, avgPrice));

            overallTotalProducts += totalQty;
            overallTotalValue += totalValue;
        }

        // Adding overall metrics
        double overallAvgPrice = overallTotalProducts == 0 ? 0 : overallTotalValue / overallTotalProducts;
        metrics.add(new InventoryMetric("Overall", overallTotalProducts, overallTotalValue, overallAvgPrice));

        return metrics;
    }


}