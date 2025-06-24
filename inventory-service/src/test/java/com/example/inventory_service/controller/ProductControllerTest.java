package com.example.inventory_service.controller;


import com.example.inventory_service.model.Product;
import com.example.inventory_service.repository.InMemoryProductRepository;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(ProductController.class)
public class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService; // inyectado por el controller

    private Product product;

    @BeforeEach
    public void setUp() {
        product = new Product();
        product.setId(1L);
        product.setName("Leche");
        product.setCategory("Lácteos");
        product.setUnitPrice(20.0);
        product.setStockQuantity(5);
        product.setExpirationDate(LocalDate.now().plusDays(5));
    }

    @Test
    public void testCreateProduct() throws Exception {
        given(productService.createProduct(any(Product.class))).willReturn(product);

        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(product)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value("Leche"))
            .andExpect(jsonPath("$.category").value("Lácteos"));
    }

    @Test
    public void testGetAllProducts() throws Exception {
        given(productService.getAllProducts()).willReturn(List.of(product));

        mockMvc.perform(get("/products"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(1))
            .andExpect(jsonPath("$[0].name").value("Leche"));
    }

    // Utilidad para convertir objeto a JSON
    
    private static String asJsonString(final Object obj) {
    try {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
        return mapper.writeValueAsString(obj);
    } catch (Exception e) {
        throw new RuntimeException(e);
    }
}

}
