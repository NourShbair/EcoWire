<div align="center">

<img src="Frontend/public/logo.png" alt="EcoWire Logo" width="100" />

# EcoWire


https://github.com/user-attachments/assets/0671fcb1-2fe6-47f9-834b-aea6798bdeea


**A sustainability-focused insurance platform that scores, explains, and improves the environmental impact of insurance policies.**

[![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=openjdk)](https://openjdk.org/projects/jdk/17/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0-brightgreen?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=flat-square&logo=openai)](https://openai.com/)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [User Roles & Permissions](#user-roles--permissions)
- [Eco Score System](#eco-score-system)
- [Policy Types & Fields](#policy-types--fields)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running Tests](#running-tests)
- [Flyway Migrations](#flyway-migrations)

---

## Overview

EcoWire is a full-stack insurance platform that helps carriers, brokers, and customers assess and improve the environmental sustainability of their insurance policies. Each policy receives an **Eco Score** (0–100), an **AI-generated plain-English explanation**, and a list of **GPT-4o-powered sustainability recommendations**.

The system supports **multi-tenant isolation** — each organization's data is fully scoped from others — with six distinct user roles controlling who can view, create, edit, or delete policies.

---

## Features

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Stateless auth with signed tokens carrying role and org claims |
| 🏢 **Multi-Tenancy** | Organization-scoped data isolation for all org-bound roles |
| 📋 **Policy Management** | Full CRUD for AUTO, HOME, and PROPERTY insurance policies |
| 🌿 **Eco Score Engine** | Weighted scoring algorithm per policy type (0–100) |
| 🤖 **AI Recommendations** | GPT-4o generates personalized sustainability action plans |
| 💬 **AI Explanations** | Plain-English narrative explaining each policy's eco score |
| 📊 **Analytics Dashboard** | Visualizations of eco scores and policy distributions |
| 👥 **Role-Based UI** | Sidebar, buttons, and routes adapt to the user's role |
| 🆔 **Human-Readable IDs** | Policy IDs in format `orgname-type-001` |
| 🗄️ **Flyway Migrations** | Versioned, reproducible schema management |

---

## Tech Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Java | 17 | Language |
| Spring Boot | 4.0 | Application framework |
| Spring Security | 4.x | JWT authentication & authorization |
| Spring Data JPA | 4.x | Database ORM layer |
| Spring AI | 2.0.0-M5 | OpenAI GPT-4o integration |
| PostgreSQL | 16 | Primary database |
| Flyway | Bundled | Schema migrations |
| jjwt | 0.12.3 | JWT generation and validation |
| Lombok | Latest | Boilerplate reduction |
| JUnit 5 | Bundled | Unit & integration testing |
| jqwik | 1.8.4 | Property-based testing |
| H2 | Test only | In-memory DB for tests |
| Gradle | 9.4.1 | Build tool |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 8 | Build tool & dev server |
| React Router | 7 | Client-side routing |
| Bootstrap | 5.3 | Styling & layout |
| Bootstrap Icons | 1.13 | Icon set |
| Axios | 1.15 | HTTP client |
| Recharts | 3.8 | Charts & analytics |
| Framer Motion | 12 | Animations |
| Vitest | 4 | Unit testing |
| Testing Library | 16 | Component testing |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    React Frontend                    │
│  React 19 · Vite · Bootstrap 5 · React Router 7     │
│                                                      │
│  authService · permissionService · RoleGuard         │
│  ProtectedRoute · Sidebar · PolicyDashboard          │
└──────────────────────┬──────────────────────────────┘
                       │  HTTPS / REST (JSON)
                       │  Authorization: Bearer <JWT>
┌──────────────────────▼──────────────────────────────┐
│                  Spring Boot 4 Backend               │
│                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │ Controllers │→ │  Services   │→ │Repositories │  │
│  └─────────────┘  └──────┬──────┘  └──────┬──────┘  │
│                          │                │          │
│  ┌─────────────┐         │         ┌──────▼──────┐   │
│  │ JWT Filter  │         │         │ PostgreSQL  │   │
│  │ + Security  │         │         │  + Flyway   │   │
│  └─────────────┘         │         └─────────────┘   │
│                    ┌─────▼──────┐                    │
│                    │  OpenAI    │                    │
│                    │  GPT-4o    │                    │
│                    └────────────┘                    │
└─────────────────────────────────────────────────────┘
```

### Backend Layer Breakdown

```
com.ecowire.ecowire/
├── config/          # Spring configuration (CORS, caching, Spring AI)
├── controller/      # REST endpoints
├── service/         # Business logic interfaces + implementations
├── repository/      # Spring Data JPA interfaces
├── entity/          # JPA-mapped domain objects
├── dto/             # Request/response data transfer objects
├── enums/           # Domain enumerations
├── security/        # JWT filter, JwtUtil, RequestContext
├── scoring/         # Eco score calculation engine
├── exception/       # Custom exception classes
└── converter/       # JPA attribute converters
```

---

## Project Structure

```
EcoWire/
├── Backend/
│   └── ecowire/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/com/ecowire/ecowire/
│       │   │   └── resources/
│       │   │       ├── application.properties
│       │   │       └── db/migration/          # Flyway V1–V8
│       │   └── test/
│       │       ├── java/                      # JUnit + jqwik tests
│       │       └── resources/db/migration-test/
│       ├── build.gradle
│       └── .env                               # Local secrets (not committed)
├── Frontend/
│   ├── src/
│   │   ├── components/                        # React components
│   │   ├── services/                          # authService, api, permissionService
│   │   ├── styles/                            # CSS files
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   │   └── logo.png
│   ├── .env.development
│   ├── .env.production
│   └── package.json
└── docs/
    ├── requirements.md
    └── interview-prep-guidewire.md
```

---

## Database Schema

### Entity Relationship Overview

```
organizations ──< users
      │
      └──< policies ──< eco_scores
               ├──── auto_policies
               ├──── home_policies
               └──── property_policies
```

### Tables

#### `policies` (base table)
| Column | Type | Notes |
|---|---|---|
| `policy_id` | VARCHAR(100) PK | Human-readable: `orgname-type-001` |
| `customer_name` | VARCHAR(255) | Policy holder name |
| `contact_info` | VARCHAR(255) | Email address |
| `policy_type` | VARCHAR(20) | `AUTO`, `HOME`, `PROPERTY` |
| `organization_id` | VARCHAR(36) FK | Nullable — set from JWT |
| `customer_id` | VARCHAR(36) FK | Nullable — links to a CUSTOMER user |
| `created_by_id` | VARCHAR(36) FK | Nullable — set from JWT |
| `created_date` | TIMESTAMP | Auto-set on insert |
| `updated_date` | TIMESTAMP | Auto-updated on change |

#### `auto_policies`
| Column | Type | Values |
|---|---|---|
| `vehicle_id` | VARCHAR(100) | Free text |
| `vehicle_type` | VARCHAR(20) | `PETROL`, `DIESEL`, `HYBRID`, `ELECTRIC` |
| `annual_mileage` | VARCHAR(20) | `LOW`, `MEDIUM`, `HIGH` |
| `usage_type` | VARCHAR(20) | `PERSONAL`, `BUSINESS`, `COMMERCIAL` |
| `fuel_efficiency` | VARCHAR(20) | `LOW`, `MEDIUM`, `HIGH` |

#### `home_policies`
| Column | Type | Values |
|---|---|---|
| `property_address` | VARCHAR(500) | Free text |
| `energy_rating` | VARCHAR(1) | `A` – `G` |
| `has_solar_panels` | BOOLEAN | |
| `insulation_type` | VARCHAR(20) | `NONE`, `BASIC`, `STANDARD`, `ADVANCED` |
| `heating_system` | VARCHAR(20) | `GAS`, `OIL`, `ELECTRIC`, `HEAT_PUMP`, `GEOTHERMAL` |
| `water_conservation_features` | TEXT | Free text, nullable |

#### `property_policies`
| Column | Type | Values |
|---|---|---|
| `property_address` | VARCHAR(500) | Free text |
| `property_type` | VARCHAR(20) | `COMMERCIAL`, `RESIDENTIAL` |
| `certifications` | TEXT | Free text, nullable |
| `energy_systems` | VARCHAR(20) | `GRID`, `SOLAR`, `WIND`, `HYBRID`, `GEOTHERMAL` |
| `waste_management` | VARCHAR(30) | `NONE`, `BASIC_RECYCLING`, `ADVANCED_RECYCLING`, `COMPOSTING`, `ZERO_WASTE` |
| `building_age` | INTEGER | Years |

#### `eco_scores`
| Column | Type | Notes |
|---|---|---|
| `score_id` | VARCHAR(36) PK | UUID |
| `policy_id` | VARCHAR(100) FK | Cascades on policy delete |
| `total_score` | INTEGER | 0–100 |
| `score_breakdown` | JSONB | Per-component score data |
| `calculated_date` | TIMESTAMP | Auto-set on insert |

#### `organizations`
| Column | Type | Notes |
|---|---|---|
| `organization_id` | VARCHAR(36) PK | UUID |
| `name` | VARCHAR(255) | Unique |
| `created_date` | TIMESTAMP | Auto-set |

#### `users`
| Column | Type | Notes |
|---|---|---|
| `user_id` | VARCHAR(36) PK | UUID |
| `username` | VARCHAR(255) | Unique |
| `email` | VARCHAR(255) | Unique |
| `password_hash` | VARCHAR(255) | BCrypt |
| `role` | VARCHAR(20) | See roles below |
| `organization_id` | VARCHAR(36) FK | Nullable — org-scoped roles only |
| `created_date` | TIMESTAMP | Auto-set |

---

## User Roles & Permissions

| Role | Org-Scoped | Create Policy | Edit/Delete | View Policies |
|---|---|---|---|---|
| `ADMIN` | ✗ | ✅ All orgs | ✅ All orgs | ✅ All policies |
| `AGENT` | ✅ | ✅ Own org | ✅ Own org | ✅ Own org |
| `UNDERWRITER` | ✅ | ✗ | ✗ | ✅ Own org |
| `REPORTING` | ✅ | ✗ | ✗ | ✅ Own org |
| `AUDITOR` | ✅ | ✗ | ✗ | ✅ Own org |
| `CUSTOMER` | ✗ | ✗ | ✗ | ✅ Own policies only |

> **Org-scoped** roles must be assigned to an organization at signup. The organization ID is embedded in the JWT and enforced server-side on every request — it is never accepted from the request body.

---

## Eco Score System

Each policy is scored 0–100 based on type-specific attributes. Scores are stored per-policy with a full breakdown.

### Score Tiers

| Tier | Score Range | Discount |
|---|---|---|
| 🟢 **Excellent** | 67 – 100 | 15% Green Discount |
| 🟡 **Good** | 34 – 66 | 10% Green Discount |
| 🔴 **Needs Improvement** | 0 – 33 | Standard Rate |

### AUTO Score Components

| Component | Weight | Best Value |
|---|---|---|
| Vehicle Type | 40 pts | `ELECTRIC` |
| Annual Mileage | 30 pts | `LOW` |
| Usage Type | 20 pts | `PERSONAL` |
| Fuel Efficiency | 10 pts | `HIGH` |

### HOME Score Components

| Component | Weight | Best Value |
|---|---|---|
| Energy Rating | 35 pts | `A` |
| Renewable Energy (solar panels) | 25 pts | `true` |
| Insulation Type | 20 pts | `ADVANCED` |
| Heating System | 10 pts | `GEOTHERMAL` / `HEAT_PUMP` |
| Water Conservation | 10 pts | Present |

### PROPERTY Score Components

| Component | Weight | Best Value |
|---|---|---|
| Certifications | 40 pts | LEED Platinum / BREEAM |
| Energy Systems | 30 pts | `SOLAR` / `WIND` |
| Waste Management | 15 pts | `ZERO_WASTE` |
| Location Factor | 15 pts | Address-based |

---

## Policy Types & Fields

### AUTO Policy

```json
{
  "policyType": "AUTO",
  "customerName": "Jane Smith",
  "contactInfo": "jane@example.com",
  "vehicleId": "VH-ELEC-001",
  "vehicleType": "ELECTRIC",
  "annualMileage": "LOW",
  "usageType": "PERSONAL",
  "fuelEfficiency": "HIGH"
}
```

### HOME Policy

```json
{
  "policyType": "HOME",
  "customerName": "John Doe",
  "contactInfo": "john@example.com",
  "propertyAddress": "12 Green Lane, Dublin",
  "energyRating": "A",
  "hasSolarPanels": true,
  "insulationType": "ADVANCED",
  "heatingSystem": "HEAT_PUMP",
  "waterConservationFeatures": "Rainwater harvesting"
}
```

### PROPERTY Policy

```json
{
  "policyType": "PROPERTY",
  "customerName": "GreenBuild Ltd",
  "contactInfo": "contact@greenbuild.com",
  "propertyAddress": "100 Innovation Park, Dublin",
  "propertyType": "COMMERCIAL",
  "certifications": "LEED Platinum",
  "energySystems": "SOLAR",
  "wasteManagement": "ZERO_WASTE",
  "buildingAge": 5
}
```

---

## Policy ID Format

Policy IDs are human-readable, generated from the organization name, policy type, and a 3-digit sequence:

```
{organization-name-no-spaces}-{type}-{sequence}
```

| Organization | Policy Type | Sequence | Generated ID |
|---|---|---|---|
| Acme Agency | AUTO | 1st | `acmeagency-auto-001` |
| Acme Agency | HOME | 3rd | `acmeagency-home-003` |
| Green Build Corp | PROPERTY | 2nd | `greenBuildcorp-prop-002` |
| *(no org)* | AUTO | 1st | `ecowire-auto-001` |

---

## API Reference

All authenticated endpoints require `Authorization: Bearer <token>`.

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Public | Register new user |
| `POST` | `/api/auth/login` | Public | Login, returns JWT |

**Login response:**
```json
{
  "token": "eyJ...",
  "role": "AGENT",
  "expiresIn": 86400,
  "organizationId": "org-uuid",
  "organizationName": "Acme Agency"
}
```

### Organizations

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/organizations` | Public | List all orgs (alphabetical) |

### Policies

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/policies` | JWT | List policies (role-scoped) |
| `POST` | `/api/policies` | JWT (AGENT, ADMIN) | Create policy |
| `GET` | `/api/policies/{id}` | JWT | Get policy details |
| `PUT` | `/api/policies/{id}` | JWT (AGENT, ADMIN) | Update policy |
| `DELETE` | `/api/policies/{id}` | JWT (AGENT, ADMIN) | Delete policy |

### Eco Score & AI

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/policies/{id}/ecoscore` | JWT | Get eco score breakdown |
| `GET` | `/api/policies/{id}/recommendations` | JWT | Get AI recommendations |
| `GET` | `/api/policies/{id}/ecoscore/explanation` | JWT | Get AI explanation |
| `GET` | `/api/ecoscore/calculate` | Public | Preview eco score |

### Other

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Health check |

### Error Responses

All errors follow a consistent format:

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Policy type cannot be changed.",
  "timestamp": "2025-01-01T12:00:00"
}
```

Validation errors:
```json
{
  "status": 422,
  "errors": [
    { "field": "contactInfo", "message": "must be a valid email address" }
  ]
}
```

---

## Getting Started

### Prerequisites

- Java 17+
- Node.js 20+
- PostgreSQL 14+ (or a Supabase project)
- An OpenAI API key (for AI features)

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-org/ecowire.git
cd ecowire/Backend/ecowire

# 2. Copy the environment file and fill in your values
cp .env.example .env

# 3. Run the application (Flyway will auto-apply migrations)
./gradlew bootRun
```

The backend starts on **http://localhost:8081**.

### Frontend Setup

```bash
cd ecowire/Frontend

# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

The frontend starts on **http://localhost:5173**.

---

## Environment Variables

### Backend (`.env`)

| Variable | Required | Description |
|---|---|---|
| `DEV_DB_URL` | ✅ | PostgreSQL JDBC URL for dev |
| `DEV_DB_USERNAME` | ✅ | Database username |
| `DEV_DB_PASSWORD` | ✅ | Database password |
| `PROD_DB_URL` | Prod only | PostgreSQL JDBC URL for prod |
| `PROD_DB_USERNAME` | Prod only | Database username |
| `PROD_DB_PASSWORD` | Prod only | Database password |
| `OPENAI_API_KEY` | ✅ | OpenAI API key for GPT-4o |
| `SPRING_PROFILES_ACTIVE` | ✅ | `dev` or `prod` |

### Frontend

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL (e.g. `http://localhost:8081/api/`) |

---

## Running Tests

### Backend

```bash
cd Backend/ecowire

# Run all tests
./gradlew test

# Run with test report
./gradlew test jacocoTestReport
```

Tests use:
- **JUnit 5** for unit and integration tests
- **Spring Boot test slices** (`@DataJpaTest`, `@WebMvcTest`) for layer isolation
- **H2 in-memory database** for repository tests (separate migration directory at `src/test/resources/db/migration-test/`)
- **jqwik** for property-based tests

### Frontend

```bash
cd Frontend

# Run all tests (single run)
npm test

# Watch mode
npm run test:watch
```

Tests use **Vitest** + **Testing Library**.

---

## Flyway Migrations

Migrations live in `src/main/resources/db/migration/` and are applied in order at startup:

| Version | Description |
|---|---|
| `V1` | Initial schema — `policies`, `auto_policies`, `home_policies`, `property_policies`, `eco_scores` |
| `V2` | Seed data — 15 sample policies with eco scores |
| `V3` | Create `users` table |
| `V4` | Create ESG tables |
| `V5` | Create `organizations` table |
| `V6` | Add `organization_id` FK to `users` |
| `V7` | Add `organization_id`, `customer_id`, `created_by_id` to `policies` |
| `V8` | Widen `policy_id` column to `VARCHAR(100)` for human-readable IDs |

> ⚠️ Never modify an already-applied migration. Create a new version instead.

---

## Frontend Routes

| Route | Access | Description |
|---|---|---|
| `/login` | Public | Login page |
| `/signup` | Public | Registration page |
| `/` | AGENT, ADMIN | New policy form |
| `/policies` | All roles | Policy list |
| `/policies/:id` | All roles | Policy dashboard (score, AI, recommendations) |
| `/edit/:id` | AGENT, ADMIN | Edit policy form |
| `/analytics` | All roles | Analytics & charts |

---

<div align="center">

Built with ☕ Java, ⚛️ React, and 🌱 sustainability in mind.

</div>
