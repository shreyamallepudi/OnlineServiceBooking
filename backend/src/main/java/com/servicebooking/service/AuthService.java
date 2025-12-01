package com.servicebooking.service;

import com.servicebooking.dto.auth.AuthResponse;
import com.servicebooking.dto.auth.LoginRequest;
import com.servicebooking.dto.auth.RegisterRequest;
import com.servicebooking.dto.user.UserDTO;
import com.servicebooking.entity.ServiceProvider;
import com.servicebooking.entity.User;
import com.servicebooking.enums.Role;
import com.servicebooking.exception.BadRequestException;
import com.servicebooking.repository.ServiceProviderRepository;
import com.servicebooking.repository.UserRepository;
import com.servicebooking.security.JwtTokenProvider;
import com.servicebooking.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class AuthService {
    
    private final UserRepository userRepository;
    private final ServiceProviderRepository providerRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }
        
        if (request.getPhone() != null && userRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("Phone number is already registered");
        }
        
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .zipCode(request.getZipCode())
                .role(request.getRole())
                .isActive(true)
                .isVerified(false)
                .build();
        
        user = userRepository.save(user);
        
        if (request.getRole() == Role.PROVIDER) {
            ServiceProvider provider = ServiceProvider.builder()
                    .user(user)
                    .isAvailable(true)
                    .isVerified(false)
                    .averageRating(0.0)
                    .totalReviews(0)
                    .completedJobs(0)
                    .totalEarnings(BigDecimal.ZERO)
                    .build();
            providerRepository.save(provider);
        }
        
        String token = tokenProvider.generateTokenFromUserId(user.getId());
        
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(mapToUserDTO(user))
                .build();
    }
    
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new BadRequestException("User not found"));
        
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(mapToUserDTO(user))
                .build();
    }
    
    public UserDTO getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new BadRequestException("User not found"));
        
        return mapToUserDTO(user);
    }
    
    private UserDTO mapToUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .profileImage(user.getProfileImage())
                .address(user.getAddress())
                .city(user.getCity())
                .state(user.getState())
                .zipCode(user.getZipCode())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .isVerified(user.getIsVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }
}

