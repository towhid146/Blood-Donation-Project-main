# Blood Donation Management System - Node.js Backend

A MERN stack backend for the Blood Donation Management System, converted from Spring Boot.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** Passport.js with Local Strategy
- **Password Hashing:** bcryptjs
- **Session Management:** express-session
- **Validation:** express-validator

## Project Structure

```
backend/
├── config/
│   ├── database.js       # MongoDB connection configuration
│   └── passport.js       # Passport authentication configuration
├── middleware/
│   ├── auth.js           # Authentication middleware
│   └── errorHandler.js   # Error handling middleware
├── models/
│   ├── User.js           # User model (equivalent to UserEntity)
│   ├── Donation.js       # Donation model (equivalent to DonationEntity)
│   ├── Recipient.js      # Recipient model (equivalent to RecipientEntity)
│   ├── Report.js         # Report model (equivalent to ReportEntity)
│   └── HBC.js            # Hospital/Blood Center model (equivalent to HBCEntity)
├── routes/
│   ├── authRoutes.js     # Authentication routes (login, signup, logout)
│   ├── userRoutes.js     # User CRUD routes
│   ├── profileRoutes.js  # Profile routes
│   ├── donationRoutes.js # Donation routes
│   ├── recipientRoutes.js# Recipient/blood request routes
│   ├── hbcRoutes.js      # Hospital/Blood Center routes
│   └── reportRoutes.js   # Health report routes
├── services/
│   ├── userService.js    # User business logic
│   ├── donationService.js# Donation business logic
│   ├── recipientService.js# Recipient business logic
│   ├── hbcService.js     # HBC business logic
│   └── reportService.js  # Report business logic
├── .env.example          # Environment variables template
├── package.json          # Dependencies and scripts
├── server.js             # Main application entry point
└── README.md             # This file
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn

### Installation

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment file:

   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` file:

   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/blood_donation_db
   SESSION_SECRET=your-super-secret-session-key
   JWT_SECRET=your-jwt-secret-key
   ```

5. Start MongoDB (if running locally):

   ```bash
   mongod
   ```

6. Start the server:

   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint           | Description                 |
| ------ | ------------------ | --------------------------- |
| POST   | `/api/auth/signup` | Register a new user         |
| POST   | `/api/auth/login`  | Login user                  |
| POST   | `/api/auth/logout` | Logout user                 |
| GET    | `/api/auth/check`  | Check authentication status |

### Users (`/api/users`)

| Method | Endpoint                           | Description              |
| ------ | ---------------------------------- | ------------------------ |
| GET    | `/api/users`                       | Get all donors           |
| GET    | `/api/users/:id`                   | Get user by ID           |
| GET    | `/api/users/blood-type/:bloodType` | Get donors by blood type |
| GET    | `/api/users/location/:location`    | Get donors by location   |
| PUT    | `/api/users/:id`                   | Update user profile      |
| PUT    | `/api/users/:id/password`          | Update password          |
| DELETE | `/api/users/:id`                   | Delete account           |

### Profile (`/api/profile`)

| Method | Endpoint                   | Description                |
| ------ | -------------------------- | -------------------------- |
| GET    | `/api/profile`             | Get current user's profile |
| PUT    | `/api/profile`             | Update profile             |
| GET    | `/api/profile/donations`   | Get donation history       |
| GET    | `/api/profile/reports`     | Get health reports         |
| GET    | `/api/profile/eligibility` | Check donation eligibility |
| GET    | `/api/profile/stats`       | Get user statistics        |

### Donations (`/api/donations`)

| Method | Endpoint                    | Description             |
| ------ | --------------------------- | ----------------------- |
| POST   | `/api/donations`            | Create donation record  |
| GET    | `/api/donations`            | Get recent donations    |
| GET    | `/api/donations/stats`      | Get donation statistics |
| GET    | `/api/donations/:id`        | Get donation by ID      |
| PUT    | `/api/donations/:id/status` | Update donation status  |

### Recipients (`/api/recipients`)

| Method | Endpoint                                  | Description                 |
| ------ | ----------------------------------------- | --------------------------- |
| POST   | `/api/recipients`                         | Create blood request        |
| GET    | `/api/recipients`                         | Get pending requests        |
| GET    | `/api/recipients/urgent`                  | Get urgent requests         |
| GET    | `/api/recipients/blood-group/:bloodGroup` | Get requests by blood group |
| PUT    | `/api/recipients/:id/status`              | Update request status       |

### Hospitals/Blood Centers (`/api/hbc`)

| Method | Endpoint                    | Description                   |
| ------ | --------------------------- | ----------------------------- |
| GET    | `/api/hbc`                  | Get all HBCs                  |
| GET    | `/api/hbc/:id`              | Get HBC by ID                 |
| GET    | `/api/hbc/city/:city`       | Get HBCs by city              |
| GET    | `/api/hbc/blood/:bloodType` | Get HBCs with blood available |
| POST   | `/api/hbc`                  | Create new HBC                |
| PUT    | `/api/hbc/:id`              | Update HBC                    |
| PUT    | `/api/hbc/:id/inventory`    | Update blood inventory        |

### Reports (`/api/reports`)

| Method | Endpoint                                | Description          |
| ------ | --------------------------------------- | -------------------- |
| POST   | `/api/reports`                          | Create health report |
| GET    | `/api/reports/:id`                      | Get report by ID     |
| GET    | `/api/reports/user/:userId/eligibility` | Check eligibility    |
| PUT    | `/api/reports/:id`                      | Update report        |
| DELETE | `/api/reports/:id`                      | Delete report        |

## Mapping from Spring Boot to Express.js

| Spring Boot Component   | Express.js Equivalent     |
| ----------------------- | ------------------------- |
| `@RestController`       | Express Router            |
| `@Service`              | Service modules           |
| `@Repository` (JPA)     | Mongoose Models           |
| `@Entity`               | Mongoose Schema           |
| `SecurityConfig`        | Passport.js configuration |
| `BCryptPasswordEncoder` | bcryptjs                  |
| `HttpSession`           | express-session           |

## Running Tests

```bash
npm test
```

## Frontend Integration

The frontend (Thymeleaf templates) can be served alongside this backend or converted to a separate React application. The API is designed to be RESTful and can be consumed by any frontend framework.

For the existing templates, you may need to:

1. Convert form submissions to use fetch/axios
2. Update authentication flow to use the new API endpoints
3. Handle JSON responses instead of server-side rendering

## License

ISC
