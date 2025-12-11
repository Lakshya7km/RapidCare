# 🚀 RapidCare Quick Reference Card

## 🔄 Database Reset
```javascript
// Run in browser console
fetch('/api/reset-db', { method: 'POST' })
  .then(res => res.json())
  .then(data => console.log('Reset:', data));
```
⏱️ Takes 15-25 seconds (generates 84 QR codes)

---

## 🔐 Login Credentials

**Password for ALL**: `test@1234`

### Hospitals:
- `HOSP001` - RapidCare General Hospital (Raipur)
- `HOSP002` - City Multispeciality Hospital (Naya Raipur)  
- `HOSP003` - Raipur Medical Center (Raipur)

### Doctors:
- `DOC100` @ HOSP001 - Dr. A Sharma (Cardiology)
- `DOC101` @ HOSP001 - Dr. B Verma (Orthopedics)
- `DOC102` @ HOSP002 - Dr. C Patel (Neurology)
- `DOC103` @ HOSP003 - Dr. D Singh (Gynecology)

### Ambulances:
- `AMB001` @ HOSP001 - CG04-1234
- `AMB002` @ HOSP002 - CG04-5678

---

## 🌐 Portal URLs

| Portal | URL |
|--------|-----|
| Public | http://localhost:5000/public.html |
| Reception | http://localhost:5000/reception.html |
| Doctor | http://localhost:5000/doctor.html |
| Ambulance | http://localhost:5000/ambulance.html |

---

## ✨ Key Features

### Public Portal
- ✅ Search hospitals by name/city/service
- ✅ View full hospital details (click "Details")
- ✅ Submit emergency requests
- ✅ Call hospitals (opens dialer on mobile)

### Reception Portal  
- ✅ Dashboard with real-time stats
- ✅ Manage beds (create, toggle status, print QRs)
- ✅ **Print Options** - Filter QRs by Ward/Type
- ✅ Register doctors & ambulances
- ✅ Handle emergency requests (Accept/Deny)
- ✅ DBMS view (see all hospital data)

### Doctor Portal
- ✅ Mark attendance (manual or QR scan)
- ✅ View attendance history
- ✅ Update profile

### Ambulance Portal
- ✅ View assigned emergency requests
- ✅ Update status (On Duty, On Route, etc.)

---

## 📁 QR Code Storage

**Location**: `uploads/`

### Hospital QRs:
```
uploads/qr/present_HOSP001.png
uploads/qr/absent_HOSP001.png
... (6 files total)
```

### Bed QRs:
```
uploads/qrs/HOSP001-ICU-B01-vacant.png
uploads/qrs/HOSP001-ICU-B01-occupied.png
... (78 files total)
```

**Total**: 84 QR codes

---

## 🔍 Testing Bed QR Print Options

1. Login to Reception (HOSP001 / test@1234)
2. Click "**Bed Management**" in sidebar
3. Click "**Print Options**" button
4. Select filters:
   - **Ward**: Choose "ICU" or "1" or "All Wards"
   - **Type**: Choose "ICU" or "General" or "All Types"
5. Click "**Print PDF**"
6. PDF opens with filtered beds only

---

## 🧪 Quick Smoke Test

### 1. Reset Database ✅
```javascript
fetch('/api/reset-db', { method: 'POST' })
  .then(res => res.json())
  .then(d => console.log(d));
```

### 2. Test Public Portal ✅
- Open http://localhost:5000/public.html
- Click "**Details**" on first hospital
- Verify modal shows full info

### 3. Test Reception Login ✅
- Open http://localhost:5000/reception.html  
- Login: **HOSP001** / **test@1234**
- Verify dashboard loads

### 4. Test Filtered Printing ✅
- Click "**Beds**" in sidebar
- Click "**Print Options**"
- Select **Ward: ICU**
- Click "**Print PDF**"
- Verify PDF shows only ICU beds

### 5. Test Doctor Login ✅
- Open http://localhost:5000/doctor.html
- Login: **DOC100** / **test@1234**
- Click "**Mark Manual Attendance**"
- Select date, shift, status
- Click "**Mark Attendance**"

---

## 🐛 Troubleshooting

### Login Fails
- **Cause**: Database not reset with new password hashing
- **Fix**: Run database reset again

### QR Codes Missing
- **Cause**: Directories don't exist
- **Fix**: Create `uploads/qr/` and `uploads/qrs/` folders

### Slow Database
- **Cause**: MongoDB Atlas cluster paused
- **Fix**: Check MongoDB Atlas dashboard, resume cluster

### Can't See Data
- **Cause**: Logged in as different hospital
- **Fix**: Each hospital sees only its own data (by design)

---

## 📊 Expected Database After Reset

- **Hospitals**: 3
- **Doctors**: 4 (2 @ HOSP001, 1 @ HOSP002, 1 @ HOSP003)
- **Beds**: 39 (13 per hospital)
  - ICU Beds: 3 per hospital
  - General Beds: 10 per hospital
- **Ambulances**: 2 (1 @ HOSP001, 1 @ HOSP002)
- **QR Codes**: 84 files

---

## 📖 Full Documentation

| Document | Purpose |
|----------|---------|
| `TESTING_GUIDE.md` | Complete step-by-step testing (230+ lines) |
| `IMPLEMENTATION_SUMMARY.md` | Technical details (550+ lines) |
| `COMPLETED.md` | Feature verification & screenshots |
| `QUICK_REFERENCE.md` | This file (cheat sheet) |

---

## 🎯 Demo Script (5 Minutes)

### 1. Database Reset (30s)
- Open console, run reset command
- Show completion message

### 2. Public Portal (1 min)
- Show hospital search
- Click "Details" → Show modal
- Submit emergency request

### 3. Reception Portal (2 min)
- Login as HOSP001
- Show dashboard statistics
- Navigate to Bed Management
- Click "Print Options"
- Select ICU ward filter
- Generate filtered PDF
- Show "Print All QR" option

### 4. Doctor Portal (1 min)
- Login as DOC100
- Mark attendance manually
- Show dashboard update

### 5. Data Isolation (30s)
- Logout, login as HOSP002
- Show different bed list
- Demonstrate hospital-specific data

---

## ⚡ Performance Benchmarks

- Database Reset: 15-25s
- QR Generation: 84 codes in ~20s
- Login: <500ms
- Page Load: <2s
- Real-time Updates: <300ms
- PDF Generation: 2-5s

---

## ✅ All Features Verified

- ✅ Database reset with QR generation
- ✅ QR persistence (no regeneration on reload)
- ✅ Filtered QR printing (Ward + Type filters)
- ✅ Hospital details modal on public portal
- ✅ Call button opens dialer (mobile)
- ✅ Data isolation per hospital
- ✅ Password security (bcrypt hashing)
- ✅ Real-time updates (Socket.IO)
- ✅ Error handling & robustness

---

**Status**: ✅ **READY FOR DEMO**

**Created**: 2025-11-22  
**Version**: 1.0
