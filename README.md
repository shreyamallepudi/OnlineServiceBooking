# 🚀 ServiceBook - Online Service Booking System

A modern, full-stack Online Service Booking platform inspired by Urban Company, built with **Spring Boot**, **MySQL**, and **Angular + NG-Zorro**. This system allows customers to book home services like cleaning, plumbing, electrical work, beauty services, and more.

![ServiceBook Banner](https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800)

## ✨ Features

### For Customers
- 🔍 Browse and search services by category
- 📅 Easy appointment booking with date/time selection
- 📱 Track booking status in real-time
- ⭐ Rate and review service providers
- 👤 User profile management

### For Service Providers
- 📊 Dashboard with earnings and performance metrics
- ✅ Accept/reject booking requests
- 📈 View ratings and reviews
- 🔄 Toggle availability status
- 📋 Manage service categories

### For Admins
- 🎛️ Complete platform management
- 📦 Service & category CRUD operations
- 👥 User management
- 📊 Analytics and reports

## 🛠️ Tech Stack

### Backend
- **Java 17** with **Spring Boot 3.2**
- **Spring Security** with JWT authentication
- **Spring Data JPA** with Hibernate
- **MySQL 8** database
- **Swagger/OpenAPI** for API documentation

### Frontend
- **Angular 17** with standalone components
- **NG-Zorro 17** (Ant Design for Angular)
- **RxJS** for reactive programming
- **SCSS** for styling

## 📁 Project Structure

```
OnlineServiceBooking/
├── backend/                    # Spring Boot application
│   ├── src/main/java/com/servicebooking/
│   │   ├── config/            # Configuration classes
│   │   ├── controller/        # REST controllers
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── entity/            # JPA entities
│   │   ├── enums/             # Enumerations
│   │   ├── exception/         # Custom exceptions
│   │   ├── repository/        # JPA repositories
│   │   ├── security/          # JWT & Security
│   │   └── service/           # Business logic
│   └── src/main/resources/
│       └── application.yml    # Configuration
│
└── frontend/                   # Angular application
    └── src/app/
        ├── core/              # Services, models, guards
        ├── shared/            # Shared components
        └── pages/             # Page components
```

## 🚀 Getting Started

### Prerequisites

- **Java 17+** (JDK)
- **Node.js 18+** and npm
- **MySQL 8+**
- **Maven 3.8+**

### Backend Setup

1. **Create MySQL Database:**
   ```sql
   CREATE DATABASE service_booking;
   ```

2. **Configure Database:**
   Edit `backend/src/main/resources/application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/service_booking
       username: your_username
       password: your_password
   ```

3. **Run Backend:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   
   The API will be available at `http://localhost:8080`
   
   Swagger UI: `http://localhost:8080/swagger-ui.html`

### Frontend Setup

1. **Install Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Run Development Server:**
   ```bash
   npm start
   ```
   
   The app will be available at `http://localhost:4200`

## 🔐 Demo Accounts

After starting the backend, sample data is automatically seeded:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@servicebook.com | admin123 |
| **Customer** | customer@example.com | customer123 |
| **Provider** | provider1@example.com | provider123 |

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/{id}` | Get category by ID |
| POST | `/api/categories` | Create category (Admin) |
| PUT | `/api/categories/{id}` | Update category (Admin) |

### Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | Get all services |
| GET | `/api/services/{id}` | Get service by ID |
| GET | `/api/services/category/{id}` | Get by category |
| GET | `/api/services/featured` | Get featured services |
| GET | `/api/services/search?q=` | Search services |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/my-bookings` | Get user's bookings |
| GET | `/api/bookings/{id}` | Get booking by ID |
| PATCH | `/api/bookings/{id}/status` | Update status |
| PATCH | `/api/bookings/{id}/cancel` | Cancel booking |

### Providers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/providers/top-rated` | Get top providers |
| GET | `/api/providers/{id}` | Get provider details |
| GET | `/api/providers/profile` | Get own profile |
| PUT | `/api/providers/profile` | Update profile |

## 🎨 UI/UX Features

- **Modern Design**: Clean, minimalist interface with smooth animations
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Beautiful color scheme with CSS variables
- **Glass Morphism**: Subtle blur effects for cards and modals
- **Micro-interactions**: Hover effects, transitions, and loading states

## 📊 Database Schema

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    users    │     │  categories │     │  services   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id          │     │ id          │     │ id          │
│ firstName   │     │ name        │◄────│ category_id │
│ lastName    │     │ description │     │ name        │
│ email       │     │ icon        │     │ description │
│ password    │     │ image       │     │ basePrice   │
│ role        │     └─────────────┘     │ features    │
└─────────────┘                         └─────────────┘
      │                                       │
      │                                       │
      ▼                                       ▼
┌─────────────┐                         ┌─────────────┐
│  providers  │                         │  bookings   │
├─────────────┤                         ├─────────────┤
│ id          │◄────────────────────────│ provider_id │
│ user_id     │                         │ customer_id │
│ bio         │                         │ service_id  │
│ rating      │                         │ bookingDate │
│ completedJobs│                        │ status      │
└─────────────┘                         │ totalAmount │
      │                                 └─────────────┘
      │                                       │
      ▼                                       ▼
┌─────────────┐                         ┌─────────────┐
│   reviews   │                         │  payments   │
├─────────────┤                         ├─────────────┤
│ id          │                         │ id          │
│ booking_id  │◄────────────────────────│ booking_id  │
│ rating      │                         │ amount      │
│ comment     │                         │ status      │
└─────────────┘                         └─────────────┘
```

## 🔧 Configuration

### JWT Settings
```yaml
jwt:
  secret: your-secret-key
  expiration: 86400000  # 24 hours
```

### CORS Configuration
Configured to allow requests from `http://localhost:4200`

## 📝 License

This project is for educational purposes. Feel free to use and modify.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

Built with ❤️ for learning full-stack development with Spring Boot, Angular, and NG-Zorro.


