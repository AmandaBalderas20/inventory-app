package com.example.inventory_service.repository;
import com.example.inventory_service.model.Product;

import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class InMemoryProductRepository {

    private final Map<Long, Product> storage = new HashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public Product save(Product product) {
        if (product.getId() == null) {
            product.setId(idGenerator.getAndIncrement());
        }
        storage.put(product.getId(), product);
        return product;
    }

    public Product findById(Long id) {
        return storage.get(id);
    }

    public List<Product> findAll() {
        return new ArrayList<>(storage.values());
    }

    public void deleteById(Long id) {
        storage.remove(id);
    }

    public void clear() {
        storage.clear();
    }

    public boolean existsById(Long id) {
        return storage.containsKey(id);
    }

}
