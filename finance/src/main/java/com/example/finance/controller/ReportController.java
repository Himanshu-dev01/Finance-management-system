package com.example.finance.controller;

import com.example.finance.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5173")
public class ReportController {

    @Autowired
    private TransactionService service;

    @GetMapping("/summary")
    public Map<String, Double> getSummary() {
        double income  = service.getTotalIncome();
        double expense = service.getTotalExpense();
        double savings = income - expense;
        return Map.of(
                "totalIncome",  income,
                "totalExpense", expense,
                "totalSavings", savings
        );
    }
}