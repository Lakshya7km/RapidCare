# RapidCare - Comprehensive Testing Plan & Project Analysis

**Generated:** $(date)  
**Project:** RapidCare Healthcare Management System  
**Version:** 1.0.0

---

## 📋 Table of Contents

1. [Directory Structure Analysis](#1-directory-structure-analysis)
2. [Feature Discovery](#2-feature-discovery)
3. [Complete Testing Plan](#3-complete-testing-plan)
4. [Critical Tests](#4-critical-tests)
5. [QA Checklist](#5-qa-checklist)
6. [Final Report](#6-final-report)

---

## 1️⃣ Directory Structure Analysis

### Project Root Structure

```
rapidcare01-main/
├── server.js                    # Main Express server entry point
├── package.json                 # Dependencies & scripts
├── .env                         # Environment variables (JWT_SECRET, MONGO_URI, PORT)
│
├── middleware/
│   └── auth.js                  # JWT authentication middleware (role-based access control)
│
├── models/                      # Mongoose database schemas
│   ├── Hospital.js              # Hospital model (with password hashing, address, gallery, QR codes)
│   ├── Doctor.js                # Doctor model (with attendance tracking, photoUrl)
│   ├── Ambulance.js             # Ambulance model (with EMT/Pilot info, location tracking)
│   ├── EmergencyRequest.js      # Emergency request model (status workflow)
│   ├── Bed.js                   # Bed model (with QR codes, status tracking)
│   └── Attendance.js            # Doctor attendance tracking model
│
├── routes/                      # Express API route handlers
│   ├── auth.js                  # Login, password change endpoints
│   ├── hospital.js              # Hospital CRUD, gallery upload, QR generation
│   ├── doctors.js               # Doctor CRUD, attendance, photo upload
│   ├── ambulances.js            # Ambulance CRUD, location updates
│   ├── beds.js                  # Bed CRUD, QR generation, scanning
│   ├── emergency.js             # Emergency request workflow (public/ambulance submission, accept/reject/transfer)
│   └── reset.js                 # Database reset utility
│
├── utils/                       # Utility functions
│   ├── coordinateExtractor.js   # Google Maps URL parsing, Haversine distance calculation
│   ├── errorHandler.js          # Centralized error handling (ValidationError, DuplicateKeyError, CastError)
│   └── validators.js            # Input validation utilities
│
├── public/                      # Frontend static files
│   ├── index.html               # Login/Registration portal (all roles)
│   ├── reception.html           # Reception Portal (hospital management)
│   ├── doctor.html              # Doctor Portal (profile, attendance)
│   ├── ambulance.html           # Ambulance Portal (emergency requests, location)
│   ├── public.html              # Public Portal (hospital search, nearest hospital, emergency submission)
│   ├── test-toasts.html         # Notification system test page
│   │
│   ├── css/
│   │   └── styles.css           # Global stylesheet
│   │
│   ├── js/
│   │   ├── client.js            # API client, token management, WebSocket, polling, notifications
│   │   └── reset-db.js          # Database reset utility (frontend)
│   │
│   └── images/                  # Static assets
│       ├── logo.png
│       ├── hospital.png
│       ├── doctor.png
│       ├── ambulance.png
│       └── ...
│
└── uploads/                     # File uploads directory
    ├── hospital-gallery/        # Hospital gallery images (by hospitalId)
    ├── hospitals/               # Doctor photos (by hospitalId/doctors/)
    ├── qr/                      # Attendance QR codes
    └── qrs/                     # Bed QR codes
```

### Folder Explanations

#### `/middleware`
- **auth.js**: JWT token verification, role-based authorization (hospital, doctor, ambulance)
- Validates `Authorization: Bearer <token>` header
- Returns 401 for missing/invalid tokens, 403 for unauthorized roles

#### `/models`
- **Hospital.js**: Hospital registration, gallery, QR codes, Google Maps integration
- **Doctor.js**: Doctor profiles, attendance tracking, photo uploads
- **Ambulance.js**: Ambulance fleet management, EMT/Pilot info, location tracking
- **EmergencyRequest.js**: Emergency request lifecycle (Pending → Accepted/Rejected/Transferred → Handled)
- **Bed.js**: Bed management, QR codes for scanning, status tracking
- **Attendance.js**: Doctor attendance records (date, shift, status)

#### `/routes`
- **auth.js**: `/api/auth/login`, `/api/auth/change-password`
- **hospital.js**: Hospital CRUD, gallery upload/delete, attendance QR generation
- **doctors.js**: Doctor CRUD, photo upload, attendance marking, QR generation
- **ambulances.js**: Ambulance CRUD, location updates
- **beds.js**: Bed CRUD, QR generation (single/mass), scanning endpoints
- **emergency.js**: Emergency request submission (public/ambulance), accept/reject/transfer/handle workflow

#### `/utils`
- **coordinateExtractor.js**: Extracts lat/lng from Google Maps URLs, updates hospital coordinates
- **errorHandler.js**: Centralized error responses (400, 404, 500)
- **validators.js**: Input validation helpers

#### `/public`
- **index.html**: Login portal for all roles, hospital registration
- **reception.html**: Dashboard, hospital info, beds, doctors, ambulances, emergencies management
- **doctor.html**: Profile management, attendance marking, QR scanning
- **ambulance.html**: Emergency request submission, live status, profile
- **public.html**: Hospital browsing, nearest hospital finder, emergency submission

---

## 2️⃣ Feature Discovery

### User Roles Identified

1. **Hospital/Reception** (`role: 'hospital'`)
   - Hospital registration & login
   - Hospital profile management
   - Bed management (create, update, QR generation)
   - Doctor management (register, update, delete)
   - Ambulance management (register, update, delete)
   - Emergency request handling (accept/reject/transfer/reply)
   - Gallery image upload/delete
   - Attendance QR generation

2. **Doctor** (`role: 'doctor'`)
   - Doctor login
   - Profile management (name, qualification, speciality, photo upload)
   - Attendance marking (Present/Absent, shift selection)
   - QR code scanning for attendance

3. **Ambulance** (`role: 'ambulance'`)
   - Ambulance login (by ambulanceId, emtId, or pilotId)
   - Emergency request submission (to ANY hospital)
   - Live request status tracking
   - Profile viewing
   - Location updates (lat/lng)

4. **Public** (No authentication)
   - Hospital browsing (search, filter by state/district/city/facilities)
   - Nearest hospital finder (GPS-based, Haversine distance)
   - Emergency request submission
   - Hospital gallery viewing

### API Endpoints Discovered

#### Authentication (`/api/auth`)
- `POST /api/auth/login` - Login for hospital/doctor/ambulance
- `POST /api/auth/change-password` - Password change

#### Hospital (`/api/hospital`)
- `GET /api/hospital` - List all hospitals (with filters: state, district, city, facilities, treatment, therapy, surgery, insurance)
- `POST /api/hospital` - Register new hospital (public, no auth)
- `GET /api/hospital/:hospitalId` - Get hospital details
- `PUT /api/hospital/:hospitalId` - Update hospital (auth: hospital)
- `POST /api/hospital/:hospitalId/gallery` - Upload gallery images (auth: hospital, multer)
- `DELETE /api/hospital/:hospitalId/gallery` - Delete gallery images (auth: hospital)
- `POST /api/hospital/:hospitalId/attendance-qr` - Generate attendance QR codes (auth: hospital)
- `GET /api/hospital/:hospitalId/attendance-qr-pdf` - Download attendance QR PDF (auth: hospital)
- `GET /api/hospital/:hospitalId/attendance-scan` - Scan attendance QR (public)

#### Doctors (`/api/doctors`)
- `GET /api/doctors/doctor/:doctorId` - Get doctor by ID
- `GET /api/doctors/:hospitalId` - Get all doctors for hospital
- `POST /api/doctors` - Register doctor (auth: hospital, multer photo upload)
- `POST /api/doctors/:doctorId/photo` - Upload doctor photo (auth: doctor/hospital)
- `PUT /api/doctors/:doctorId` - Update doctor profile (auth: doctor/hospital)
- `DELETE /api/doctors/:doctorId` - Delete doctor (auth: hospital)
- `POST /api/doctors/attendance` - Mark attendance (auth: doctor/hospital)
- `PUT /api/doctors/attendance/manual-update` - Manual attendance update (auth: hospital)
- `GET /api/doctors/attendance/:doctorId` - Get attendance history
- `GET /api/doctors/:doctorId/attendance/qrs` - Get attendance QR codes (auth: hospital/doctor)
- `GET /api/doctors/attendance/scan/:doctorId` - Scan attendance QR (public)

#### Ambulances (`/api/ambulances`)
- `GET /api/ambulances` - Get ambulance by username (query param)
- `GET /api/ambulances/:hospitalId` - Get all ambulances for hospital
- `POST /api/ambulances` - Register ambulance (auth: hospital)
- `PUT /api/ambulances/:ambulanceId` - Update ambulance (auth: hospital/ambulance)
- `PATCH /api/ambulances/:ambulanceId/location` - Update location (auth: ambulance)
- `DELETE /api/ambulances/:ambulanceId` - Delete ambulance (auth: hospital)

#### Beds (`/api/beds`)
- `GET /api/beds/:hospitalId` - Get all beds for hospital
- `POST /api/beds` - Create beds (bulk, auth: hospital)
- `GET /api/beds/:bedId/qr` - Get bed QR code (auth: hospital)
- `GET /api/beds/scan/:bedId` - Scan bed QR (public)
- `GET /api/beds/pdf/mass/:hospitalId` - Download mass QR PDF (public)
- `GET /api/beds/pdf/:bedId` - Download single bed QR PDF (public)
- `PUT /api/beds/:bedId` - Update bed status (auth: hospital)
- `DELETE /api/beds/:bedId` - Delete bed (auth: hospital)

#### Emergency Requests (`/api/emergency`)
- `GET /api/emergency/id/:id` - Get emergency by ID
- `POST /api/emergency/public` - Submit public emergency (no auth)
- `POST /api/emergency` - Submit ambulance emergency (auth: ambulance/hospital)
- `GET /api/emergency/:hospitalId` - Get emergencies for hospital
- `GET /api/emergency/public/all` - Get all public emergencies (auth: hospital)
- `GET /api/emergency/public/:hospitalId` - Get public emergencies for hospital
- `GET /api/emergency/ambulance/:hospitalId` - Get ambulance emergencies for hospital
- `PUT /api/emergency/:id/reply` - Reply to emergency (auth: hospital)
- `GET /api/emergency/detail/:id` - Get emergency details
- `PUT /api/emergency/:id/accept` - Accept emergency (auth: hospital)
- `PUT /api/emergency/:id/reject` - Reject emergency (auth: hospital)
- `PUT /api/emergency/:id/transfer` - Transfer emergency (auth: hospital)
- `PUT /api/emergency/:id/status` - Update status (auth: hospital)
- `PUT /api/emergency/:id/handled` - Mark as handled (auth: ambulance)
- `GET /api/emergency/my-requests/:ambulanceId` - Get ambulance's requests (auth: ambulance)
- `POST /api/emergency/:id/admit` - Admit patient (auth: hospital)
- `POST /api/emergency/:id/discharge` - Discharge patient (auth: hospital)
- `GET /api/emergency/:hospitalId/recommend` - Get recommended hospitals (public)

#### Database Reset (`/api/reset-db`)
- `POST /api/reset-db` - Reset database (public, no auth)

### Frontend Features Discovered

#### Reception Portal (`reception.html`)
- **Dashboard**: Stats (beds, doctors, ambulances, emergencies), quick actions
- **Hospital Info**: Profile editing, Google Maps URL, gallery upload/delete
- **Beds**: Create beds (bulk), QR generation (single/mass PDF), status updates, QR scanner
- **Doctors**: Register doctors, update profiles, view list, attendance management
- **Ambulances**: Register ambulances, view fleet, update status
- **Emergencies**: View all emergencies, accept/reject/transfer/reply, filter by status
- **DBMS**: Database reset utility

#### Doctor Portal (`doctor.html`)
- **Dashboard**: Profile summary, quick actions
- **Profile**: Edit name, qualification, speciality, experience, upload photo
- **Attendance**: Mark attendance (Present/Absent, shift), scan QR codes

#### Ambulance Portal (`ambulance.html`)
- **Dashboard**: Hospital contact info, stats, quick actions
- **Emergency Form**: Submit emergency request (select hospital from dropdown)
- **Live Status**: View submitted requests, status updates
- **Profile**: View ambulance details, crew info, password change

#### Public Portal (`public.html`)
- **Hospital List**: Browse hospitals, filter by location/facilities, view gallery
- **Nearest Hospital**: GPS-based nearest hospital finder (Haversine distance)
- **Emergency Request**: Submit emergency request (select hospital)

#### Login Portal (`index.html`)
- **Login**: Hospital/Doctor/Ambulance login
- **Registration**: Hospital registration form

### Image Upload Features

1. **Hospital Gallery** (`/api/hospital/:hospitalId/gallery`)
   - Multiple images (max 12)
   - Stored in `uploads/hospital-gallery/:hospitalId/`
   - Formats: JPG, PNG, GIF, WebP
   - Max size: 5MB per image

2. **Doctor Photo** (`/api/doctors/:doctorId/photo`)
   - Single image
   - Stored in `uploads/hospitals/:hospitalId/doctors/`
   - Formats: JPG, PNG, GIF, WebP
   - Max size: 5MB

### Location/Map Features

1. **Google Maps Integration**
   - Hospital registration includes `googleMapUrl` field
   - Coordinates extracted automatically via `coordinateExtractor.js`
   - Stored in `hospital.location.lat` and `hospital.location.lng`

2. **Nearest Hospital Finder**
   - Uses browser Geolocation API
   - Calculates Haversine distance to all hospitals
   - Displays nearest hospital with distance, address, phone, "Navigate Now" button

3. **Ambulance Location Tracking**
   - Ambulance can update location via `PATCH /api/ambulances/:ambulanceId/location`
   - Real-time updates via Socket.IO

### Real-time Features (Socket.IO)

1. **Hospital Rooms**: `joinHospitalRoom(hospitalId)` - Scoped updates per hospital
2. **Bed Updates**: `bed:update`, `bed:publicUpdate`
3. **Doctor Updates**: `doctor:attendance`, `doctor:update`, `doctor:publicUpdate`
4. **Emergency Updates**: `emergency:new:public`, `emergency:new:ambulance`, `emergency:update`
5. **Ambulance Updates**: `ambulance:location`, `ambulance:statusUpdate`, `ambulance:heartbeat`
6. **Hospital Updates**: `hospital:update`, `hospital:publicUpdate`
7. **Notifications**: `notification` (broadcast or scoped)

### QR Code Features

1. **Bed QR Codes**
   - Generated on bed creation
   - URLs: `/api/beds/scan/:bedId`
   - PDF download (single or mass)

2. **Attendance QR Codes**
   - Generated for Present/Absent
   - URLs: `/api/doctors/attendance/scan/:doctorId`
   - PDF download

---

## 3️⃣ Complete Testing Plan

### Test Case Format

Each test case includes:
- **Test ID**: Unique identifier
- **Test Name**: Descriptive name
- **Module**: Component being tested
- **Prerequisites**: Setup requirements
- **Steps**: Step-by-step actions
- **Expected Result**: What should happen
- **Actual Result**: What actually happened (to be filled during testing)
- **Status**: Pass/Fail/Skip
- **Error Messages**: Any errors encountered

---

### Authentication & Authorization Tests

#### TC-AUTH-001: Hospital Login - Valid Credentials
- **Module**: Authentication
- **API**: `POST /api/auth/login`
- **Prerequisites**: Hospital registered in database
- **Steps**:
  1. Send POST request to `/api/auth/login`
  2. Body: `{ role: "hospital", username: "HOSP001", password: "test@1234" }`
- **Expected Result**: Returns 200, `{ token: "...", forcePasswordChange: true/false }`
- **Status**: ⬜ Pending

#### TC-AUTH-002: Hospital Login - Invalid Credentials
- **Module**: Authentication
- **API**: `POST /api/auth/login`
- **Steps**:
  1. Send POST request with wrong password
- **Expected Result**: Returns 401, `{ message: "Invalid credentials" }`
- **Status**: ⬜ Pending

#### TC-AUTH-003: Doctor Login - Valid Credentials
- **Module**: Authentication
- **API**: `POST /api/auth/login`
- **Steps**:
  1. Send POST with `{ role: "doctor", username: "DOC100", password: "test@1234" }`
- **Expected Result**: Returns 200, includes `hospitalId` in response
- **Status**: ⬜ Pending

#### TC-AUTH-004: Ambulance Login - Valid Credentials (by ambulanceId)
- **Module**: Authentication
- **API**: `POST /api/auth/login`
- **Steps**:
  1. Send POST with `{ role: "ambulance", username: "AMB001", password: "test@1234" }`
- **Expected Result**: Returns 200, sets status to "On Duty"
- **Status**: ⬜ Pending

#### TC-AUTH-005: Ambulance Login - Valid Credentials (by emtId)
- **Module**: Authentication
- **API**: `POST /api/auth/login`
- **Steps**:
  1. Login using EMT ID instead of ambulanceId
- **Expected Result**: Returns 200, login successful
- **Status**: ⬜ Pending

#### TC-AUTH-006: Missing Token
- **Module**: Authorization
- **API**: Any protected route
- **Steps**:
  1. Send request without `Authorization` header
- **Expected Result**: Returns 401, `{ message: "Missing token" }`
- **Status**: ⬜ Pending

#### TC-AUTH-007: Invalid Token
- **Module**: Authorization
- **API**: Any protected route
- **Steps**:
  1. Send request with `Authorization: Bearer invalid_token`
- **Expected Result**: Returns 401, `{ message: "Invalid token" }`
- **Status**: ⬜ Pending

#### TC-AUTH-008: Expired Token
- **Module**: Authorization
- **API**: Any protected route
- **Steps**:
  1. Use token older than 12 hours
- **Expected Result**: Returns 401, `{ message: "Invalid token" }` (JWT expiration)
- **Status**: ⬜ Pending

#### TC-AUTH-009: Wrong Role Access
- **Module**: Authorization
- **API**: `POST /api/doctors` (requires hospital role)
- **Steps**:
  1. Login as doctor, try to create doctor
- **Expected Result**: Returns 403, `{ message: "Forbidden" }`
- **Status**: ⬜ Pending

#### TC-AUTH-010: Password Change - Valid
- **Module**: Authentication
- **API**: `POST /api/auth/change-password`
- **Steps**:
  1. Send POST with valid role, username, newPassword
- **Expected Result**: Returns 200, `{ success: true }`, `forcePasswordChange` set to false
- **Status**: ⬜ Pending

---

### Hospital Management Tests

#### TC-HOSP-001: List All Hospitals
- **Module**: Hospital
- **API**: `GET /api/hospital`
- **Steps**:
  1. Send GET request
- **Expected Result**: Returns 200, array of hospitals
- **Status**: ⬜ Pending

#### TC-HOSP-002: List Hospitals with Filters
- **Module**: Hospital
- **API**: `GET /api/hospital?state=Chhattisgarh&city=Raipur`
- **Steps**:
  1. Send GET with query parameters
- **Expected Result**: Returns filtered hospitals
- **Status**: ⬜ Pending

#### TC-HOSP-003: Register Hospital - Valid
- **Module**: Hospital
- **API**: `POST /api/hospital`
- **Steps**:
  1. Send POST with hospitalId, name, contact, address, googleMapUrl
- **Expected Result**: Returns 200, hospital created, coordinates extracted
- **Status**: ⬜ Pending

#### TC-HOSP-004: Register Hospital - Duplicate ID
- **Module**: Hospital
- **API**: `POST /api/hospital`
- **Steps**:
  1. Register hospital with existing hospitalId
- **Expected Result**: Returns 400, duplicate key error
- **Status**: ⬜ Pending

#### TC-HOSP-005: Get Hospital Details
- **Module**: Hospital
- **API**: `GET /api/hospital/:hospitalId`
- **Steps**:
  1. Send GET request
- **Expected Result**: Returns 200, hospital object
- **Status**: ⬜ Pending

#### TC-HOSP-006: Update Hospital - Authorized
- **Module**: Hospital
- **API**: `PUT /api/hospital/:hospitalId`
- **Prerequisites**: Login as hospital
- **Steps**:
  1. Send PUT with updated fields
- **Expected Result**: Returns 200, hospital updated, coordinates recalculated
- **Status**: ⬜ Pending

#### TC-HOSP-007: Update Hospital - Unauthorized (Wrong Hospital)
- **Module**: Hospital
- **API**: `PUT /api/hospital/:hospitalId`
- **Steps**:
  1. Login as HOSP001, try to update HOSP002
- **Expected Result**: Returns 403, `{ message: "Forbidden" }`
- **Status**: ⬜ Pending

#### TC-HOSP-008: Upload Gallery Images - Valid
- **Module**: Hospital
- **API**: `POST /api/hospital/:hospitalId/gallery`
- **Prerequisites**: Login as hospital, prepare image files
- **Steps**:
  1. Send POST with FormData containing images
  2. Headers: `Authorization: Bearer <token>`
- **Expected Result**: Returns 200, `{ success: true, gallery: [...] }`
- **Status**: ⬜ Pending

#### TC-HOSP-009: Upload Gallery Images - Invalid Token
- **Module**: Hospital
- **API**: `POST /api/hospital/:hospitalId/gallery`
- **Steps**:
  1. Send POST without token
- **Expected Result**: Returns 401, `{ message: "Missing token" }`
- **Status**: ⬜ Pending

#### TC-HOSP-010: Upload Gallery Images - Wrong Hospital
- **Module**: Hospital
- **API**: `POST /api/hospital/:hospitalId/gallery`
- **Steps**:
  1. Login as HOSP001, try to upload to HOSP002 gallery
- **Expected Result**: Returns 403, `{ message: "Forbidden: Cannot upload to other hospital galleries" }`
- **Status**: ⬜ Pending

#### TC-HOSP-011: Upload Gallery Images - Large File (>5MB)
- **Module**: Hospital
- **API**: `POST /api/hospital/:hospitalId/gallery`
- **Steps**:
  1. Upload image >5MB
- **Expected Result**: Returns 400 or multer error
- **Status**: ⬜ Pending

#### TC-HOSP-012: Upload Gallery Images - Wrong Format
- **Module**: Hospital
- **API**: `POST /api/hospital/:hospitalId/gallery`
- **Steps**:
  1. Upload .txt or .pdf file
- **Expected Result**: Returns 400 or multer error
- **Status**: ⬜ Pending

#### TC-HOSP-013: Delete Gallery Image - Valid
- **Module**: Hospital
- **API**: `DELETE /api/hospital/:hospitalId/gallery`
- **Steps**:
  1. Send DELETE with `{ items: ["filename.jpg"] }`
- **Expected Result**: Returns 200, image removed from gallery array
- **Status**: ⬜ Pending

#### TC-HOSP-014: Generate Attendance QR Codes
- **Module**: Hospital
- **API**: `POST /api/hospital/:hospitalId/attendance-qr`
- **Steps**:
  1. Send POST request
- **Expected Result**: Returns 200, QR codes generated and saved
- **Status**: ⬜ Pending

#### TC-HOSP-015: Download Attendance QR PDF
- **Module**: Hospital
- **API**: `GET /api/hospital/:hospitalId/attendance-qr-pdf`
- **Steps**:
  1. Send GET request
- **Expected Result**: Returns PDF file
- **Status**: ⬜ Pending

---

### Doctor Management Tests

#### TC-DOC-001: Register Doctor - Valid
- **Module**: Doctor
- **API**: `POST /api/doctors`
- **Prerequisites**: Login as hospital
- **Steps**:
  1. Send POST with FormData (doctorId, name, speciality, photo)
- **Expected Result**: Returns 200, doctor created
- **Status**: ⬜ Pending

#### TC-DOC-002: Register Doctor - Unauthorized (Doctor Role)
- **Module**: Doctor
- **API**: `POST /api/doctors`
- **Steps**:
  1. Login as doctor, try to register doctor
- **Expected Result**: Returns 403, `{ message: "Forbidden" }`
- **Status**: ⬜ Pending

#### TC-DOC-003: Get Doctor by ID
- **Module**: Doctor
- **API**: `GET /api/doctors/doctor/:doctorId`
- **Steps**:
  1. Send GET request
- **Expected Result**: Returns 200, doctor object
- **Status**: ⬜ Pending

#### TC-DOC-004: Get Doctors by Hospital
- **Module**: Doctor
- **API**: `GET /api/doctors/:hospitalId`
- **Steps**:
  1. Send GET request
- **Expected Result**: Returns 200, array of doctors
- **Status**: ⬜ Pending

#### TC-DOC-005: Update Doctor Profile - Authorized (Doctor)
- **Module**: Doctor
- **API**: `PUT /api/doctors/:doctorId`
- **Prerequisites**: Login as doctor
- **Steps**:
  1. Update own profile
- **Expected Result**: Returns 200, profile updated
- **Status**: ⬜ Pending

#### TC-DOC-006: Update Doctor Profile - Unauthorized (Wrong Doctor)
- **Module**: Doctor
- **API**: `PUT /api/doctors/:doctorId`
- **Steps**:
  1. Login as DOC100, try to update DOC101
- **Expected Result**: Returns 403, `{ message: "Forbidden: Token does not match doctor ID" }`
- **Status**: ⬜ Pending

#### TC-DOC-007: Upload Doctor Photo - Valid
- **Module**: Doctor
- **API**: `POST /api/doctors/:doctorId/photo`
- **Prerequisites**: Login as doctor
- **Steps**:
  1. Send POST with FormData containing photo
- **Expected Result**: Returns 200, photoUrl updated
- **Status**: ⬜ Pending

#### TC-DOC-008: Upload Doctor Photo - Large File (>5MB)
- **Module**: Doctor
- **API**: `POST /api/doctors/:doctorId/photo`
- **Steps**:
  1. Upload photo >5MB
- **Expected Result**: Returns 400, `{ message: "File size exceeds 5MB limit" }`
- **Status**: ⬜ Pending

#### TC-DOC-009: Mark Attendance - Doctor (Own)
- **Module**: Doctor
- **API**: `POST /api/doctors/attendance`
- **Prerequisites**: Login as doctor
- **Steps**:
  1. Send POST with `{ doctorId: "DOC100", date: "2024-01-01", availability: "Present", shift: "Morning" }`
- **Expected Result**: Returns 200, attendance marked
- **Status**: ⬜ Pending

#### TC-DOC-010: Mark Attendance - Unauthorized (Wrong Doctor)
- **Module**: Doctor
- **API**: `POST /api/doctors/attendance`
- **Steps**:
  1. Login as DOC100, try to mark attendance for DOC101
- **Expected Result**: Returns 403, `{ message: "Forbidden: You can only mark your own attendance" }`
- **Status**: ⬜ Pending

#### TC-DOC-011: Mark Attendance - Hospital (Authorized)
- **Module**: Doctor
- **API**: `POST /api/doctors/attendance`
- **Prerequisites**: Login as hospital, doctor belongs to hospital
- **Steps**:
  1. Mark attendance for doctor in same hospital
- **Expected Result**: Returns 200, attendance marked
- **Status**: ⬜ Pending

#### TC-DOC-012: Mark Attendance - Hospital (Unauthorized)
- **Module**: Doctor
- **API**: `POST /api/doctors/attendance`
- **Steps**:
  1. Login as HOSP001, try to mark attendance for doctor in HOSP002
- **Expected Result**: Returns 403, `{ message: "Forbidden: Cannot mark attendance for doctors from other hospitals" }`
- **Status**: ⬜ Pending

#### TC-DOC-013: Delete Doctor - Authorized
- **Module**: Doctor
- **API**: `DELETE /api/doctors/:doctorId`
- **Prerequisites**: Login as hospital
- **Steps**:
  1. Delete doctor from own hospital
- **Expected Result**: Returns 200, doctor deleted
- **Status**: ⬜ Pending

---

### Ambulance Management Tests

#### TC-AMB-001: Register Ambulance - Valid
- **Module**: Ambulance
- **API**: `POST /api/ambulances`
- **Prerequisites**: Login as hospital
- **Steps**:
  1. Send POST with ambulanceId, hospitalId, ambulanceNumber, emt, pilot
- **Expected Result**: Returns 200, ambulance created
- **Status**: ⬜ Pending

#### TC-AMB-002: Register Ambulance - Wrong Hospital
- **Module**: Ambulance
- **API**: `POST /api/ambulances`
- **Steps**:
  1. Login as HOSP001, try to register ambulance for HOSP002
- **Expected Result**: Returns 403, `{ message: "Forbidden: Your hospital ID does not match" }`
- **Status**: ⬜ Pending

#### TC-AMB-003: Get Ambulance by Username
- **Module**: Ambulance
- **API**: `GET /api/ambulances?username=AMB001`
- **Steps**:
  1. Send GET request
- **Expected Result**: Returns 200, ambulance object
- **Status**: ⬜ Pending

#### TC-AMB-004: Get Ambulances by Hospital
- **Module**: Ambulance
- **API**: `GET /api/ambulances/:hospitalId`
- **Steps**:
  1. Send GET request
- **Expected Result**: Returns 200, array of ambulances
- **Status**: ⬜ Pending

#### TC-AMB-005: Update Ambulance Location
- **Module**: Ambulance
- **API**: `PATCH /api/ambulances/:ambulanceId/location`
- **Prerequisites**: Login as ambulance
- **Steps**:
  1. Send PATCH with `{ lat: 21.2567, lng: 81.6294 }`
- **Expected Result**: Returns 200, location updated, Socket.IO event emitted
- **Status**: ⬜ Pending

#### TC-AMB-006: Update Ambulance Location - Unauthorized
- **Module**: Ambulance
- **API**: `PATCH /api/ambulances/:ambulanceId/location`
- **Steps**:
  1. Login as hospital, try to update location
- **Expected Result**: Returns 403, `{ message: "Forbidden" }`
- **Status**: ⬜ Pending

---

### Bed Management Tests

#### TC-BED-001: Create Beds - Bulk
- **Module**: Bed
- **API**: `POST /api/beds`
- **Prerequisites**: Login as hospital
- **Steps**:
  1. Send POST with `{ hospitalId, wardNumber, bedType, start: 1, end: 10 }`
- **Expected Result**: Returns 200, 10 beds created with QR codes
- **Status**: ⬜ Pending

#### TC-BED-002: Create Beds - Unauthorized
- **Module**: Bed
- **API**: `POST /api/beds`
- **Steps**:
  1. Send POST without auth
- **Expected Result**: Returns 401, `{ message: "Missing token" }`
- **Status**: ⬜ Pending

#### TC-BED-003: Get Beds by Hospital
- **Module**: Bed
- **API**: `GET /api/beds/:hospitalId`
- **Steps**:
  1. Send GET request
- **Expected Result**: Returns 200, array of beds
- **Status**: ⬜ Pending

#### TC-BED-004: Get Bed QR Code
- **Module**: Bed
- **API**: `GET /api/beds/:bedId/qr`
- **Prerequisites**: Login as hospital
- **Steps**:
  1. Send GET request
- **Expected Result**: Returns QR code image
- **Status**: ⬜ Pending

#### TC-BED-005: Scan Bed QR Code
- **Module**: Bed
- **API**: `GET /api/beds/scan/:bedId`
- **Steps**:
  1. Send GET request (public, no auth)
- **Expected Result**: Returns 200, bed details
- **Status**: ⬜ Pending

#### TC-BED-006: Update Bed Status
- **Module**: Bed
- **API**: `PUT /api/beds/:bedId`
- **Prerequisites**: Login as hospital
- **Steps**:
  1. Update status to "Occupied"
- **Expected Result**: Returns 200, status updated, Socket.IO event emitted
- **Status**: ⬜ Pending

#### TC-BED-007: Delete Bed
- **Module**: Bed
- **API**: `DELETE /api/beds/:bedId`
- **Prerequisites**: Login as hospital
- **Steps**:
  1. Send DELETE request
- **Expected Result**: Returns 200, bed deleted
- **Status**: ⬜ Pending

---

### Emergency Request Tests

#### TC-EMG-001: Submit Public Emergency - Valid
- **Module**: Emergency
- **API**: `POST /api/emergency/public`
- **Steps**:
  1. Send POST with patient info, hospitalId
- **Expected Result**: Returns 200, emergency created, Socket.IO event emitted
- **Status**: ⬜ Pending

#### TC-EMG-002: Submit Public Emergency - Missing Hospital ID
- **Module**: Emergency
- **API**: `POST /api/emergency/public`
- **Steps**:
  1. Send POST without hospitalId
- **Expected Result**: Returns 400, `{ message: "A target hospitalId is required" }`
- **Status**: ⬜ Pending

#### TC-EMG-003: Submit Ambulance Emergency - Valid
- **Module**: Emergency
- **API**: `POST /api/emergency`
- **Prerequisites**: Login as ambulance
- **Steps**:
  1. Send POST with patient info, hospitalId (can be any hospital)
- **Expected Result**: Returns 200, emergency created
- **Status**: ⬜ Pending

#### TC-EMG-004: Submit Ambulance Emergency - Any Hospital
- **Module**: Emergency
- **API**: `POST /api/emergency`
- **Prerequisites**: Login as ambulance from HOSP001
- **Steps**:
  1. Submit emergency to HOSP002
- **Expected Result**: Returns 200, request sent successfully (ambulance can send to any hospital)
- **Status**: ⬜ Pending

#### TC-EMG-005: Accept Emergency - Authorized
- **Module**: Emergency
- **API**: `PUT /api/emergency/:id/accept`
- **Prerequisites**: Login as hospital
- **Steps**:
  1. Accept emergency request
- **Expected Result**: Returns 200, status changed to "Accepted", Socket.IO event emitted
- **Status**: ⬜ Pending

#### TC-EMG-006: Reject Emergency - Authorized
- **Module**: Emergency
- **API**: `PUT /api/emergency/:id/reject`
- **Prerequisites**: Login as hospital
- **Steps**:
  1. Reject emergency with reason
- **Expected Result**: Returns 200, status changed to "Rejected"
- **Status**: ⬜ Pending

#### TC-EMG-007: Transfer Emergency - Authorized
- **Module**: Emergency
- **API**: `PUT /api/emergency/:id/transfer`
- **Prerequisites**: Login as hospital
- **Steps**:
  1. Transfer to alternate hospital
- **Expected Result**: Returns 200, status changed to "Transferred"
- **Status**: ⬜ Pending

#### TC-EMG-008: Get Emergency Details
- **Module**: Emergency
- **API**: `GET /api/emergency/detail/:id`
- **Steps**:
  1. Send GET request
- **Expected Result**: Returns 200, emergency object
- **Status**: ⬜ Pending

#### TC-EMG-009: Get Ambulance's Requests
- **Module**: Emergency
- **API**: `GET /api/emergency/my-requests/:ambulanceId`
- **Prerequisites**: Login as ambulance
- **Steps**:
  1. Send GET request
- **Expected Result**: Returns 200, array of emergencies
- **Status**: ⬜ Pending

---

### Frontend UI Tests

#### TC-UI-001: Login Portal - Hospital Login
- **Module**: Frontend
- **Page**: `index.html`
- **Steps**:
  1. Enter hospital credentials
  2. Click "Login to Reception"
- **Expected Result**: Redirects to `reception.html`, token stored in localStorage
- **Status**: ⬜ Pending

#### TC-UI-002: Login Portal - Doctor Login
- **Module**: Frontend
- **Page**: `index.html`
- **Steps**:
  1. Enter doctor credentials
  2. Click "Login as Doctor"
- **Expected Result**: Redirects to `doctor.html`, token stored
- **Status**: ⬜ Pending

#### TC-UI-003: Login Portal - Ambulance Login
- **Module**: Frontend
- **Page**: `index.html`
- **Steps**:
  1. Enter ambulance credentials
  2. Click "Login to Ambulance"
- **Expected Result**: Redirects to `ambulance.html`, token stored
- **Status**: ⬜ Pending

#### TC-UI-004: Reception Portal - Dashboard Load
- **Module**: Frontend
- **Page**: `reception.html`
- **Prerequisites**: Login as hospital
- **Steps**:
  1. Open reception portal
- **Expected Result**: Dashboard shows stats, beds, doctors, ambulances, emergencies
- **Status**: ⬜ Pending

#### TC-UI-005: Reception Portal - Upload Gallery Images
- **Module**: Frontend
- **Page**: `reception.html`
- **Steps**:
  1. Go to Hospital Info section
  2. Select images
  3. Click "Upload Photos"
- **Expected Result**: Images uploaded, success notification shown, gallery refreshed
- **Status**: ⬜ Pending

#### TC-UI-006: Reception Portal - Upload Gallery - Invalid Token
- **Module**: Frontend
- **Page**: `reception.html`
- **Steps**:
  1. Clear localStorage token
  2. Try to upload images
- **Expected Result**: Error notification "Session expired", redirects to login
- **Status**: ⬜ Pending

#### TC-UI-007: Doctor Portal - Update Profile
- **Module**: Frontend
- **Page**: `doctor.html`
- **Prerequisites**: Login as doctor
- **Steps**:
  1. Go to Profile section
  2. Update name, speciality
  3. Click "Save Profile"
- **Expected Result**: Profile updated, success notification shown
- **Status**: ⬜ Pending

#### TC-UI-008: Doctor Portal - Upload Photo
- **Module**: Frontend
- **Page**: `doctor.html`
- **Steps**:
  1. Select photo file
  2. Click "Save Profile"
- **Expected Result**: Photo uploaded, preview updated
- **Status**: ⬜ Pending

#### TC-UI-009: Doctor Portal - Mark Attendance
- **Module**: Frontend
- **Page**: `doctor.html`
- **Steps**:
  1. Go to Attendance section
  2. Select "Present", shift "Morning"
  3. Click "Mark Attendance"
- **Expected Result**: Attendance marked, success notification shown
- **Status**: ⬜ Pending

#### TC-UI-010: Ambulance Portal - Submit Emergency Request
- **Module**: Frontend
- **Page**: `ambulance.html`
- **Prerequisites**: Login as ambulance
- **Steps**:
  1. Go to Emergency Form
  2. Fill patient details
  3. Select hospital from dropdown (can be any hospital)
  4. Click "Send Emergency Alert"
- **Expected Result**: Request submitted, success notification, redirects to Live Status
- **Status**: ⬜ Pending

#### TC-UI-011: Ambulance Portal - Hospital Dropdown Loads
- **Module**: Frontend
- **Page**: `ambulance.html`
- **Steps**:
  1. Open Emergency Form
- **Expected Result**: Dropdown shows all hospitals, default hospital pre-selected
- **Status**: ⬜ Pending

#### TC-UI-012: Public Portal - Browse Hospitals
- **Module**: Frontend
- **Page**: `public.html`
- **Steps**:
  1. Open public portal
- **Expected Result**: Hospital list displayed with filters
- **Status**: ⬜ Pending

#### TC-UI-013: Public Portal - Find Nearest Hospital
- **Module**: Frontend
- **Page**: `public.html`
- **Steps**:
  1. Click "Find Nearest Hospital"
  2. Allow location permission
- **Expected Result**: Nearest hospital displayed with distance, address, phone, "Navigate Now" button
- **Status**: ⬜ Pending

#### TC-UI-014: Public Portal - Nearest Hospital - Permission Denied
- **Module**: Frontend
- **Page**: `public.html`
- **Steps**:
  1. Click "Find Nearest Hospital"
  2. Deny location permission
- **Expected Result**: Error notification shown, "Try Again" button displayed
- **Status**: ⬜ Pending

#### TC-UI-015: Public Portal - Submit Emergency Request
- **Module**: Frontend
- **Page**: `public.html`
- **Steps**:
  1. Select hospital
  2. Fill patient details
  3. Submit request
- **Expected Result**: Request submitted, success notification shown
- **Status**: ⬜ Pending

---

### Real-time Features Tests (Socket.IO)

#### TC-SOCKET-001: Join Hospital Room
- **Module**: Socket.IO
- **Event**: `joinHospitalRoom`
- **Steps**:
  1. Connect socket
  2. Emit `joinHospitalRoom` with hospitalId
- **Expected Result**: Socket joins room `hospital_${hospitalId}`
- **Status**: ⬜ Pending

#### TC-SOCKET-002: Bed Status Update Broadcast
- **Module**: Socket.IO
- **Event**: `bedStatusUpdate`
- **Steps**:
  1. Update bed status via API
- **Expected Result**: Socket event `bed:update` emitted to hospital room, `bed:publicUpdate` broadcast
- **Status**: ⬜ Pending

#### TC-SOCKET-003: Doctor Attendance Update Broadcast
- **Module**: Socket.IO
- **Event**: `doctorAttendance`
- **Steps**:
  1. Mark doctor attendance via API
- **Expected Result**: Socket event `doctor:attendance` emitted to hospital room, `doctor:publicUpdate` broadcast
- **Status**: ⬜ Pending

#### TC-SOCKET-004: Emergency Request Notification
- **Module**: Socket.IO
- **Event**: `emergency:new:public`
- **Steps**:
  1. Submit public emergency request
- **Expected Result**: Socket event emitted to hospital room
- **Status**: ⬜ Pending

#### TC-SOCKET-005: Ambulance Location Update
- **Module**: Socket.IO
- **Event**: `ambulanceLocation`
- **Steps**:
  1. Update ambulance location via API
- **Expected Result**: Socket event `ambulance:location` emitted to hospital room
- **Status**: ⬜ Pending

---

### Location & Map Tests

#### TC-LOC-001: Extract Coordinates from Google Maps URL - @ Format
- **Module**: Utils
- **Function**: `extractCoordinatesFromUrl`
- **Steps**:
  1. Call with `https://maps.google.com/@21.2567,81.6294,15z`
- **Expected Result**: Returns `{ lat: 21.2567, lng: 81.6294 }`
- **Status**: ⬜ Pending

#### TC-LOC-002: Extract Coordinates from Google Maps URL - q= Format
- **Module**: Utils
- **Function**: `extractCoordinatesFromUrl`
- **Steps**:
  1. Call with `https://maps.google.com/?q=21.2567,81.6294`
- **Expected Result**: Returns `{ lat: 21.2567, lng: 81.6294 }`
- **Status**: ⬜ Pending

#### TC-LOC-003: Update Hospital Coordinates on Registration
- **Module**: Hospital
- **API**: `POST /api/hospital`
- **Steps**:
  1. Register hospital with googleMapUrl
- **Expected Result**: Coordinates extracted and stored in `location.lat` and `location.lng`
- **Status**: ⬜ Pending

#### TC-LOC-004: Nearest Hospital Calculation - Valid
- **Module**: Frontend
- **Page**: `public.html`
- **Steps**:
  1. Get user location (lat: 21.2567, lng: 81.6294)
  2. Calculate distances to all hospitals
- **Expected Result**: Nearest hospital identified, distance calculated correctly
- **Status**: ⬜ Pending

#### TC-LOC-005: Nearest Hospital - No Hospitals with Coordinates
- **Module**: Frontend
- **Page**: `public.html`
- **Prerequisites**: No hospitals have coordinates
- **Steps**:
  1. Try to find nearest hospital
- **Expected Result**: Error notification "No hospitals with valid location data found"
- **Status**: ⬜ Pending

---

## 4️⃣ Critical Tests

### Token & Authentication Critical Tests

| Test ID | Test Name | Expected Result | Priority |
|---------|-----------|----------------|----------|
| TC-CRIT-001 | Missing token on protected route | 401, "Missing token" | HIGH |
| TC-CRIT-002 | Invalid token format | 401, "Invalid token" | HIGH |
| TC-CRIT-003 | Expired token (after 12h) | 401, "Invalid token" | HIGH |
| TC-CRIT-004 | Wrong role access | 403, "Forbidden" | HIGH |
| TC-CRIT-005 | Token not in localStorage | Redirect to login | HIGH |
| TC-CRIT-006 | Token cleared mid-session | Auto-redirect on next API call | HIGH |

### Authorization Critical Tests

| Test ID | Test Name | Expected Result | Priority |
|---------|-----------|----------------|----------|
| TC-CRIT-007 | Hospital updates other hospital's data | 403, "Forbidden" | HIGH |
| TC-CRIT-008 | Doctor updates other doctor's profile | 403, "Forbidden" | HIGH |
| TC-CRIT-009 | Doctor marks other doctor's attendance | 403, "Forbidden" | HIGH |
| TC-CRIT-010 | Hospital marks doctor from other hospital | 403, "Forbidden" | HIGH |
| TC-CRIT-011 | Ambulance sends request to any hospital | 200, Success (allowed) | MEDIUM |
| TC-CRIT-012 | Hospital uploads to other hospital's gallery | 403, "Forbidden" | HIGH |

### File Upload Critical Tests

| Test ID | Test Name | Expected Result | Priority |
|---------|-----------|----------------|----------|
| TC-CRIT-013 | Upload image >5MB | 400, "File size exceeds limit" | HIGH |
| TC-CRIT-014 | Upload non-image file (.txt, .pdf) | 400, Multer error | HIGH |
| TC-CRIT-015 | Upload without file | 400, "No file provided" | MEDIUM |
| TC-CRIT-016 | Upload corrupted image | Error handling | MEDIUM |
| TC-CRIT-017 | Upload multiple images (gallery) | Success, all saved | MEDIUM |
| TC-CRIT-018 | Upload with invalid token | 401, Redirect to login | HIGH |

### Error Handling Critical Tests

| Test ID | Test Name | Expected Result | Priority |
|---------|-----------|----------------|----------|
| TC-CRIT-019 | Database connection failure | Graceful error, 500 response | HIGH |
| TC-CRIT-020 | Missing required fields | 400, Clear error message | HIGH |
| TC-CRIT-021 | Duplicate key (hospitalId, doctorId) | 400, Duplicate error | HIGH |
| TC-CRIT-022 | Invalid ObjectId format | 400, CastError handled | MEDIUM |
| TC-CRIT-023 | Server error (500) | Error logged, user-friendly message | HIGH |
| TC-CRIT-024 | 404 route not found | 404, "Route not found" | MEDIUM |

### Location & GPS Critical Tests

| Test ID | Test Name | Expected Result | Priority |
|---------|-----------|----------------|----------|
| TC-CRIT-025 | GPS permission denied | Error notification, "Try Again" button | HIGH |
| TC-CRIT-026 | GPS timeout | Error notification | MEDIUM |
| TC-CRIT-027 | GPS unavailable | Error notification | MEDIUM |
| TC-CRIT-028 | Invalid Google Maps URL | Validation error | MEDIUM |
| TC-CRIT-029 | Haversine calculation accuracy | Correct distance | HIGH |
| TC-CRIT-030 | No hospitals with coordinates | Error notification | MEDIUM |

### CORS & Security Critical Tests

| Test ID | Test Name | Expected Result | Priority |
|---------|-----------|----------------|----------|
| TC-CRIT-031 | CORS preflight request | Allowed origins | HIGH |
| TC-CRIT-032 | XSS in user input | Sanitized output | HIGH |
| TC-CRIT-033 | SQL injection attempt | Mongoose handles safely | HIGH |
| TC-CRIT-034 | Path traversal in file upload | Validated path | HIGH |
| TC-CRIT-035 | JWT secret exposure | Uses env variable | HIGH |

---

## 5️⃣ QA Checklist

### Backend API Test Checklist

| Category | Test Cases | Status |
|----------|------------|--------|
| **Authentication** | TC-AUTH-001 to TC-AUTH-010 | ⬜ |
| **Hospital Management** | TC-HOSP-001 to TC-HOSP-015 | ⬜ |
| **Doctor Management** | TC-DOC-001 to TC-DOC-013 | ⬜ |
| **Ambulance Management** | TC-AMB-001 to TC-AMB-006 | ⬜ |
| **Bed Management** | TC-BED-001 to TC-BED-007 | ⬜ |
| **Emergency Requests** | TC-EMG-001 to TC-EMG-009 | ⬜ |
| **Critical Tests** | TC-CRIT-001 to TC-CRIT-035 | ⬜ |

### Frontend UI Test Checklist

| Category | Test Cases | Status |
|----------|------------|--------|
| **Login Portal** | TC-UI-001 to TC-UI-003 | ⬜ |
| **Reception Portal** | TC-UI-004 to TC-UI-006 | ⬜ |
| **Doctor Portal** | TC-UI-007 to TC-UI-009 | ⬜ |
| **Ambulance Portal** | TC-UI-010 to TC-UI-011 | ⬜ |
| **Public Portal** | TC-UI-012 to TC-UI-015 | ⬜ |

### Role-Based Permission Test Checklist

| Role | Permissions | Test Cases |
|------|-------------|------------|
| **Hospital** | Manage own hospital, beds, doctors, ambulances, emergencies | TC-HOSP-006, TC-HOSP-007, TC-DOC-002, TC-DOC-011, TC-DOC-012 |
| **Doctor** | Update own profile, mark own attendance | TC-DOC-005, TC-DOC-006, TC-DOC-009, TC-DOC-010 |
| **Ambulance** | Submit emergency to any hospital, update location | TC-EMG-003, TC-EMG-004, TC-AMB-005 |
| **Public** | Browse hospitals, submit emergency, find nearest | TC-EMG-001, TC-UI-012, TC-UI-013 |

### File Upload Test Checklist

| Feature | Test Cases | Status |
|---------|------------|--------|
| **Hospital Gallery** | TC-HOSP-008 to TC-HOSP-012 | ⬜ |
| **Doctor Photo** | TC-DOC-007, TC-DOC-008 | ⬜ |
| **Large Files** | TC-CRIT-013 | ⬜ |
| **Invalid Formats** | TC-CRIT-014 | ⬜ |
| **Token Validation** | TC-CRIT-018 | ⬜ |

### Location & Map Test Checklist

| Feature | Test Cases | Status |
|---------|------------|--------|
| **Coordinate Extraction** | TC-LOC-001 to TC-LOC-003 | ⬜ |
| **Nearest Hospital** | TC-LOC-004, TC-LOC-005 | ⬜ |
| **GPS Permissions** | TC-CRIT-025 to TC-CRIT-027 | ⬜ |
| **Haversine Calculation** | TC-CRIT-029 | ⬜ |

### Error Handling Test Checklist

| Error Type | Test Cases | Status |
|------------|------------|--------|
| **Token Errors** | TC-CRIT-001 to TC-CRIT-006 | ⬜ |
| **Authorization Errors** | TC-CRIT-007 to TC-CRIT-012 | ⬜ |
| **Validation Errors** | TC-CRIT-019 to TC-CRIT-022 | ⬜ |
| **Server Errors** | TC-CRIT-023, TC-CRIT-024 | ⬜ |

### Security Test Checklist

| Security Aspect | Test Cases | Status |
|----------------|------------|--------|
| **CORS** | TC-CRIT-031 | ⬜ |
| **XSS** | TC-CRIT-032 | ⬜ |
| **SQL Injection** | TC-CRIT-033 | ⬜ |
| **Path Traversal** | TC-CRIT-034 | ⬜ |
| **JWT Security** | TC-CRIT-035 | ⬜ |

---

## 6️⃣ Final Report

### Project Summary

**RapidCare** is a comprehensive healthcare management system with the following components:

- **Backend**: Express.js server with MongoDB, Socket.IO for real-time updates
- **Frontend**: 5 HTML portals (Login, Reception, Doctor, Ambulance, Public)
- **Authentication**: JWT-based with role-based access control
- **File Uploads**: Multer for hospital gallery and doctor photos
- **Location Services**: Google Maps integration, GPS-based nearest hospital finder
- **Real-time**: Socket.IO for live updates (beds, doctors, emergencies, ambulances)

### Directory Structure Summary

```
✅ Backend: Express.js routes, Mongoose models, middleware, utilities
✅ Frontend: 5 HTML portals, CSS, JavaScript client utilities
✅ Uploads: Organized by hospitalId for gallery and doctor photos
✅ QR Codes: Generated for beds and attendance tracking
✅ Real-time: Socket.IO events for live updates
```

### Feature List

#### ✅ Implemented Features

1. **Authentication & Authorization**
   - JWT token-based authentication
   - Role-based access control (hospital, doctor, ambulance)
   - Password hashing (bcrypt)
   - Token expiration (12 hours)

2. **Hospital Management**
   - Registration & login
   - Profile management
   - Gallery image upload/delete
   - Google Maps URL integration
   - Attendance QR code generation

3. **Doctor Management**
   - Registration (by hospital)
   - Profile updates
   - Photo upload
   - Attendance marking (Present/Absent, shifts)
   - QR code scanning

4. **Ambulance Management**
   - Registration (by hospital)
   - Location tracking
   - Emergency request submission (to ANY hospital)
   - Status updates (On Duty, Offline, In Transit)

5. **Bed Management**
   - Bulk bed creation
   - QR code generation (single/mass PDF)
   - Status tracking (Vacant, Occupied, Reserved, Cleaning)
   - QR code scanning

6. **Emergency Requests**
   - Public submission (no auth)
   - Ambulance submission (auth required)
   - Hospital workflow (Accept/Reject/Transfer/Reply/Admit/Discharge)
   - Status tracking (Pending → Accepted/Rejected → Handled)

7. **Public Portal**
   - Hospital browsing with filters
   - Nearest hospital finder (GPS + Haversine)
   - Emergency request submission
   - Hospital gallery viewing

8. **Real-time Updates**
   - Socket.IO for live updates
   - Hospital-specific rooms
   - Bed status updates
   - Doctor attendance updates
   - Emergency notifications
   - Ambulance location tracking

### Dependent Modules

| Module | Dependencies |
|--------|--------------|
| **server.js** | express, mongoose, socket.io, cors, dotenv |
| **routes/** | models, middleware/auth, utils |
| **models/** | mongoose, bcrypt |
| **middleware/auth.js** | jsonwebtoken |
| **utils/coordinateExtractor.js** | (standalone) |
| **public/js/client.js** | socket.io-client (via CDN) |

### Missing Components

1. **Testing Framework**
   - ❌ No unit tests (Jest/Mocha)
   - ❌ No integration tests
   - ❌ No E2E tests (Cypress/Playwright)

2. **Environment Configuration**
   - ⚠️ `.env` file not in repo (should be in `.gitignore`)
   - ⚠️ Default JWT secret (`devsecret`) used if env not set

3. **Error Logging**
   - ⚠️ Console.log only (no Winston/Morgan)
   - ⚠️ No error tracking service (Sentry)

4. **API Documentation**
   - ❌ No Swagger/OpenAPI documentation
   - ❌ No Postman collection

5. **Input Validation**
   - ⚠️ Basic validation only (no Joi/Yup)
   - ⚠️ No rate limiting

6. **Database Indexes**
   - ⚠️ Some indexes exist (hospitalId, doctorId) but not comprehensive

### Potential Bugs

1. **Token Expiration Handling**
   - ⚠️ Frontend checks for `expired: true` but backend doesn't return it
   - **Risk**: Users may not be redirected properly on expiration

2. **Coordinate Extraction**
   - ⚠️ Geocoding fallback not implemented (only URL parsing)
   - **Risk**: Hospitals without Google Maps URLs won't have coordinates

3. **File Upload Validation**
   - ⚠️ Multer file type validation may not catch all invalid files
   - **Risk**: Malicious files could be uploaded

4. **Socket.IO Room Management**
   - ⚠️ No cleanup on disconnect
   - **Risk**: Memory leaks over time

5. **Password Security**
   - ⚠️ Default password `test@1234` for all users
   - **Risk**: Security vulnerability in production

6. **Error Messages**
   - ⚠️ Some errors expose internal details
   - **Risk**: Information disclosure

### High-Risk Areas

1. **Authentication & Authorization** 🔴 HIGH
   - Token handling inconsistencies
   - Role-based access control edge cases
   - Password security

2. **File Uploads** 🔴 HIGH
   - File size validation
   - File type validation
   - Path traversal risks

3. **Database Operations** 🟡 MEDIUM
   - No transactions for bulk operations
   - Race conditions possible
   - Index optimization needed

4. **Real-time Updates** 🟡 MEDIUM
   - Socket.IO connection management
   - Room cleanup
   - Event ordering

5. **Location Services** 🟡 MEDIUM
   - GPS permission handling
   - Coordinate accuracy
   - Haversine calculation edge cases

### Recommended Fixes

#### Priority 1 (Critical)

1. **Fix Token Expiration Response**
   ```javascript
   // middleware/auth.js
   if (err.name === 'TokenExpiredError') {
     return res.status(401).json({ message: 'Token expired', expired: true });
   }
   ```

2. **Add File Upload Validation**
   ```javascript
   // Add file type whitelist in multer config
   const fileFilter = (req, file, cb) => {
     const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
     if (allowedTypes.includes(file.mimetype)) {
       cb(null, true);
     } else {
       cb(new Error('Invalid file type'), false);
     }
   };
   ```

3. **Remove Default Passwords**
   - Require password change on first login
   - Enforce strong password policy

#### Priority 2 (High)

4. **Add Rate Limiting**
   ```javascript
   const rateLimit = require('express-rate-limit');
   const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
   app.use('/api/', limiter);
   ```

5. **Add Input Validation**
   ```javascript
   const Joi = require('joi');
   const schema = Joi.object({ hospitalId: Joi.string().required() });
   ```

6. **Add Error Logging**
   ```javascript
   const winston = require('winston');
   const logger = winston.createLogger({ /* config */ });
   ```

#### Priority 3 (Medium)

7. **Add API Documentation**
   - Swagger/OpenAPI setup
   - Postman collection

8. **Add Unit Tests**
   - Jest setup
   - Test coverage for utilities

9. **Add Database Indexes**
   ```javascript
   // Add indexes for frequently queried fields
   EmergencyRequestSchema.index({ hospitalId: 1, status: 1 });
   ```

10. **Add Geocoding Fallback**
    ```javascript
    // utils/coordinateExtractor.js
    async function geocodeAddress(address) {
      // Use Google Geocoding API as fallback
    }
    ```

---

## Testing Execution Instructions

1. **Setup Test Environment**
   ```bash
   npm install
   # Create .env file with test credentials
   npm start
   ```

2. **Run Manual Tests**
   - Use Postman/Thunder Client for API tests
   - Use browser DevTools for frontend tests
   - Check console logs for errors

3. **Test Each Module**
   - Start with Authentication (TC-AUTH-001 to TC-AUTH-010)
   - Then Hospital Management (TC-HOSP-001 to TC-HOSP-015)
   - Continue with other modules in order

4. **Document Results**
   - Mark each test as Pass/Fail/Skip
   - Note actual results and error messages
   - Take screenshots for UI tests

5. **Report Issues**
   - Create bug reports for failed tests
   - Include steps to reproduce
   - Include error messages and logs

---

**End of Testing Plan**

*This document should be updated as tests are executed and bugs are fixed.*

