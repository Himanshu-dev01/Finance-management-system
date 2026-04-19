package com.example.finance;

import com.example.finance.entity.Transaction;
import com.example.finance.repository.TransactionRepo;
import com.example.finance.service.TransactionService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepo repo;

    @InjectMocks
    private TransactionService service;

    @Test
    void testGetAllReturnsTransactions() {
        Transaction t = new Transaction();
        t.setAmount(5000);
        t.setType("INCOME");
        t.setCategory("Salary");
        t.setDescription("Monthly salary");

        when(repo.findByUserId(1L)).thenReturn(List.of(t));

        List<Transaction> result = service.getAll();

        assertEquals(1, result.size());
        assertEquals("INCOME", result.get(0).getType());
        verify(repo, times(1)).findByUserId(1L);
    }

    @Test
    void testSaveSetsUserIdAndDate() {
        Transaction t = new Transaction();
        t.setAmount(2000);
        t.setType("EXPENSE");
        t.setCategory("Food");
        t.setDescription("Groceries");

        when(repo.save(any(Transaction.class))).thenReturn(t);

        Transaction saved = service.save(t);

        assertEquals(1L, t.getUserId());
        assertNotNull(t.getDate());
        verify(repo, times(1)).save(t);
    }

    @Test
    void testGetTotalIncomeCalculatesCorrectly() {
        Transaction t1 = new Transaction();
        t1.setAmount(10000); t1.setType("INCOME");

        Transaction t2 = new Transaction();
        t2.setAmount(5000); t2.setType("INCOME");

        when(repo.findByUserIdAndType(1L, "INCOME")).thenReturn(List.of(t1, t2));

        double total = service.getTotalIncome();

        assertEquals(15000, total);
    }
}
