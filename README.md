# Inventory management application

## 🗓️ Inventory Management Project – Development Schedule
This project aims to build an Inventory Management Application using React + TypeScript on the frontend and Java + Spring Boot on the backend. 

## ✅ Project Goal
Deliver a fully functional application that allows users to create, edit, filter, sort, and view inventory products, along with key inventory metrics and a user-friendly interface.
The backend uses in-memory storage and is designed to support a future database implementation.

## 📅 Development Schedule
### Initial Setup
- Repository and branches setup (main, frontend-dev, backend-dev)
- Create base structure for:
- Frontend (React + TypeScript)
- Backend (Spring Boot + Maven)
- Configure ports (8080 for frontend, 9090 for backend)
- Define data model (Product)
- Prepare architecture to allow future persistence layer integration

### Backend: Basic CRUD API
- Implement Product model
- In-memory storage using Map<Long, Product>
- Implement endpoints:
- `GET /products` with basic filters
- `POST /products` with validation
- `PUT /products/{id}`
- Enable CORS and write basic unit tests

### Frontend: Product List + Filter
- Design product table layout
- Add filters by name, category, and availability
- Implement pagination (10 products per page)
- Connect frontend to backend (`GET /products`)
 
### Full CRUD Frontend + Backend
Backend:
- `DELETE /products/{id}`
- `POST /products/{id}/outofstock`
- `PUT /products/{id}/instock`
Frontend:
- Create/Edit product modal
- Field validation
- Product deletion feature

### Metrics and Advanced UI
- Calculate and display inventory metrics:
- Total products
- Total inventory value
- Average price
- Advanced UI styling:
- Row background based on expiration date
- Cell color based on stock
- Strikethrough text for out-of-stock items

### Advanced Sorting + UI Polish
- Backend: Support for multi-column sorting
- Frontend:
  - Implement UI for two-column sorting with icons
  - Improve user experience and layout polish

### Testing and Documentation
- Backend:
  - Add unit tests (mvn test)

- Frontend:
  - Add tests using React Testing Library (npm run tests)

- Documentation:
  - Clear README instructions
  - Explanation of architectural decisions

### Buffer and Delivery
- Final polish and bug fixes
- Complete flow walkthrough
- Merge all work into main
- Prepare demo video or interactive guide

## 🛠️ Technologies Used
Frontend:
- ReactJS + TypeScript
- React Context or Redux

Backend:
- Java 24
- Spring Boot + Maven
- In-memory storage (Java Collections)

## 📦 Run Commands
Frontend
- `npm install`
- `npm run start`     # Runs the app on port 8080
- `npm run tests`     # Executes frontend tests

Backend
- `mvn clean install`
- `mvn spring-boot:run`   # Runs the app on port 9090
- `mvn test`              # Executes backend tests
