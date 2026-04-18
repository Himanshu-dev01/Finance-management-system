package com.example.finance.service;

import com.example.finance.entity.Budget;
import com.example.finance.repository.BudgetRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepo repo;

    public List<Budget> getAll() {
        return repo.findByUserId(1L);
    }

    public Budget save(Budget b) {
        b.setUserId(1L);
        return repo.save(b);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}