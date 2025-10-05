package com.shivam.OnlineExam.Service;

import com.shivam.OnlineExam.Entity.User;
import com.shivam.OnlineExam.Repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class Register {

    private final UserRepository userRepo;

    public Register(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    public User registerUser(User user) {
        if (userRepo.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepo.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        return userRepo.save(user);
    }
}
