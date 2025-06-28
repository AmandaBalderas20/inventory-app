package com.example.inventory_service.exception;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
@RequestMapping("/test")
public class ExceptionTestController {

    @GetMapping("/not-found")
    public String throwNotFound() {
        throw new NoSuchElementException("Product not found");
    }

    @GetMapping("/illegal-arg")
    public String throwIllegalArgument() {
        throw new IllegalArgumentException("Invalid product ID");
    }

    @PostMapping("/validation")
    public String validateInput(@RequestBody @Valid DummyInput input) {
        return "OK";
    }

    public static class DummyInput {
        @NotBlank(message = "must not be blank")
        public String name;
    }
}
