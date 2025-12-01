package com.servicebooking.repository;

import com.servicebooking.entity.Payment;
import com.servicebooking.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByTransactionId(String transactionId);
    
    Optional<Payment> findByBookingId(Long bookingId);
    
    Page<Payment> findByCustomerId(Long customerId, Pageable pageable);
    
    Page<Payment> findByStatus(PaymentStatus status, Pageable pageable);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED' AND p.booking.provider.id = :providerId")
    BigDecimal getTotalEarningsByProvider(@Param("providerId") Long providerId);
}

