package com.example.inventory_service.model;

import java.time.LocalDate;
import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Product {
    private Long id;

    @NotBlank(message = "Product name must not be empty")
    @Size(max = 120, message = "Product name must not exceed 120 characters")
    private String name;
    
    @NotBlank(message = "Product category is required")
    private String category;

    @NotNull(message = "Product unit price is required")
    @PositiveOrZero(message = "Product unit price must be zero or positive")
    private double unitPrice;

    @FutureOrPresent(message = "Product expiration date must be today or in the future")
    private LocalDate expirationDate;
    
    @NotNull(message = "Quantity Stock is required")
    @Min(value = 0, message = "Product unit price cannot be negative")
    private int stockQuantity;
    
    private LocalDate creationDate;
    
    private LocalDate lastUpdatedDate;
    
    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }

    public int getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(int stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public LocalDate getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }

    public LocalDate getLastUpdatedDate() {
        return lastUpdatedDate;
    }

    public void setLastUpdatedDate(LocalDate lastUpdatedDate) {
        this.lastUpdatedDate = lastUpdatedDate;
    }

    @JsonProperty("outOfStock")
    public boolean isOutOfStock() {
        return stockQuantity == 0;
    }

}