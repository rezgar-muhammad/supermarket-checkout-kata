# Supermarket Checkout Kata

A simplified supermarket checkout system that handles carts with any number/combination of items and automatically applies weekly offers.

## 🏗️ Architecture

```
Request → REST Controller → Service → Repository → H2 Database
```

**Layers:**
- **DTOs** - Request/Response objects for API
- **Models** - Domain entities (Product, Offer, Cart)
- **Services** - Business logic (CheckoutService)
- **Repositories** - Data access (JpaRepository)
- **Exceptions** - Custom exceptions (ProductNotFoundException)

---

## 🚀 How to Run

### Backend (Spring Boot)
```bash
cd backend
./gradlew bootRun
# Runs on http://localhost:8080
```

### Frontend (Angular)
```bash
cd frontend
npm install
ng serve
# Runs on http://localhost:4200
```

---

## 🗄️ H2 Database

### Connection Settings

| Property | Value |
|----------|-------|
| **JDBC URL** | `jdbc:h2:mem:checkoutdb` |
| **Username** | `sa` |
| **Password** | *(empty)* |
| **Console URL** | http://localhost:8080/h2-console |

### Access H2 Console

1. Start backend: `./gradlew bootRun`
2. Open: http://localhost:8080/h2-console
3. Enter:
   - **JDBC URL:** `jdbc:h2:mem:checkoutdb`
   - **Username:** `sa`
   - **Password:** *(leave empty)*


```properties
# H2 In-Memory Database
spring.datasource.url=jdbc:h2:mem:checkoutdb;DB_CLOSE_DELAY=-1
spring.datasource.username=sa
spring.datasource.password=

# Enable H2 Console
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JPA Settings
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
```
