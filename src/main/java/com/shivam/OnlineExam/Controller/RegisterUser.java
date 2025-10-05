package com.shivam.OnlineExam.Controller;

import com.shivam.OnlineExam.Entity.User;
import com.shivam.OnlineExam.Service.Register;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowedHeaders = "*") // More permissive for development
public class RegisterUser {

    private final Register registerService;

    public RegisterUser(Register registerService) {
        this.registerService = registerService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            System.out.println("Received registration request for: " + user.getEmail());
            System.out.println("User data: " + user.toString());

            User saved = registerService.registerUser(user);

            System.out.println("User registered successfully with ID: " + saved.getId());
            return ResponseEntity.ok(saved);

        } catch (RuntimeException e) {
            System.out.println("Registration error: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}