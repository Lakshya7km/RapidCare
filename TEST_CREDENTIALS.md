# 🔑 RapidCare Test Credentials

## Updated Credentials (After Database Reset)

All passwords are **bcrypt-hashed** and set to: `test@1234`

---

## 🏥 Hospital Login

### HOSP001
- **ID**: `HOSP001`
- **Password**: `test@1234`
- **Name**: RapidCare General Hospital
- **Location**: Raipur, Chhattisgarh
- **Doctors**: 2 (DOC100, DOC101)
- **Ambulances**: 1 (AMB001)
- **Beds**: 13 (3 ICU, 10 General)

### HOSP002
- **ID**: `HOSP002`
- **Password**: `test@1234`
- **Name**: City Multispeciality Hospital
- **Location**: Naya Raipur, Chhattisgarh
- **Doctors**: 1 (DOC102)
- **Ambulances**: 1 (AMB002)
- **Beds**: 13 (3 ICU, 10 General)

### HOSP003
- **ID**: `HOSP003`
- **Password**: `test@1234`
- **Name**: Raipur Medical Center
- **Location**: Raipur, Chhattisgarh
- **Doctors**: 1 (DOC103)
- **Ambulances**: 0
- **Beds**: 13 (3 ICU, 10 General)

---

## 👨‍⚕️ Doctor Login

### DOC100 (HOSP001)
- **ID**: `DOC100`
- **Password**: `test@1234`
- **Name**: Dr. A Sharma
- **Speciality**: Cardiology
- **Qualification**: MBBS, MD
- **Experience**: 10 years
- **Shift**: Morning
- **Status**: Available

### DOC101 (HOSP001)
- **ID**: `DOC101`
- **Password**: `test@1234`
- **Name**: Dr. B Verma
- **Speciality**: Orthopedics
- **Qualification**: MBBS, MS
- **Experience**: 7 years
- **Shift**: Afternoon
- **Status**: Available

### DOC102 (HOSP002)
- **ID**: `DOC102`
- **Password**: `test@1234`
- **Name**: Dr. C Patel
- **Speciality**: Neurology
- **Qualification**: MBBS, MD
- **Experience**: 12 years
- **Shift**: Evening
- **Status**: Not Available

### DOC103 (HOSP003)
- **ID**: `DOC103`
- **Password**: `test@1234`
- **Name**: Dr. D Singh
- **Speciality**: Gynecology
- **Qualification**: MBBS, MS
- **Experience**: 8 years
- **Shift**: Morning
- **Status**: Available

---

## 🚑 Ambulance Login

### AMB001 (HOSP001)
- **ID**: `AMB001`
- **Password**: `test@1234`
- **Vehicle Number**: CG04-1234
- **EMT**: Ravi Kumar (EMT01) - 9000000001
- **Pilot**: Vikram Singh (PIL01) - 9000000002
- **Status**: On Duty

### AMB002 (HOSP002)
- **ID**: `AMB002`
- **Password**: `test@1234`
- **Vehicle Number**: CG04-5678
- **EMT**: Suresh Yadav (EMT02) - 9000000003
- **Pilot**: Rajesh Kumar (PIL02) - 9000000004
- **Status**: Offline

---

## 📊 Quick Reference Table

| Role | ID | Password | Hospital | Name |
|------|-----|----------|----------|------|
| Hospital | HOSP001 | test@1234 | - | RapidCare General Hospital |
| Hospital | HOSP002 | test@1234 | - | City Multispeciality Hospital |
| Hospital | HOSP003 | test@1234 | - | Raipur Medical Center |
| Doctor | DOC100 | test@1234 | HOSP001 | Dr. A Sharma |
| Doctor | DOC101 | test@1234 | HOSP001 | Dr. B Verma |
| Doctor | DOC102 | test@1234 | HOSP002 | Dr. C Patel |
| Doctor | DOC103 | test@1234 | HOSP003 | Dr. D Singh |
| Ambulance | AMB001 | test@1234 | HOSP001 | CG04-1234 |
| Ambulance | AMB002 | test@1234 | HOSP002 | CG04-5678 |

---

## 🔄 Database Reset Command

To reset the database and regenerate all credentials:

### Browser Console:
```javascript
fetch('/api/reset-db', { method: 'POST' })
  .then(res => res.json())
  .then(data => console.log('Reset:', data));
```

### Expected Output:
```
{
  "success": true,
  "message": "Database reset complete",
  "hospitals": 3,
  "doctors": 4,
  "beds": 39,
  "ambulances": 2,
  "qrCodes": 84
}
```

**Duration**: 15-25 seconds

---

## 📁 QR Codes Generated

### Hospital Attendance QR (6 files):
```
uploads/qr/present_HOSP001.png
uploads/qr/absent_HOSP001.png
uploads/qr/present_HOSP002.png
uploads/qr/absent_HOSP002.png
uploads/qr/present_HOSP003.png
uploads/qr/absent_HOSP003.png
```

### Bed QR Codes (78 files):
```
uploads/qrs/HOSP001-ICU-B01-vacant.png
uploads/qrs/HOSP001-ICU-B01-occupied.png
... (2 per bed × 39 beds)
```

**Total QR Codes**: 84 files

---

## 🧪 Testing Login

### Reception Portal:
```
URL: http://localhost:5000/reception.html
ID: HOSP001
Password: test@1234
```

### Doctor Portal:
```
URL: http://localhost:5000/doctor.html
ID: DOC100
Password: test@1234
```

### Ambulance Portal:
```
URL: http://localhost:5000/ambulance.html
ID: AMB001
Password: test@1234
```

---

## ⚠️ Important Notes

1. **Password Security**: All passwords are bcrypt-hashed in the database
2. **Force Password Change**: Set to `true` (can be implemented as future feature)
3. **Data Isolation**: Each hospital sees only its own data
4. **Testing Only**: These credentials are for development/testing purposes
5. **Production**: Change passwords and secure the `/api/reset-db` endpoint

---

## 🔐 Password Hash Format

```javascript
// In reset.js:
password: bcrypt.hashSync('test@1234', 10)

// Salt rounds: 10
// Algorithm: bcrypt
```

---

## 📝 Changelog

**Previous Credentials** (Before Reset):
- Hospital: `CG04AIIMSRAIPUR` / `test@1234`
- Doctor: `CG0890` / `test@1234`
- Ambulance: `108AMB01` / `test@1234`

**Current Credentials** (After Reset):
- Hospital: `HOSP001`, `HOSP002`, `HOSP003` / `test@1234`
- Doctor: `DOC100`, `DOC101`, `DOC102`, `DOC103` / `test@1234`
- Ambulance: `AMB001`, `AMB002` / `test@1234`

---

**Last Updated**: 2025-11-22  
**Database Reset Script**: `routes/reset.js`  
**Total Accounts**: 9 (3 hospitals + 4 doctors + 2 ambulances)
