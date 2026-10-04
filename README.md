# Mini-TMS — Transportation Management System

A full-stack transportation management prototype for managing **drivers, vehicles, trips, resource availability, and operational KPIs** through a React Native mobile client and a Spring Boot REST API.

> **Portfolio project:** Mini-TMS demonstrates the translation of transportation-management requirements into a relational domain model, backend business logic, REST endpoints, and a mobile user interface.

## Features

- Driver management and availability tracking
- Vehicle management and availability tracking
- Trip creation and lifecycle management
- Trip filtering by operational criteria
- Operational dashboard and KPI-oriented endpoints
- Mobile interface for day-to-day transportation operations
- Layered backend architecture with controllers, services, repositories, and domain models

## Tech Stack

### Mobile client
- React Native
- Expo
- JavaScript
- Axios
- React Navigation

### Backend
- Java 17
- Spring Boot 3
- Spring Web / REST
- Spring Data JPA / Hibernate
- Maven
- H2 for local development
- PostgreSQL driver support

## Architecture

```text
React Native / Expo
        |
      Axios
        |
        v
Spring Boot REST API
        |
 Controller -> Service -> Repository
        |
       JPA
        |
        v
 H2 / PostgreSQL
```

## Repository Structure

```text
mini-tms/
├── backend/              # Spring Boot REST API
│   ├── src/
│   ├── pom.xml
│   └── mvnw
├── frontend/             # React Native / Expo application
│   ├── assets/
│   ├── src/
│   │   ├── screens/
│   │   └── services/
│   ├── App.js
│   └── package.json
├── docs/
│   └── screenshots/      # Add application screenshots here
├── .gitignore
└── README.md
```

## Domain Modules

The backend is organized around the main transportation-management entities and operations:

- **Drivers** — driver records, searches, updates, and availability
- **Vehicles** — fleet records and vehicle availability
- **Trips** — trip records, status/lifecycle operations, filtering, and assignment-related workflows
- **Users** — prototype user/login functionality
- **Dashboard** — operational summaries, recent trips, monthly statistics, driver performance, and vehicle utilization

The mobile application provides dedicated screens and service modules for the same operational areas.

## Running the Backend

### Requirements
- JDK 17+

From the `backend` directory:

```bash
./mvnw spring-boot:run
```

On Windows:

```powershell
mvnw.cmd spring-boot:run
```

The development configuration uses an in-memory H2 database.

## Running the Mobile App

### Requirements
- Node.js / npm
- Expo-compatible Android/iOS environment

From the `frontend` directory:

```bash
npm install
npm start
```

The current Android-emulator development configuration targets the backend at:

```text
http://10.0.2.2:8080/api
```

`10.0.2.2` maps the Android emulator to the host machine. Change the API base URL when running on a physical device or another environment.


## Development Status & Security Note

Mini-TMS is an academic/portfolio prototype rather than a production deployment. The current login flow contains demonstration authentication logic and should **not** be treated as production-grade authentication. A production version should use Spring Security, password hashing (for example BCrypt), token/session management, restricted CORS configuration, environment-based configuration, validation, and broader automated test coverage.

## Planned Improvements

- Spring Security + BCrypt + JWT/session authentication
- Environment-based API configuration
- PostgreSQL production profile
- Automated unit/integration tests
- Input validation and standardized API error responses
- Restricted CORS configuration
- CI pipeline for backend and frontend checks
- Screenshots and architecture diagram

## Author

**José Luis Romero Vázquez**

Electronic Engineering · Computer Networks · IoT · Data & Software Systems
