package com.servicebooking.config;

import com.servicebooking.entity.*;
import com.servicebooking.enums.Role;
import com.servicebooking.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
@SuppressWarnings("null")
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final ServiceProviderRepository providerRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() == 0) {
            log.info("Initializing sample data...");
            initializeData();
            log.info("Sample data initialized successfully!");
        }
    }
    
    private void initializeData() {
        User admin = User.builder()
                .firstName("Admin")
                .lastName("User")
                .email("admin@servicebook.com")
                .password(passwordEncoder.encode("admin123"))
                .phone("+1234567890")
                .role(Role.ADMIN)
                .isActive(true)
                .isVerified(true)
                .build();
        userRepository.save(admin);
        
        User customer = User.builder()
                .firstName("John")
                .lastName("Doe")
                .email("customer@example.com")
                .password(passwordEncoder.encode("customer123"))
                .phone("+1234567891")
                .address("123 Main Street")
                .city("New York")
                .state("NY")
                .zipCode("10001")
                .role(Role.CUSTOMER)
                .isActive(true)
                .isVerified(true)
                .build();
        userRepository.save(customer);
        
        Category cleaning = createCategory("Home Cleaning", "Professional cleaning services for your home", 
                "clean", "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400", 1);
        Category plumbing = createCategory("Plumbing", "Expert plumbing solutions", 
                "build", "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400", 2);
        Category electrical = createCategory("Electrical", "Licensed electrical services", 
                "thunderbolt", "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400", 3);
        Category beauty = createCategory("Beauty & Spa", "Salon services at your doorstep", 
                "heart", "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400", 4);
        Category repair = createCategory("Appliance Repair", "Fix your home appliances", 
                "tool", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", 5);
        Category painting = createCategory("Painting", "Professional painting services", 
                "bg-colors", "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400", 6);
        Category pest = createCategory("Pest Control", "Keep your home pest-free", 
                "bug", "https://images.unsplash.com/photo-1632935190767-527a2a0c3e46?w=400", 7);
        Category carpentry = createCategory("Carpentry", "Custom woodwork solutions", 
                "tool", "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400", 8);
        
        createService("Deep Home Cleaning", "Complete deep cleaning of your entire home including all rooms, kitchen, and bathrooms", 
                new BigDecimal("149.99"), 180, cleaning, true,
                Arrays.asList("All rooms cleaned", "Kitchen deep clean", "Bathroom sanitization", "Floor mopping"));
        createService("Kitchen Cleaning", "Thorough kitchen cleaning including appliances and cabinets", 
                new BigDecimal("79.99"), 90, cleaning, true,
                Arrays.asList("Appliance cleaning", "Cabinet wipe-down", "Counter sanitization", "Floor cleaning"));
        createService("Bathroom Deep Clean", "Complete bathroom sanitization and cleaning", 
                new BigDecimal("59.99"), 60, cleaning, false,
                Arrays.asList("Toilet sanitization", "Shower cleaning", "Mirror polish", "Floor scrubbing"));
        createService("Office Cleaning", "Professional office space cleaning", 
                new BigDecimal("199.99"), 240, cleaning, false,
                Arrays.asList("Desk cleaning", "Floor vacuuming", "Trash removal", "Window cleaning"));
        
        createService("Leak Repair", "Fix any water leaks in your home", 
                new BigDecimal("89.99"), 60, plumbing, true,
                Arrays.asList("Leak detection", "Pipe repair", "Quality parts", "Cleanup included"));
        createService("Drain Cleaning", "Professional drain unclogging service", 
                new BigDecimal("69.99"), 45, plumbing, true,
                Arrays.asList("High-pressure cleaning", "Camera inspection", "Clog removal", "Preventive treatment"));
        createService("Water Heater Installation", "Install or replace water heaters", 
                new BigDecimal("299.99"), 180, plumbing, false,
                Arrays.asList("Old unit removal", "New installation", "Testing", "Warranty included"));
        createService("Toilet Repair", "Fix toilet issues quickly", 
                new BigDecimal("79.99"), 60, plumbing, false,
                Arrays.asList("Flush repair", "Leak fix", "Part replacement", "Testing"));
        
        createService("Wiring Repair", "Fix electrical wiring issues", 
                new BigDecimal("129.99"), 90, electrical, true,
                Arrays.asList("Wire inspection", "Safe repairs", "Code compliant", "Testing included"));
        createService("Light Installation", "Install new light fixtures", 
                new BigDecimal("79.99"), 60, electrical, true,
                Arrays.asList("Fixture mounting", "Wiring connection", "Switch setup", "Testing"));
        createService("Ceiling Fan Installation", "Professional ceiling fan installation", 
                new BigDecimal("99.99"), 90, electrical, false,
                Arrays.asList("Fan assembly", "Secure mounting", "Wiring", "Speed testing"));
        createService("Electrical Panel Upgrade", "Upgrade your electrical panel", 
                new BigDecimal("499.99"), 240, electrical, false,
                Arrays.asList("Panel replacement", "Circuit setup", "Safety inspection", "Permit handling"));
        
        createService("Haircut & Styling", "Professional haircut at your location", 
                new BigDecimal("49.99"), 45, beauty, true,
                Arrays.asList("Consultation", "Precision cut", "Styling", "Hair care tips"));
        createService("Facial Treatment", "Rejuvenating facial spa treatment", 
                new BigDecimal("79.99"), 60, beauty, true,
                Arrays.asList("Skin analysis", "Deep cleansing", "Massage", "Mask treatment"));
        createService("Manicure & Pedicure", "Complete nail care service", 
                new BigDecimal("59.99"), 75, beauty, false,
                Arrays.asList("Nail shaping", "Cuticle care", "Polish application", "Hand massage"));
        createService("Full Body Massage", "Relaxing full body massage therapy", 
                new BigDecimal("99.99"), 90, beauty, true,
                Arrays.asList("Swedish technique", "Aromatherapy", "Hot towels", "Deep relaxation"));
        
        createService("AC Repair", "Air conditioner repair and maintenance", 
                new BigDecimal("99.99"), 90, repair, true,
                Arrays.asList("Diagnosis", "Gas refill", "Filter cleaning", "Performance test"));
        createService("Refrigerator Repair", "Fix refrigerator issues", 
                new BigDecimal("89.99"), 90, repair, true,
                Arrays.asList("Cooling issues", "Compressor check", "Thermostat repair", "Seal replacement"));
        createService("Washing Machine Repair", "Washing machine service and repair", 
                new BigDecimal("79.99"), 75, repair, false,
                Arrays.asList("Drum issues", "Motor check", "Drain problems", "Testing"));
        createService("Microwave Repair", "Microwave oven repair service", 
                new BigDecimal("59.99"), 45, repair, false,
                Arrays.asList("Heating issues", "Door repair", "Turntable fix", "Safety check"));
        
        createService("Interior Painting", "Professional interior wall painting", 
                new BigDecimal("299.99"), 480, painting, true,
                Arrays.asList("Wall preparation", "Premium paint", "Multiple coats", "Clean finish"));
        createService("Exterior Painting", "Outdoor and exterior painting", 
                new BigDecimal("499.99"), 600, painting, true,
                Arrays.asList("Surface prep", "Weather-resistant paint", "Professional finish", "Cleanup"));
        createService("Door & Window Painting", "Paint doors and window frames", 
                new BigDecimal("99.99"), 120, painting, false,
                Arrays.asList("Sanding", "Primer application", "Quality paint", "Smooth finish"));
        
        createService("General Pest Control", "Treatment for common household pests", 
                new BigDecimal("129.99"), 90, pest, true,
                Arrays.asList("Inspection", "Treatment spray", "Entry point sealing", "Follow-up"));
        createService("Termite Treatment", "Comprehensive termite control", 
                new BigDecimal("299.99"), 180, pest, true,
                Arrays.asList("Inspection", "Treatment", "Prevention", "Warranty"));
        createService("Cockroach Control", "Eliminate cockroach infestation", 
                new BigDecimal("89.99"), 60, pest, false,
                Arrays.asList("Gel treatment", "Spray treatment", "Entry sealing", "Prevention tips"));
        
        createService("Furniture Assembly", "Assemble any furniture items", 
                new BigDecimal("69.99"), 90, carpentry, true,
                Arrays.asList("All types of furniture", "Tools included", "Proper assembly", "Cleanup"));
        createService("Cabinet Installation", "Install kitchen or storage cabinets", 
                new BigDecimal("199.99"), 180, carpentry, true,
                Arrays.asList("Measurements", "Installation", "Level adjustment", "Hardware setup"));
        createService("Door Repair", "Fix or replace doors", 
                new BigDecimal("89.99"), 90, carpentry, false,
                Arrays.asList("Hinge repair", "Lock installation", "Frame adjustment", "Finishing"));
        
        createProviderWithProfile("Sarah", "Johnson", "provider1@example.com", 
                "Expert cleaner with 5 years of experience", 5, "New York", cleaning, plumbing);
        createProviderWithProfile("Mike", "Williams", "provider2@example.com", 
                "Licensed electrician and plumber", 8, "New York", electrical, plumbing);
        createProviderWithProfile("Emily", "Davis", "provider3@example.com", 
                "Professional beautician", 6, "New York", beauty);
        createProviderWithProfile("James", "Brown", "provider4@example.com", 
                "Appliance repair specialist", 10, "New York", repair);
        createProviderWithProfile("Lisa", "Martinez", "provider5@example.com", 
                "Master painter with attention to detail", 7, "New York", painting);
    }
    
    private Category createCategory(String name, String description, String icon, String image, int order) {
        Category category = Category.builder()
                .name(name)
                .description(description)
                .icon(icon)
                .image(image)
                .displayOrder(order)
                .isActive(true)
                .build();
        return categoryRepository.save(category);
    }
    
    private ServiceItem createService(String name, String description, BigDecimal price, 
                                       int duration, Category category, boolean featured, List<String> features) {
        ServiceItem service = ServiceItem.builder()
                .name(name)
                .description(description)
                .basePrice(price)
                .durationMinutes(duration)
                .category(category)
                .isFeatured(featured)
                .isActive(true)
                .features(String.join(",", features))
                .averageRating(4.0 + Math.random())
                .totalBookings((int) (Math.random() * 100))
                .build();
        return serviceItemRepository.save(service);
    }
    
    private void createProviderWithProfile(String firstName, String lastName, String email,
                                           String bio, int experience, String area, Category... categories) {
        User user = User.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .password(passwordEncoder.encode("provider123"))
                .phone("+1" + (1000000000L + (long)(Math.random() * 9000000000L)))
                .role(Role.PROVIDER)
                .isActive(true)
                .isVerified(true)
                .build();
        user = userRepository.save(user);
        
        ServiceProvider provider = ServiceProvider.builder()
                .user(user)
                .bio(bio)
                .experienceYears(experience)
                .serviceArea(area)
                .serviceRadius(25)
                .isAvailable(true)
                .isVerified(true)
                .averageRating(4.0 + Math.random())
                .totalReviews((int) (Math.random() * 50))
                .completedJobs((int) (Math.random() * 200))
                .totalEarnings(BigDecimal.valueOf(Math.random() * 50000))
                .categories(new HashSet<>(Arrays.asList(categories)))
                .build();
        providerRepository.save(provider);
    }
}

