package com.servicebooking.repository;

import com.servicebooking.entity.ServiceItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceItemRepository extends JpaRepository<ServiceItem, Long> {
    List<ServiceItem> findByCategoryId(Long categoryId);
    List<ServiceItem> findByIsActiveTrueAndIsFeaturedTrue();
    Page<ServiceItem> findByIsActiveTrue(Pageable pageable);
    Page<ServiceItem> findByCategoryIdAndIsActiveTrue(Long categoryId, Pageable pageable);
    
    @Query("SELECT s FROM ServiceItem s WHERE s.isActive = true AND " +
           "(LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<ServiceItem> searchServices(@Param("query") String query, Pageable pageable);
    
    @Query("SELECT s FROM ServiceItem s WHERE s.isActive = true ORDER BY s.averageRating DESC NULLS LAST")
    List<ServiceItem> findTopRatedServices(Pageable pageable);
    
    @Query("SELECT s FROM ServiceItem s WHERE s.isActive = true ORDER BY s.totalBookings DESC NULLS LAST")
    List<ServiceItem> findPopularServices(Pageable pageable);
}

