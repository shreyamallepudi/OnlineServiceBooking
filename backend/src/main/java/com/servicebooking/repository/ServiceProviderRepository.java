package com.servicebooking.repository;

import com.servicebooking.entity.ServiceProvider;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceProviderRepository extends JpaRepository<ServiceProvider, Long> {
    Optional<ServiceProvider> findByUserId(Long userId);
    
    List<ServiceProvider> findByIsAvailableTrueAndIsVerifiedTrue();
    
    @Query("SELECT sp FROM ServiceProvider sp WHERE sp.isAvailable = true AND sp.isVerified = true ORDER BY sp.averageRating DESC NULLS LAST")
    List<ServiceProvider> findTopRatedProviders(Pageable pageable);
    
    @Query("SELECT sp FROM ServiceProvider sp JOIN sp.categories c WHERE c.id = :categoryId AND sp.isAvailable = true AND sp.isVerified = true")
    Page<ServiceProvider> findByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);
    
    @Query("SELECT sp FROM ServiceProvider sp WHERE sp.isAvailable = true AND sp.isVerified = true AND sp.serviceArea LIKE %:area%")
    List<ServiceProvider> findByServiceArea(@Param("area") String area);
}

