package com.example.finance.controller;

import com.example.finance.entity.Budget;
import com.example.finance.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "http://localhost:5173")
public class BudgetController {

    @Autowired
    private BudgetService service;

    @GetMapping
    public List<Budget> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Budget create(@RequestBody Budget b) {
        return service.save(b);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}