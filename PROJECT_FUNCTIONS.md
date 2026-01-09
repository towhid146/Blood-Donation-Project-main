# Blood Donation Management System - Functions Documentation

This document contains all the functions/methods in the Blood Donation Management System project.

---

## Table of Contents

1. [Main Application](#main-application)
2. [Configuration Classes](#configuration-classes)
3. [Controllers](#controllers)
4. [Services](#services)
5. [Repositories](#repositories)
6. [Entities](#entities)
7. [Exception Classes](#exception-classes)
8. [Form Classes](#form-classes)
9. [Tests](#tests)

---

## Main Application

### BloodDonationManagementSystemApplication.java

**Package:** `com.BDMS.demo`

| Function              | Return Type | Parameters      | Description                                |
| --------------------- | ----------- | --------------- | ------------------------------------------ |
| `main(String[] args)` | `void`      | `String[] args` | Entry point of the Spring Boot application |

---

## Configuration Classes

### SecurityConfig.java

**Package:** `com.BDMS.demo`

| Function                                                                                  | Return Type              | Parameters                                                         | Description                                                                                                          |
| ----------------------------------------------------------------------------------------- | ------------------------ | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `passwordEncoder()`                                                                       | `PasswordEncoder`        | None                                                               | Creates and returns a BCryptPasswordEncoder bean for password encryption                                             |
| `authenticationProvider(UserDetailsService userDetailsService)`                           | `AuthenticationProvider` | `UserDetailsService userDetailsService`                            | Configures and returns a DaoAuthenticationProvider with user details service and password encoder                    |
| `securityFilterChain(HttpSecurity http)`                                                  | `SecurityFilterChain`    | `HttpSecurity http`                                                | Configures HTTP security settings including authorization rules, login/logout handling, session management, and CSRF |
| `authenticationManager(HttpSecurity http, AuthenticationProvider authenticationProvider)` | `AuthenticationManager`  | `HttpSecurity http, AuthenticationProvider authenticationProvider` | Creates and returns the AuthenticationManager bean                                                                   |
| `userDetailsService(UserRepository userRepository)`                                       | `UserDetailsService`     | `UserRepository userRepository`                                    | Creates a UserDetailsService that loads user details from the database                                               |

### AuthenticationSuccessHandler.java

**Package:** `com.BDMS.demo`

| Function                                                                                                           | Return Type | Parameters                                                                                | Description                                                                                               |
| ------------------------------------------------------------------------------------------------------------------ | ----------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)` | `void`      | `HttpServletRequest request, HttpServletResponse response, Authentication authentication` | Handles successful authentication by redirecting to profile page if authenticated, otherwise to home page |

---

## Controllers

### HomeController.java

**Package:** `com.BDMS.demo.Controller`

| Function                                     | Return Type | Parameters                         | Mapping         | Description                                                       |
| -------------------------------------------- | ----------- | ---------------------------------- | --------------- | ----------------------------------------------------------------- |
| `homePage(Model model, Principal principal)` | `String`    | `Model model, Principal principal` | `GET /homePage` | Renders the home page and passes logged-in user info to the model |

### LoginController.java

**Package:** `com.BDMS.demo.Controller`

| Function                                                             | Return Type | Parameters                                              | Mapping       | Description                                                            |
| -------------------------------------------------------------------- | ----------- | ------------------------------------------------------- | ------------- | ---------------------------------------------------------------------- |
| `showLoginPage(Model model)`                                         | `String`    | `Model model`                                           | `GET /login`  | Displays the login page with a new LoginForm                           |
| `handleLogin(LoginForm loginForm, Model model, HttpSession session)` | `String`    | `LoginForm loginForm, Model model, HttpSession session` | `POST /login` | Processes login form, validates credentials, and redirects accordingly |

### ProfileController.java

**Package:** `com.BDMS.demo.Controller`

| Function                  | Return Type | Parameters    | Mapping        | Description                                                                               |
| ------------------------- | ----------- | ------------- | -------------- | ----------------------------------------------------------------------------------------- |
| `getProfile(Model model)` | `String`    | `Model model` | `GET /profile` | Retrieves the authenticated user's profile from the database and renders the profile page |

### UserController.java

**Package:** `com.BDMS.demo.Controller`

| Function                                                                  | Return Type | Parameters                                                         | Mapping        | Description                                                                                                         |
| ------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------ | -------------- | ------------------------------------------------------------------------------------------------------------------- |
| `showSignUpForm(Model model)`                                             | `String`    | `Model model`                                                      | `GET /signUp`  | Displays the sign-up form with a new UserEntity                                                                     |
| `handleSignUp(UserEntity user, BindingResult bindingResult, Model model)` | `String`    | `@Valid UserEntity user, BindingResult bindingResult, Model model` | `POST /signUp` | Processes sign-up form, validates user data, checks for duplicate email/username, encrypts password, and saves user |

### NavbarController.java

**Package:** `com.BDMS.demo.Controller`

| Function                                    | Return Type           | Parameters                   | Mapping              | Description                                                     |
| ------------------------------------------- | --------------------- | ---------------------------- | -------------------- | --------------------------------------------------------------- |
| `getUserStatus(HttpServletRequest request)` | `Map<String, Object>` | `HttpServletRequest request` | `GET /getUserStatus` | Returns JSON with user's login status and username if logged in |

---

## Services

### UserService.java

**Package:** `com.BDMS.demo.Service`

| Function                                              | Return Type  | Parameters                            | Description                                                                                     |
| ----------------------------------------------------- | ------------ | ------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `findByUsername(String username)`                     | `UserEntity` | `String username`                     | Fetches user details from database by username. Throws `UsernameNotFoundException` if not found |
| `saveUserProfile(UserEntity user)`                    | `UserEntity` | `UserEntity user`                     | Creates or updates a user's profile in the database                                             |
| `findByEmail(String email)`                           | `UserEntity` | `String email`                        | Fetches user details from database by email. Throws `UsernameNotFoundException` if not found    |
| `updatePassword(String username, String newPassword)` | `UserEntity` | `String username, String newPassword` | Updates the password for a user and saves to database                                           |
| `deleteUser(String username)`                         | `void`       | `String username`                     | Deletes a user from the database by username                                                    |

---

## Repositories

### UserRepository.java

**Package:** `com.BDMS.demo.repository`

_Interface extending JpaRepository<UserEntity, Long>_

| Function                          | Return Type  | Parameters        | Description                         |
| --------------------------------- | ------------ | ----------------- | ----------------------------------- |
| `findByEmail(String email)`       | `UserEntity` | `String email`    | Finds a user by their email address |
| `findByUsername(String username)` | `UserEntity` | `String username` | Finds a user by their username      |

_Inherited JpaRepository methods:_

- `save(S entity)` - Saves an entity
- `findById(ID id)` - Finds by ID
- `findAll()` - Returns all entities
- `deleteById(ID id)` - Deletes by ID
- `delete(T entity)` - Deletes an entity
- `count()` - Returns count of entities
- `existsById(ID id)` - Checks if entity exists

---

## Entities

### UserEntity.java

**Package:** `com.BDMS.demo.persistent`

_Uses Lombok @Data annotation - generates getters, setters, toString, equals, hashCode_

| Function                                       | Return Type | Parameters                | Description                           |
| ---------------------------------------------- | ----------- | ------------------------- | ------------------------------------- |
| `isEnabled()`                                  | `boolean`   | None                      | Returns true (user is always enabled) |
| `getId()`                                      | `Long`      | None                      | Gets the user ID                      |
| `setId(Long id)`                               | `void`      | `Long id`                 | Sets the user ID                      |
| `getUsername()`                                | `String`    | None                      | Gets the username                     |
| `setUsername(String username)`                 | `void`      | `String username`         | Sets the username                     |
| `getEmail()`                                   | `String`    | None                      | Gets the email                        |
| `setEmail(String email)`                       | `void`      | `String email`            | Sets the email                        |
| `getNumber()`                                  | `String`    | None                      | Gets the mobile number                |
| `setNumber(String number)`                     | `void`      | `String number`           | Sets the mobile number                |
| `getBloodType()`                               | `String`    | None                      | Gets the blood type                   |
| `setBloodType(String bloodType)`               | `void`      | `String bloodType`        | Sets the blood type                   |
| `getLocation()`                                | `String`    | None                      | Gets the location                     |
| `setLocation(String location)`                 | `void`      | `String location`         | Sets the location                     |
| `getPassword()`                                | `String`    | None                      | Gets the password                     |
| `setPassword(String password)`                 | `void`      | `String password`         | Sets the password                     |
| `getFirstName()`                               | `String`    | None                      | Gets the first name                   |
| `setFirstName(String firstName)`               | `void`      | `String firstName`        | Sets the first name                   |
| `getLastName()`                                | `String`    | None                      | Gets the last name                    |
| `setLastName(String lastName)`                 | `void`      | `String lastName`         | Sets the last name                    |
| `getAge()`                                     | `int`       | None                      | Gets the age                          |
| `setAge(int age)`                              | `void`      | `int age`                 | Sets the age                          |
| `getGender()`                                  | `String`    | None                      | Gets the gender                       |
| `setGender(String gender)`                     | `void`      | `String gender`           | Sets the gender                       |
| `getDonationsCount()`                          | `int`       | None                      | Gets the donations count              |
| `setDonationsCount(int donationsCount)`        | `void`      | `int donationsCount`      | Sets the donations count              |
| `getCompletedRequests()`                       | `int`       | None                      | Gets the completed requests           |
| `setCompletedRequests(int completedRequests)`  | `void`      | `int completedRequests`   | Sets the completed requests           |
| `getMissedRequests()`                          | `int`       | None                      | Gets the missed requests              |
| `setMissedRequests(int missedRequests)`        | `void`      | `int missedRequests`      | Sets the missed requests              |
| `getResponseRatio()`                           | `double`    | None                      | Gets the response ratio               |
| `setResponseRatio(double responseRatio)`       | `void`      | `double responseRatio`    | Sets the response ratio               |
| `getLastDonationDate()`                        | `String`    | None                      | Gets the last donation date           |
| `setLastDonationDate(String lastDonationDate)` | `void`      | `String lastDonationDate` | Sets the last donation date           |

### DonationEntity.java

**Package:** `com.BDMS.demo.persistent`

_Uses Lombok @Data annotation_

| Function                     | Return Type | Parameters       | Description            |
| ---------------------------- | ----------- | ---------------- | ---------------------- |
| `getDon_id()`                | `Integer`   | None             | Gets the donation ID   |
| `setDon_id(Integer don_id)`  | `void`      | `Integer don_id` | Sets the donation ID   |
| `getDon_date()`              | `Date`      | None             | Gets the donation date |
| `setDon_date(Date don_date)` | `void`      | `Date don_date`  | Sets the donation date |
| `getRecid()`                 | `Integer`   | None             | Gets the recipient ID  |
| `setRecid(Integer recid)`    | `void`      | `Integer recid`  | Sets the recipient ID  |
| `getHos_id()`                | `Integer`   | None             | Gets the hospital ID   |
| `setHos_id(Integer hos_id)`  | `void`      | `Integer hos_id` | Sets the hospital ID   |
| `getUse_id()`                | `Integer`   | None             | Gets the user ID       |
| `setUse_id(Integer use_id)`  | `void`      | `Integer use_id` | Sets the user ID       |

### RecipientEntity.java

**Package:** `com.BDMS.demo.persistent`

_Uses Lombok @Data annotation_

| Function                                       | Return Type | Parameters               | Description                  |
| ---------------------------------------------- | ----------- | ------------------------ | ---------------------------- |
| `getR_id()`                                    | `Integer`   | None                     | Gets the recipient ID        |
| `setR_id(Integer r_id)`                        | `void`      | `Integer r_id`           | Sets the recipient ID        |
| `getMedical_purpose()`                         | `String`    | None                     | Gets the medical purpose     |
| `setMedical_purpose(String medical_purpose)`   | `void`      | `String medical_purpose` | Sets the medical purpose     |
| `getRegistration_date()`                       | `Date`      | None                     | Gets the registration date   |
| `setRegistration_date(Date registration_date)` | `void`      | `Date registration_date` | Sets the registration date   |
| `getVolume_needed()`                           | `Integer`   | None                     | Gets the blood volume needed |
| `setVolume_needed(Integer volume_needed)`      | `void`      | `Integer volume_needed`  | Sets the blood volume needed |
| `getBlood_g_needed()`                          | `String`    | None                     | Gets the blood group needed  |
| `setBlood_g_needed(String blood_g_needed)`     | `void`      | `String blood_g_needed`  | Sets the blood group needed  |
| `getUser_id()`                                 | `Integer`   | None                     | Gets the user ID             |
| `setUser_id(Integer user_id)`                  | `void`      | `Integer user_id`        | Sets the user ID             |

### ReportEntity.java

**Package:** `com.BDMS.demo.persistent`

_Uses Lombok @Data annotation_

| Function                                       | Return Type | Parameters               | Description                       |
| ---------------------------------------------- | ----------- | ------------------------ | --------------------------------- |
| `getReport_id()`                               | `Integer`   | None                     | Gets the report ID                |
| `setReport_id(Integer report_id)`              | `void`      | `Integer report_id`      | Sets the report ID                |
| `getLast_blood_donate()`                       | `Date`      | None                     | Gets the last blood donation date |
| `setLast_blood_donate(Date last_blood_donate)` | `void`      | `Date last_blood_donate` | Sets the last blood donation date |
| `getHosid()`                                   | `Integer`   | None                     | Gets the hospital ID              |
| `setHosid(Integer hosid)`                      | `void`      | `Integer hosid`          | Sets the hospital ID              |
| `getUseriid()`                                 | `String`    | None                     | Gets the user ID                  |
| `setUseriid(String useriid)`                   | `void`      | `String useriid`         | Sets the user ID                  |

### HBCEntity.java (Hospital/Blood Center Entity)

**Package:** `com.BDMS.demo.persistent`

_Uses Lombok @Data annotation_

| Function                                         | Return Type | Parameters                 | Description                |
| ------------------------------------------------ | ----------- | -------------------------- | -------------------------- |
| `getH_id()`                                      | `int`       | None                       | Gets the HBC ID            |
| `setH_id(int h_id)`                              | `void`      | `int h_id`                 | Sets the HBC ID            |
| `getHbc_name()`                                  | `String`    | None                       | Gets the HBC name          |
| `setHbc_name(String hbc_name)`                   | `void`      | `String hbc_name`          | Sets the HBC name          |
| `getH_area()`                                    | `String`    | None                       | Gets the area              |
| `setH_area(String h_area)`                       | `void`      | `String h_area`            | Sets the area              |
| `getH_city()`                                    | `String`    | None                       | Gets the city              |
| `setH_city(String h_city)`                       | `void`      | `String h_city`            | Sets the city              |
| `getH_division()`                                | `String`    | None                       | Gets the division          |
| `setH_division(String h_division)`               | `void`      | `String h_division`        | Sets the division          |
| `getH_phone()`                                   | `String`    | None                       | Gets the phone number      |
| `setH_phone(String h_phone)`                     | `void`      | `String h_phone`           | Sets the phone number      |
| `getOrganization_type()`                         | `String`    | None                       | Gets the organization type |
| `setOrganization_type(String organization_type)` | `void`      | `String organization_type` | Sets the organization type |

---

## Exception Classes

### ResourceNotFoundException.java

**Package:** `com.BDMS.demo.exception`

_Extends RuntimeException_

| Function                                                                              | Return Type | Parameters                                                 | Description                              |
| ------------------------------------------------------------------------------------- | ----------- | ---------------------------------------------------------- | ---------------------------------------- |
| `ResourceNotFoundException(String resourceName, Object fieldValue, String fieldName)` | Constructor | `String resourceName, Object fieldValue, String fieldName` | Creates exception with formatted message |
| `getResourceName()`                                                                   | `String`    | None                                                       | Returns the resource name                |
| `getFieldName()`                                                                      | `String`    | None                                                       | Returns the field name                   |
| `getFieldValue()`                                                                     | `Object`    | None                                                       | Returns the field value                  |

---

## Form Classes

### LoginForm.java

**Package:** `com.BDMS.demo`

_Uses Lombok @Getter and @Setter annotations_

| Function                            | Return Type | Parameters           | Description               |
| ----------------------------------- | ----------- | -------------------- | ------------------------- |
| `getUsername()`                     | `String`    | None                 | Gets the username         |
| `setUsername(String username)`      | `void`      | `String username`    | Sets the username         |
| `getPassword()`                     | `String`    | None                 | Gets the password         |
| `setPassword(String password)`      | `void`      | `String password`    | Sets the password         |
| `isRememberMe()`                    | `boolean`   | None                 | Gets the remember me flag |
| `setRememberMe(boolean rememberMe)` | `void`      | `boolean rememberMe` | Sets the remember me flag |

---

## Tests

### BloodDonationManagementSystemApplicationTests.java

**Package:** `com.BDMS.demo`

| Function         | Return Type | Parameters | Description                                                  |
| ---------------- | ----------- | ---------- | ------------------------------------------------------------ |
| `contextLoads()` | `void`      | None       | Tests that the Spring application context loads successfully |

---

## Summary Statistics (Spring Boot - Legacy)

| Category               | Count  |
| ---------------------- | ------ |
| Controllers            | 5      |
| Services               | 1      |
| Repositories           | 1      |
| Entities               | 5      |
| Configuration Classes  | 2      |
| Exception Classes      | 1      |
| Form Classes           | 1      |
| Test Classes           | 1      |
| **Total Java Classes** | **17** |

---

# Node.js/Express Backend (MERN Stack)

The backend has been converted from Spring Boot to Node.js/Express.js with MongoDB. Below are all the functions in the new backend.

---

## Table of Contents (Node.js Backend)

1. [Server Configuration](#server-configuration)
2. [Models (Mongoose)](#models-mongoose)
3. [Services](#services-nodejs)
4. [Routes](#routes)
5. [Middleware](#middleware)
6. [Configuration](#configuration)

---

## Server Configuration

### server.js

| Function/Middleware  | Description                                                        |
| -------------------- | ------------------------------------------------------------------ |
| Express app setup    | Configures Express with CORS, JSON parsing, sessions, and Passport |
| MongoDB connection   | Connects to MongoDB using Mongoose                                 |
| Route registration   | Registers all API routes                                           |
| Error handling       | Global error handling middleware                                   |
| `GET /api/health`    | Health check endpoint                                              |
| `GET /getUserStatus` | Returns user login status for navbar                               |

---

## Models (Mongoose)

### User.js

| Function                             | Return Type        | Parameters                  | Description                                               |
| ------------------------------------ | ------------------ | --------------------------- | --------------------------------------------------------- |
| `pre('save')`                        | Middleware         | -                           | Hashes password before saving using bcrypt                |
| `comparePassword(candidatePassword)` | `Promise<boolean>` | `candidatePassword: string` | Compares provided password with hashed password           |
| `calculateResponseRatio()`           | `number`           | -                           | Calculates response ratio from completed/missed requests  |
| `toJSON()`                           | `Object`           | -                           | Transforms user object for JSON output (removes password) |

### Donation.js

| Function       | Return Type | Description                                               |
| -------------- | ----------- | --------------------------------------------------------- |
| Schema indexes | -           | Indexes on user, donDate, and hospital for faster queries |

### Recipient.js

| Function       | Return Type | Description                                   |
| -------------- | ----------- | --------------------------------------------- |
| Schema indexes | -           | Indexes on bloodGroupNeeded, status, and user |

### Report.js

| Function       | Return Type | Description                                                          |
| -------------- | ----------- | -------------------------------------------------------------------- |
| `pre('save')`  | Middleware  | Calculates next eligible donation date (56 days after last donation) |
| Schema indexes | -           | Index on user and lastBloodDonate                                    |

### HBC.js (Hospital/Blood Center)

| Function       | Return Type | Description                                     |
| -------------- | ----------- | ----------------------------------------------- |
| Schema indexes | -           | Indexes on city, division, and organizationType |

---

## Services (Node.js)

### userService.js

| Function                                | Return Type       | Parameters                              | Description                                              |
| --------------------------------------- | ----------------- | --------------------------------------- | -------------------------------------------------------- |
| `findByUsername(username)`              | `Promise<User>`   | `username: string`                      | Fetches user by username                                 |
| `saveUserProfile(userData)`             | `Promise<User>`   | `userData: Object`                      | Creates or updates user profile                          |
| `findByEmail(email)`                    | `Promise<User>`   | `email: string`                         | Fetches user by email                                    |
| `updatePassword(username, newPassword)` | `Promise<User>`   | `username: string, newPassword: string` | Updates user password                                    |
| `deleteUser(username)`                  | `Promise<void>`   | `username: string`                      | Deletes user by username                                 |
| `findById(id)`                          | `Promise<User>`   | `id: string`                            | Finds user by MongoDB ObjectId                           |
| `getAllUsers()`                         | `Promise<User[]>` | -                                       | Returns all enabled users                                |
| `findByBloodType(bloodType)`            | `Promise<User[]>` | `bloodType: string`                     | Finds donors by blood type                               |
| `findByLocation(location)`              | `Promise<User[]>` | `location: string`                      | Finds donors by location (regex search)                  |
| `incrementDonationCount(userId)`        | `Promise<User>`   | `userId: string`                        | Increments donation count and updates last donation date |

### donationService.js

| Function                       | Return Type           | Parameters                   | Description                             |
| ------------------------------ | --------------------- | ---------------------------- | --------------------------------------- |
| `createDonation(donationData)` | `Promise<Donation>`   | `donationData: Object`       | Creates donation and updates user stats |
| `findById(id)`                 | `Promise<Donation>`   | `id: string`                 | Gets donation by ID with populated refs |
| `findByUser(userId)`           | `Promise<Donation[]>` | `userId: string`             | Gets all donations for a user           |
| `findByHospital(hospitalId)`   | `Promise<Donation[]>` | `hospitalId: string`         | Gets all donations at a hospital        |
| `updateStatus(id, status)`     | `Promise<Donation>`   | `id: string, status: string` | Updates donation status                 |
| `getRecentDonations(limit)`    | `Promise<Donation[]>` | `limit: number`              | Gets recent completed donations         |
| `getStatistics()`              | `Promise<Object>`     | -                            | Gets donation statistics by blood type  |

### recipientService.js

| Function                              | Return Type            | Parameters                   | Description                          |
| ------------------------------------- | ---------------------- | ---------------------------- | ------------------------------------ |
| `createRequest(recipientData)`        | `Promise<Recipient>`   | `recipientData: Object`      | Creates new blood request            |
| `findById(id)`                        | `Promise<Recipient>`   | `id: string`                 | Gets request by ID                   |
| `findByUser(userId)`                  | `Promise<Recipient[]>` | `userId: string`             | Gets requests by user                |
| `findPendingByBloodGroup(bloodGroup)` | `Promise<Recipient[]>` | `bloodGroup: string`         | Gets pending requests by blood group |
| `updateStatus(id, status)`            | `Promise<Recipient>`   | `id: string, status: string` | Updates request status               |
| `getAllPending()`                     | `Promise<Recipient[]>` | -                            | Gets all pending requests            |
| `getUrgentRequests()`                 | `Promise<Recipient[]>` | -                            | Gets high/critical urgency requests  |

### hbcService.js

| Function                                        | Return Type      | Parameters                                        | Description                       |
| ----------------------------------------------- | ---------------- | ------------------------------------------------- | --------------------------------- |
| `create(hbcData)`                               | `Promise<HBC>`   | `hbcData: Object`                                 | Creates new hospital/blood center |
| `findById(id)`                                  | `Promise<HBC>`   | `id: string`                                      | Gets HBC by ID                    |
| `getAll()`                                      | `Promise<HBC[]>` | -                                                 | Gets all active HBCs              |
| `findByCity(city)`                              | `Promise<HBC[]>` | `city: string`                                    | Gets HBCs by city                 |
| `findByDivision(division)`                      | `Promise<HBC[]>` | `division: string`                                | Gets HBCs by division             |
| `findByType(type)`                              | `Promise<HBC[]>` | `type: string`                                    | Gets HBCs by organization type    |
| `update(id, updateData)`                        | `Promise<HBC>`   | `id: string, updateData: Object`                  | Updates HBC information           |
| `updateBloodInventory(id, bloodType, quantity)` | `Promise<HBC>`   | `id: string, bloodType: string, quantity: number` | Updates blood inventory           |
| `findWithBloodAvailable(bloodType)`             | `Promise<HBC[]>` | `bloodType: string`                               | Gets HBCs with blood available    |
| `deactivate(id)`                                | `Promise<HBC>`   | `id: string`                                      | Deactivates an HBC                |

### reportService.js

| Function                     | Return Type         | Parameters                       | Description                          |
| ---------------------------- | ------------------- | -------------------------------- | ------------------------------------ |
| `create(reportData)`         | `Promise<Report>`   | `reportData: Object`             | Creates new health report            |
| `findById(id)`               | `Promise<Report>`   | `id: string`                     | Gets report by ID                    |
| `findByUser(userId)`         | `Promise<Report[]>` | `userId: string`                 | Gets reports by user                 |
| `getLatestByUser(userId)`    | `Promise<Report>`   | `userId: string`                 | Gets most recent report for user     |
| `findByHospital(hospitalId)` | `Promise<Report[]>` | `hospitalId: string`             | Gets reports by hospital             |
| `checkEligibility(userId)`   | `Promise<Object>`   | `userId: string`                 | Checks if user is eligible to donate |
| `update(id, updateData)`     | `Promise<Report>`   | `id: string, updateData: Object` | Updates a report                     |
| `delete(id)`                 | `Promise<Report>`   | `id: string`                     | Deletes a report                     |

---

## Routes

### authRoutes.js

| Method | Endpoint           | Function                 | Description                          |
| ------ | ------------------ | ------------------------ | ------------------------------------ |
| POST   | `/api/auth/signup` | `router.post('/signup')` | Register new user with validation    |
| POST   | `/api/auth/login`  | `router.post('/login')`  | Authenticate user with Passport      |
| POST   | `/api/auth/logout` | `router.post('/logout')` | Logout and destroy session           |
| GET    | `/api/auth/logout` | `router.get('/logout')`  | Logout via GET for browser redirects |
| GET    | `/api/auth/check`  | `router.get('/check')`   | Check authentication status          |

### userRoutes.js

| Method | Endpoint                           | Function                               | Description              |
| ------ | ---------------------------------- | -------------------------------------- | ------------------------ |
| GET    | `/api/users`                       | `router.get('/')`                      | Get all users/donors     |
| GET    | `/api/users/:id`                   | `router.get('/:id')`                   | Get user by ID           |
| GET    | `/api/users/blood-type/:bloodType` | `router.get('/blood-type/:bloodType')` | Get donors by blood type |
| GET    | `/api/users/location/:location`    | `router.get('/location/:location')`    | Get donors by location   |
| PUT    | `/api/users/:id`                   | `router.put('/:id')`                   | Update user profile      |
| PUT    | `/api/users/:id/password`          | `router.put('/:id/password')`          | Update user password     |
| DELETE | `/api/users/:id`                   | `router.delete('/:id')`                | Delete user account      |

### profileRoutes.js

| Method | Endpoint                   | Function                     | Description                   |
| ------ | -------------------------- | ---------------------------- | ----------------------------- |
| GET    | `/api/profile`             | `router.get('/')`            | Get current user's profile    |
| PUT    | `/api/profile`             | `router.put('/')`            | Update current user's profile |
| GET    | `/api/profile/donations`   | `router.get('/donations')`   | Get donation history          |
| GET    | `/api/profile/reports`     | `router.get('/reports')`     | Get health reports            |
| GET    | `/api/profile/eligibility` | `router.get('/eligibility')` | Check donation eligibility    |
| GET    | `/api/profile/stats`       | `router.get('/stats')`       | Get user statistics           |

### donationRoutes.js

| Method | Endpoint                              | Function                              | Description               |
| ------ | ------------------------------------- | ------------------------------------- | ------------------------- |
| POST   | `/api/donations`                      | `router.post('/')`                    | Create donation record    |
| GET    | `/api/donations`                      | `router.get('/')`                     | Get recent donations      |
| GET    | `/api/donations/stats`                | `router.get('/stats')`                | Get donation statistics   |
| GET    | `/api/donations/:id`                  | `router.get('/:id')`                  | Get donation by ID        |
| PUT    | `/api/donations/:id/status`           | `router.put('/:id/status')`           | Update donation status    |
| GET    | `/api/donations/user/:userId`         | `router.get('/user/:userId')`         | Get donations by user     |
| GET    | `/api/donations/hospital/:hospitalId` | `router.get('/hospital/:hospitalId')` | Get donations by hospital |

### recipientRoutes.js

| Method | Endpoint                                  | Function                                 | Description                 |
| ------ | ----------------------------------------- | ---------------------------------------- | --------------------------- |
| POST   | `/api/recipients`                         | `router.post('/')`                       | Create blood request        |
| GET    | `/api/recipients`                         | `router.get('/')`                        | Get pending requests        |
| GET    | `/api/recipients/urgent`                  | `router.get('/urgent')`                  | Get urgent requests         |
| GET    | `/api/recipients/blood-group/:bloodGroup` | `router.get('/blood-group/:bloodGroup')` | Get requests by blood group |
| GET    | `/api/recipients/:id`                     | `router.get('/:id')`                     | Get request by ID           |
| PUT    | `/api/recipients/:id/status`              | `router.put('/:id/status')`              | Update request status       |
| GET    | `/api/recipients/user/:userId`            | `router.get('/user/:userId')`            | Get requests by user        |

### hbcRoutes.js

| Method | Endpoint                      | Function                            | Description                     |
| ------ | ----------------------------- | ----------------------------------- | ------------------------------- |
| GET    | `/api/hbc`                    | `router.get('/')`                   | Get all hospitals/blood centers |
| GET    | `/api/hbc/:id`                | `router.get('/:id')`                | Get HBC by ID                   |
| GET    | `/api/hbc/city/:city`         | `router.get('/city/:city')`         | Get HBCs by city                |
| GET    | `/api/hbc/division/:division` | `router.get('/division/:division')` | Get HBCs by division            |
| GET    | `/api/hbc/type/:type`         | `router.get('/type/:type')`         | Get HBCs by organization type   |
| GET    | `/api/hbc/blood/:bloodType`   | `router.get('/blood/:bloodType')`   | Get HBCs with blood available   |
| POST   | `/api/hbc`                    | `router.post('/')`                  | Create new HBC                  |
| PUT    | `/api/hbc/:id`                | `router.put('/:id')`                | Update HBC                      |
| PUT    | `/api/hbc/:id/inventory`      | `router.put('/:id/inventory')`      | Update blood inventory          |
| DELETE | `/api/hbc/:id`                | `router.delete('/:id')`             | Deactivate HBC                  |

### reportRoutes.js

| Method | Endpoint                                | Function                                  | Description             |
| ------ | --------------------------------------- | ----------------------------------------- | ----------------------- |
| POST   | `/api/reports`                          | `router.post('/')`                        | Create health report    |
| GET    | `/api/reports/:id`                      | `router.get('/:id')`                      | Get report by ID        |
| GET    | `/api/reports/user/:userId`             | `router.get('/user/:userId')`             | Get reports by user     |
| GET    | `/api/reports/user/:userId/latest`      | `router.get('/user/:userId/latest')`      | Get latest report       |
| GET    | `/api/reports/user/:userId/eligibility` | `router.get('/user/:userId/eligibility')` | Check eligibility       |
| GET    | `/api/reports/hospital/:hospitalId`     | `router.get('/hospital/:hospitalId')`     | Get reports by hospital |
| PUT    | `/api/reports/:id`                      | `router.put('/:id')`                      | Update report           |
| DELETE | `/api/reports/:id`                      | `router.delete('/:id')`                   | Delete report           |

---

## Middleware

### auth.js

| Function          | Parameters       | Description                                      |
| ----------------- | ---------------- | ------------------------------------------------ |
| `isAuthenticated` | `req, res, next` | Checks if user is authenticated                  |
| `optionalAuth`    | `req, res, next` | Allows access but attaches user if authenticated |
| `isAdmin`         | `req, res, next` | Checks if user has admin role                    |

### errorHandler.js

| Class/Function              | Description                                 |
| --------------------------- | ------------------------------------------- |
| `AppError`                  | Base error class with statusCode and status |
| `ResourceNotFoundException` | 404 error for missing resources             |
| `ValidationError`           | 400 error for validation failures           |
| `AuthenticationError`       | 401 error for auth failures                 |
| `AuthorizationError`        | 403 error for permission denied             |
| `errorHandler`              | Global error handling middleware            |
| `handleCastErrorDB`         | Handles MongoDB invalid ObjectId errors     |
| `handleDuplicateFieldsDB`   | Handles MongoDB duplicate key errors        |
| `handleValidationErrorDB`   | Handles Mongoose validation errors          |
| `asyncHandler`              | Wraps async route handlers to catch errors  |

---

## Configuration

### passport.js

| Function          | Description                                 |
| ----------------- | ------------------------------------------- |
| `LocalStrategy`   | Configures username/password authentication |
| `serializeUser`   | Serializes user ID to session               |
| `deserializeUser` | Deserializes user from session              |

### database.js

| Function      | Return Type           | Description                                       |
| ------------- | --------------------- | ------------------------------------------------- |
| `connectDB()` | `Promise<Connection>` | Connects to MongoDB and handles connection events |

---

## Summary Statistics (Node.js Backend)

| Category                | Count   |
| ----------------------- | ------- |
| Models                  | 5       |
| Services                | 5       |
| Route Files             | 7       |
| Middleware Files        | 2       |
| Configuration Files     | 2       |
| **Total API Endpoints** | **~50** |

---

_Document updated on January 9, 2026_
