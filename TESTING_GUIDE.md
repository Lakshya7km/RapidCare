# RapidCare System Testing Guide

## 🔄 Database Reset & QR Code Generation

### Prerequisites
- Server must be running: `npm run dev`
- MongoDB connection must be active
- All dependencies installed

### Step 1: Reset Database
1. Open browser console on any page (e.g., http://localhost:5000/public.html)
2. Execute:
```javascript
fetch('/api/reset-db', { method: 'POST' })
  .then(res => res.json())
  .then(data => console.log('Reset Result:', data));
```
3. Wait for completion (may take 10-20 seconds due to QR generation)
4. Verify in console:
   - `✅ Created 3 hospitals`
   - `✅ Created 4 doctors`
   - `✅ Created 2 ambulances`
   - `✅ Created 39 beds` (13 beds × 3 hospitals)
   - `✅ Created 2 attendance records`

### Step 2: Verify QR Code Generation
Check that the following directories contain QR code images:
- `uploads/qr/` - Hospital attendance QRs (6 files: present/absent for 3 hospitals)
- `uploads/qrs/` - Bed QRs (78 files: vacant/occupied for 39 beds)

Expected files:
- `uploads/qr/present_HOSP001.png`
- `uploads/qr/absent_HOSP001.png`
- `uploads/qr/present_HOSP002.png`
- `uploads/qr/absent_HOSP002.png`
- `uploads/qr/present_HOSP003.png`
- `uploads/qr/absent_HOSP003.png`
- `uploads/qrs/HOSP001-ICU-B01-vacant.png`
- `uploads/qrs/HOSP001-ICU-B01-occupied.png`
- ... (and so on for all beds)

---

## 🏥 Public Portal Testing

### URL: http://localhost:5000/public.html

### Test 1: Hospital Listing
1. Verify all 3 hospitals are displayed
2. Each card shows:
   - Hospital name
   - Location (City, State)
   - Bed availability status
   - Services preview (first 3)
   - Available doctors (first 2)

### Test 2: Hospital Details Modal
1. Click "ℹ️ Details" button on any hospital card
2. Verify modal opens with:
   - Full address
   - Contact number
   - All services (as badges)
   - All facilities (as badges)
   - Insurance accepted list
   - Complete doctor list with availability status
3. Verify doctors show:
   - Name
   - Speciality
   - Qualification
   - Availability badge (green for Available, gray for Not Available)
4. Close modal and verify it closes correctly

### Test 3: Search Functionality
1. Type "Emergency" in search box
2. Verify hospitals with Emergency service are shown
3. Type "Raipur" in search box
4. Verify hospitals in Raipur are shown
5. Clear search and verify all hospitals appear again

### Test 4: Call Functionality (Mobile/Desktop)
1. Click "📞 Call" button
2. On mobile: Verify dialer opens with hospital number
3. On desktop: Verify `tel:` link attempts to open (may show error if no default app)

### Test 5: Emergency Request Submission
1. Click "🚨 Emergency" button on any hospital
2. Verify emergency request form loads
3. Fill in all required fields:
   - Patient Name: "John Doe"
   - Age: "35"
   - Gender: "Male"
   - Emergency Type: "Cardiac"
   - Symptoms: "Chest pain and breathing difficulty"
   - Contact: "9999999999"
   - Address: "Sector 10, Raipur"
4. Click "Send Emergency Alert"
5. Verify success message appears with:
   - Request ID
   - Status: PENDING
   - Confirmation message
6. Wait ~5 seconds and verify polling is working (status should update if processed)

---

## 🏢 Reception Portal Testing

### URL: http://localhost:5000/reception.html

### Test Credentials:
- **HOSP001**: `test@1234`
- **HOSP002**: `test@1234`
- **HOSP003**: `test@1234`

### Test 1: Login
1. Enter Hospital ID: `HOSP001`
2. Enter Password: `test@1234`
3. Click "Login"
4. Verify dashboard loads successfully

### Test 2: Dashboard Overview
1. Verify statistics cards show:
   - Beds Available (e.g., "10 / 13")
   - Doctors On Duty (e.g., "2 / 2")
   - Ambulances Active (e.g., "1 / 1")
2. Verify "Recent Emergency Requests" table shows data (if any)

### Test 3: Hospital Info Section
1. Click "Hospital Info" in sidebar
2. Verify all hospital details are pre-filled
3. Verify "Attendance QR Codes" section shows:
   - "Generate QR" button (if QRs not generated)
   - OR QR code images with "Print PDF" button (if already generated)
4. Click "Generate QR" (if needed)
5. Verify QR images appear (Present and Absent)
6. Click "Print PDF"
7. Verify PDF opens in new tab with both QRs

### Test 4: Bed Management
1. Click "Beds" in sidebar
2. Verify bed table shows all beds for HOSP001
3. Verify bed summary shows correct counts

#### 4a: Create New Beds
1. Fill in:
   - Ward No: "2"
   - Type: "ICU"
   - Start #: "1"
   - End #: "5"
2. Click "Create Beds"
3. Verify 5 new beds are created
4. Verify they appear in the table
5. Verify bed summary updates

#### 4b: Toggle Bed Status
1. Find a "Vacant" bed
2. Click "Occupy" button
3. Verify status changes to "Occupied" (badge color changes)
4. Click "Free" button
5. Verify status changes back to "Vacant"

#### 4c: Print Individual Bed QR
1. Click "QR" button for any bed
2. Verify PDF opens in new tab
3. Verify PDF contains:
   - Bed number and type
   - Two QR codes (Vacant and Occupied)
   - Labels for each QR

#### 4d: Print Options (Filtered QR)
1. Click "Print Options" button
2. Verify modal opens with filters:
   - Ward dropdown (populated with existing wards)
   - Bed Type dropdown (populated with existing types)
3. Select Ward: "ICU"
4. Select Type: "All Types"
5. Click "Print PDF"
6. Verify PDF opens with only ICU beds
7. Close PDF
8. Click "Print Options" again
9. Select "All Wards" and "General"
10. Click "Print PDF"
11. Verify PDF opens with only General beds

#### 4e: Print All QRs
1. Click "Print All QR" button
2. Verify PDF opens with ALL beds from HOSP001
3. Verify PDF is organized in a grid format (2 columns)
4. Verify each bed shows:
    - Bed number and type
    - Vacant QR (left)
    - Occupied QR (right)

### Test 5: Doctors Section
1. Click "Doctors" in sidebar
2. Verify doctor table shows all doctors for HOSP001

#### 5a: Register New Doctor
1. Fill in:
   - Doctor ID: "DOC200"
   - Name: "Dr. Test Doctor"
   - Speciality: "General Medicine"
   - Qualification: "MBBS"
   - Experience: "5 yrs"
2. Click "Register Doctor"
3. Verify doctor appears in table

#### 5b: Generate Attendance QR
1. Click "Generate QR" in Attendance QR section
2. Verify QR images appear (CHECK IN and CHECK OUT)
3. Click "Print PDF"
4. Verify PDF opens with both attendance QRs

### Test 6: Ambulances Section
1. Click "Ambulances" in sidebar
2. Verify ambulance table shows ambulances for HOSP001

#### 6a: Register New Ambulance
1. Fill in:
   - Ambulance ID: "AMB100"
   - Vehicle No: "CG04-9999"
   - EMT Name: "Test EMT"
   - EMT Mobile: "9000000099"
   - Pilot Name: "Test Pilot"
   - Pilot Mobile: "9000000098"
2. Click "Register Ambulance"
3. Verify ambulance appears in table

### Test 7: Emergencies Section
1. Click "Emergencies" in sidebar
2. Verify emergency statistics show counts (Pending, Accepted, Rejected, Transferred)
3. Verify emergency cards show all requests for HOSP001
4. For a "Pending" request:
   - Click "Accept"
   - Verify status changes to "Accepted"
5. For another "Pending" request:
   - Click "Deny"
   - Enter reason: "No beds available"
   - Verify status changes to "Denied"

### Test 8: DBMS View
1. Click "Database View" in sidebar
2. Expand "Hospital Data"
3. Verify JSON shows complete hospital data including:
   - hospitalId
   - All services, facilities, insurance arrays
   - attendanceQR paths
   - **IMPORTANT**: Password should NOT be visible in plain text
4. Expand "Doctors Data"
5. Verify JSON shows all doctors for HOSP001 only
6. Expand "Beds Data"
7. Verify JSON shows all beds for HOSP001 only (including QR paths)

### Test 9: Data Isolation (Critical)
1. Logout
2. Login with **HOSP002** credentials
3. Navigate to each section and verify:
   - Beds: Only HOSP002 beds are shown
   - Doctors: Only HOSP002 doctors
   - Ambulances: Only HOSP002 ambulances
   - Emergencies: Only requests to HOSP002
   - DBMS: Only HOSP002 data
4. Verify HOSP002 cannot see HOSP001 data

---

## 👨‍⚕️ Doctor Portal Testing

### URL: http://localhost:5000/doctor.html

### Test Credentials:
- **DOC100** (HOSP001): `test@1234`
- **DOC101** (HOSP001): `test@1234`
- **DOC102** (HOSP002): `test@1234`
- **DOC103** (HOSP003): `test@1234`

### Test 1: Login
1. Enter Doctor ID: `DOC100`
2. Enter Password: `test@1234`
3. Click "Login"
4. Verify dashboard loads

### Test 2: Dashboard
1. Verify greeting shows doctor name
2. Verify quick stats show:
   - Today's status (Present/Absent/Not Marked)
   - Shift information
   - Availability
3. Verify "Recent Attendance" table shows past attendance records

### Test 3: Manual Attendance Entry
1. Click "Attendance" in sidebar
2. Click "Mark Manual Attendance" tab
3. Select Date: Today's date
4. Select Shift: "Morning"
5. Select Status: "Present"
6. Click "Mark Attendance"
7. Verify success message
8. Verify dashboard updates to show "Present" status

### Test 4: QR-Based Attendance
1. Login to reception portal (HOSP001) in another tab
2. Generate hospital attendance QR if not already done
3. Scan the "CHECK IN" QR code:
   - Open the PNG image
   - Right-click → "Copy image address"
   - Open in new tab to see the URL
   - Copy the URL (should be like `/api/hospital/HOSP001/attendance-scan?type=Present`)
   - Navigate to that URL
4. Verify attendance page shows scan confirmation
5. Return to doctor portal
6. Verify attendance is marked as "Present"

### Test 5: Profile Section
1. Click "Profile" in sidebar
2. Verify all doctor details are shown
3. Update any detail (e.g., change availability to "Not Available")
4. Click "Save Changes"
5. Verify success message
6. Logout and login again
7. Verify change persisted

---

## 🚑 Ambulance Portal Testing

### URL: http://localhost:5000/ambulance.html

### Test Credentials:
- **AMB001** (HOSP001): `test@1234`
- **AMB002** (HOSP002): `test@1234`

### Test 1: Login
1. Enter Ambulance ID (or EMT ID or Pilot ID): `AMB001`
2. Enter Password: `test@1234`
3. Click "Login"
4. Verify dashboard loads

### Test 2: Dashboard
1. Verify ambulance details are shown:
   - Ambulance ID
   - Vehicle Number
   - EMT and Pilot information
   - Current status
2. Verify emergency requests are listed (if any assigned)

### Test 3: Emergency Request Handling
1. Create an emergency request from public portal for HOSP001
2. Login to reception portal (HOSP001)
3. Navigate to Emergencies
4. Accept the emergency request
5. Return to ambulance portal (refresh if needed)
6. Verify the request appears in the list
7. Click "Respond" or "Accept"
8. Verify status updates

### Test 4: Status Changes
1. Click "Change Status" button
2. Select "On Route"
3. Verify status updates in UI
4. Change to "Arrived"
5. Verify status updates

---

## 🔍 QR Code Scanning Tests

### Bed QR Codes
1. Open `/uploads/qrs/HOSP001-W1-B01-vacant.png` in browser
2. Use a QR scanner app (or online QR decoder) to scan
3. Expected URL: `http://localhost:5000/api/beds/scan/HOSP001-W1-B01?set=Vacant`
4. Navigate to that URL in browser
5. Verify page shows:
   - Bed information
   - Previous status
   - New status: "Vacant"
   - Confirmation message
6. Return to reception portal
7. Verify bed B01 status is now "Vacant"

### Hospital Attendance QR Codes
1. Open `/uploads/qr/present_HOSP001.png` in browser
2. Scan QR code
3. Expected URL: `http://localhost:5000/api/hospital/HOSP001/attendance-scan?type=Present`
4. Navigate to that URL
5. Verify attendance marking page loads
6. Mark attendance for a doctor
7. Verify confirmation

---

## 🔄 Real-Time Updates (Socket.IO)

### Test 1: Bed Updates
1. Open reception portal (HOSP001) in Browser Tab 1
2. Open reception portal (HOSP001) in Browser Tab 2
3. In Tab 1, toggle a bed status (Vacant → Occupied)
4. Verify Tab 2 updates automatically without refresh

### Test 2: Emergency Updates
1. Open reception portal (HOSP001) in one tab
2. Open public portal in another tab
3. Submit emergency request to HOSP001
4. Verify reception portal shows alert notification
5. Verify emergency appears in Emergencies section

### Test 3: Doctor Attendance
1. Open reception portal in one tab
2. Open doctor portal in another tab
3. Mark attendance in doctor portal
4. Verify reception portal's doctor list updates

---

## 🐛 Known Issues & Troubleshooting

### Login Fails After Reset
**Symptom**: "Invalid credentials" error after database reset
**Cause**: Password hashing mismatch
**Solution**: 
1. Ensure `routes/reset.js` uses `bcrypt.hashSync('test@1234', 10)`
2. Restart server after any changes to reset.js
3. Run database reset again

### QR Codes Not Generating
**Symptom**: QR code paths are empty in database
**Cause**: QR generation timed out or failed
**Solution**:
1. Check `uploads/qr` and `uploads/qrs` directories exist
2. Check server logs for QR generation errors
3. Increase timeout in `routes/reset.js` if needed

### Slow Database Operations
**Symptom**: "Buffering timed out" errors
**Cause**: Slow MongoDB connection or missing indexes
**Solution**:
1. Verify MongoDB connection string in `.env`
2. Check MongoDB Atlas cluster is not paused
3. Verify indexes exist on frequently queried fields

### File Upload Issues
**Symptom**: "ENOENT: no such file or directory" errors
**Cause**: Upload directories don't exist
**Solution**:
1. Create directories: `uploads/qr`, `uploads/qrs`
2. Restart server

---

## ✅ Final Verification Checklist

- [ ] Database reset completes successfully
- [ ] All QR codes generated (84 files total)
- [ ] Public portal shows all hospitals
- [ ] Public portal hospital details modal works
- [ ] Public portal emergency submission works
- [ ] Reception portal login works for all 3 hospitals
- [ ] Each hospital sees only its own data
- [ ] Bed management CRUD operations work
- [ ] Bed QR printing works (individual, filtered, mass)
- [ ] Doctor registration works
- [ ] Ambulance registration works
- [ ] Emergency request workflow works (Public → Reception → Ambulance)
- [ ] Doctor portal login works
- [ ] Doctor attendance (manual and QR) works
- [ ] Ambulance portal login works
- [ ] Real-time updates work across portals
- [ ] QR code scanning sets correct values
- [ ] All sensitive data is properly hashed/hidden
- [ ] No console errors during normal operations

---

## 📊 Expected Data After Reset

### Hospitals: 3
- HOSP001 - RapidCare General Hospital (Raipur)
- HOSP002 - City Multispeciality Hospital (Naya Raipur)
- HOSP003 - Raipur Medical Center (Raipur)

### Doctors: 4
- DOC100 @ HOSP001 - Dr. A Sharma (Cardiology) - Available
- DOC101 @ HOSP001 - Dr. B Verma (Orthopedics) - Available
- DOC102 @ HOSP002 - Dr. C Patel (Neurology) - Not Available
- DOC103 @ HOSP003 - Dr. D Singh (Gynecology) - Available

### Ambulances: 2
- AMB001 @ HOSP001 - On Duty
- AMB002 @ HOSP002 - Offline

### Beds: 39 (13 per hospital)
**Per Hospital:**
- 3 ICU beds (ICU ward)
- 10 General beds (Ward 1)

**Status Distribution:**
- ICU: Alternating (B01=Vacant, B02=Occupied, B03=Vacant)
- General: Every 3rd occupied (B03, B06, B09 = Occupied)

---

## 🎯 Performance Benchmarks

- Database reset: Should complete in < 30 seconds
- QR generation: ~2-3 seconds per hospital, ~1 second per bed
- Login: < 1 second
- Page load: < 2 seconds
- Real-time updates: < 500ms propagation
- PDF generation: < 3 seconds for mass QR

---

## 📝 Notes

- Default password for all entities: `test@1234`
- All users are flagged with `forcePasswordChange: true`
- BASE_URL is set to `http://localhost:5000` - update in `.env` for production
- MongoDB connection uses MongoDB Atlas - ensure cluster is running
- Socket.IO is used for real-time updates - ensure it's not blocked by firewall
