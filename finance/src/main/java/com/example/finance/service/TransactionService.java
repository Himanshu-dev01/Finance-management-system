package com.example.finance.service;

import com.example.finance.entity.Transaction;
import com.example.finance.repository.TransactionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepo repo;

    public List<Transaction> getAll() {
        return repo.findByUserId(1L);
    }

    public Transaction save(Transaction t) {
        t.setUserId(1L);
        if (t.getDate() == null) {
            t.setDate(java.time.LocalDate.now());
        }
        return repo.save(t);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public double getTotalIncome() {
        return repo.findByUserIdAndType(1L, "INCOME")
                .stream().mapToDouble(Transaction::getAmount).sum();
    }

    public double getTotalExpense() {
        return repo.findByUserIdAndType(1L, "EXPENSE")
                .stream().mapToDouble(Transaction::getAmount).sum();
    }
    public Transaction update(Long id, Transaction updated) {
        Transaction existing = repo.findById(id).orElseThrow();
        existing.setAmount(updated.getAmount());
        existing.setType(updated.getType());
        existing.setCategory(updated.getCategory());
        existing.setDescription(updated.getDescription());
        if (updated.getDate() != null) existing.setDate(updated.getDate());
        return repo.save(existing);
    }
}