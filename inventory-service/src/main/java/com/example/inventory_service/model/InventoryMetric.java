package com.example.inventory_service.model;

public class InventoryMetric {
    private String category;
    private int totalProducts;
    private double totalValue;
    private double averagePrice;

    public InventoryMetric(String category, int totalProducts, double totalValue, double averagePrice) {
        this.category = category;
        this.totalProducts = totalProducts;
        this.totalValue = totalValue;
        this.averagePrice = averagePrice;
    }

    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }   
    public int getTotalProducts() {
        return totalProducts;
    }
    public void setTotalProducts(int totalProducts) {
        this.totalProducts = totalProducts;
    }   
    public double getTotalValue() {
        return totalValue;
    }
    public void setTotalValue(double totalValue) {
        this.totalValue = totalValue;
    }
    public double getAveragePrice() {
        return averagePrice;
    }

    public void setAveragePrice(double averagePrice) {
        this.averagePrice = averagePrice;
    }
}
