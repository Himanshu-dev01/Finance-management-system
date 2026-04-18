package com.example.finance.service;

import com.example.finance.entity.User;
import com.example.finance.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepo repo;

    public User getDefaultUser() {
        return repo.findById(1L).orElse(null);
    }
}