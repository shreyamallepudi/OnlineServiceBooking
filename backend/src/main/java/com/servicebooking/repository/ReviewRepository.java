package com.servicebooking.repository;

import com.servicebooking.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findByBookingId(Long bookingId);
    
    Page<Review> findByProviderIdAndIsVisibleTrue(Long providerId, Pageable pageable);
    
    Page<Review> findByCustomerId(Long customerId, Pageable pageable);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.provider.id = :providerId AND r.isVisible = true")
    Double getAverageRatingByProvider(@Param("providerId") Long providerId);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.provider.id = :providerId AND r.isVisible = true")
    Long countByProviderId(@Param("providerId") Long providerId);
}

