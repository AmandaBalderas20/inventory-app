package com.example.inventory_service.exception;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = ExceptionTestController.class)
@Import(RestExceptionHandler.class) // Import the exception handler to test it
public class RestExceptionHandlerTest {

    // MockMvc permits making HTTP requests to the controller
    @Autowired
    private MockMvc mockMvc;

    // Test for handling MethodArgumentNotValidException
    @Test
    void whenNoSuchElement_thenReturns404() throws Exception {
        mockMvc.perform(get("/test/not-found"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Product not found"));
    }

    // Test for handling IllegalArgumentException
    @Test
    void whenIllegalArgument_thenReturns400() throws Exception {
        mockMvc.perform(get("/test/illegal-arg"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Invalid product ID"));
    }

    // Test for handling MethodArgumentNotValidException
    @Test
    void whenValidationFails_thenReturns400AndFieldErrors() throws Exception {
        String invalidJson = "{}"; // empty JSON to trigger validation error

        mockMvc.perform(post("/test/validation")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.name").value("must not be blank")); 
    }
}
