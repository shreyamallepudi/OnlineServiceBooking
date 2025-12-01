package com.servicebooking.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "service_providers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceProvider {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(length = 2000)
    private String bio;
    
    private Integer experienceYears;
    
    @Column(length = 1000)
    private String skills;
    
    @Column(length = 500)
    private String certifications;
    
    private String serviceArea;
    
    private Double latitude;
    
    private Double longitude;
    
    private Integer serviceRadius;
    
    @Builder.Default
    @Column(nullable = false)
    private Boolean isAvailable = true;
    
    @Builder.Default
    @Column(nullable = false)
    private Boolean isVerified = false;
    
    private Double averageRating;
    
    private Integer totalReviews;
    
    private Integer completedJobs;
    
    private BigDecimal totalEarnings;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "provider_categories",
        joinColumns = @JoinColumn(name = "provider_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    @Builder.Default
    private Set<Category> categories = new HashSet<>();
    
    @OneToMany(mappedBy = "provider", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Booking> bookings = new ArrayList<>();
    
    @OneToMany(mappedBy = "provider", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Review> reviews = new ArrayList<>();
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}

