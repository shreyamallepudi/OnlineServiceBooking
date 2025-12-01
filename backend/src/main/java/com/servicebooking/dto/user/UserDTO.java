package com.servicebooking.dto.user;

import com.servicebooking.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String phone;
    private String profileImage;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private Role role;
    private Boolean isActive;
    private Boolean isVerified;
    private LocalDateTime createdAt;
}

