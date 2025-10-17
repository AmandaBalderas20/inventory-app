package com.example.inventory_service.controller;

import com.example.inventory_service.dto.PageResponse;
import com.example.inventory_service.model.InventoryMetric;
import com.example.inventory_service.model.Product;
import com.example.inventory_service.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setId(1L);
        product.setName("Leche");
        product.setCategory("Lácteos");
        product.setUnitPrice(20.0);
        product.setStockQuantity(5);
        product.setExpirationDate(LocalDate.now().plusDays(5));
    }

    private static String asJsonString(final Object obj) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
            return mapper.writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // Create Product - Success
    @Test
    void testCreateProduct_Success() throws Exception {
        given(productService.createProduct(any(Product.class))).willReturn(product);

        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(product)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Leche"));
    }

    // Create Product - IllegalArgumentException (400)
    @Test
    void testCreateProduct_BadRequest() throws Exception {
        given(productService.createProduct(any(Product.class)))
                .willThrow(new IllegalArgumentException("Duplicate product"));

        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(product)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Duplicate product"));
    }

    // Create Product - Internal Server Error (500)
    @Test
    void testCreateProduct_InternalError() throws Exception {
        given(productService.createProduct(any(Product.class)))
                .willThrow(new RuntimeException("Unexpected error"));

        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(product)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Unexpected error")));
    }

    // Get Products - Success
    @Test
    void testGetProducts_Success() throws Exception {
        given(productService.getProductsByFilters(any(), anyList(), any())).willReturn(List.of());
        mockMvc.perform(get("/products"))
                .andExpect(status().isNoContent());
    }

    // Get Products - No Content
    @Test
    void testGetProducts_NoContent() throws Exception {
        given(productService.getProductsByFilters(any(), anyList(), any())).willReturn(List.of());

        mockMvc.perform(get("/products"))
                .andExpect(status().isNoContent());
    }

    // Update Product - Success
    @Test
    void testUpdateProduct_Success() throws Exception {
        given(productService.updateProduct(eq(1L), any(Product.class))).willReturn(product);

        mockMvc.perform(put("/products/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(product)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Leche"));
    }

    // Update Product - Not Found (404)
    @Test
    void testUpdateProduct_NotFound() throws Exception {
        given(productService.updateProduct(eq(1L), any(Product.class)))
                .willThrow(new NoSuchElementException("Product not found"));

        mockMvc.perform(put("/products/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(product)))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Product not found"));
    }

    // Update Product - Bad Request (400)
    @Test
    void testUpdateProduct_BadRequest() throws Exception {
        given(productService.updateProduct(eq(1L), any(Product.class)))
                .willThrow(new IllegalArgumentException("Invalid data"));

        mockMvc.perform(put("/products/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(product)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid data"));
    }

    // Delete Product - Success
    @Test
    void testDeleteProduct_Success() throws Exception {
        mockMvc.perform(delete("/products/1"))
                .andExpect(status().isNoContent());
    }

    // Delete Product - Not Found
    @Test
    void testDeleteProduct_NotFound() throws Exception {
        doThrow(new NoSuchElementException("Product not found"))
                .when(productService).deleteById(1L);

        mockMvc.perform(delete("/products/1"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Product not found"));
    }

    // Get Paginated Products - Success
    @Test
    void testGetPaginatedProducts_Success() throws Exception {
        PageResponse<Product> page = new PageResponse<>(List.of(product), 0, 1, 1);
        given(productService.getPaginatedProducts(anyInt(), anyInt(), any(), any(), any(), any()))
                .willReturn(page);

        mockMvc.perform(get("/products/paginated?page=0&size=1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Leche"));
    }

    // Get Inventory Metrics - Success
    @Test
    void testGetInventoryMetrics_Success() throws Exception {
        InventoryMetric metric = new InventoryMetric("Lácteos", 10, 200.0, 20.0);
        given(productService.getInventoryMetrics()).willReturn(List.of(metric));

        mockMvc.perform(get("/products/metrics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].category").value("Lácteos"));
    }

    // Get Inventory Metrics - Internal Error
    @Test
    void testGetInventoryMetrics_InternalError() throws Exception {
        given(productService.getInventoryMetrics()).willThrow(new RuntimeException("Error retrieving metrics"));

        mockMvc.perform(get("/products/metrics"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Error retrieving inventory metrics")));
    }
}
