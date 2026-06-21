# Backend API - Validation & Error Handling Guide

## Overview
Your backend now includes comprehensive input validation, error handling, and sanitization for all endpoints.

---

## GET Endpoints

### `GET /api/matches`
Returns all matches with validation counts.

**Response (200 OK):**
```json
{
  "success": true,
  "count": 9,
  "data": [
    {
      "id": 1,
      "date": "2018-06-14",
      "year": 2018,
      "stage": "Group",
      "homeTeam": "Russia",
      "awayTeam": "Saudi Arabia",
      "homeGoals": 5,
      "awayGoals": 0,
      "winner": "Russia",
      "venue": ""
    }
  ]
}
```

---

### `GET /api/players`
Returns all players sorted by goals and assists.

**Response (200 OK):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "name": "Lionel Messi",
      "team": "Argentina",
      "position": "Forward",
      "age": 35,
      "jersey": 10,
      "goals": 7,
      "assists": 3,
      "rating": 9.7
    }
  ]
}
```

---

## POST Endpoints

### `POST /api/matches`
Add a new match with validation.

**Validation Rules:**
| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `date` | String | ✓ | Must be YYYY-MM-DD format |
| `homeTeam` | String | ✓ | Cannot be same as awayTeam |
| `awayTeam` | String | ✓ | Cannot be same as homeTeam |
| `year` | Integer | ✗ | 1930-2100 (auto-set from date if omitted) |
| `homeGoals` | Integer | ✗ | Must be ≥ 0 |
| `awayGoals` | Integer | ✗ | Must be ≥ 0 |
| `stage` | String | ✗ | Max 255 characters |
| `winner` | String | ✗ | Max 255 characters |
| `venue` | String | ✗ | Max 255 characters |

**Valid Request:**
```json
{
  "date": "2026-06-15",
  "year": 2026,
  "stage": "Group",
  "homeTeam": "Italy",
  "awayTeam": "Portugal",
  "homeGoals": 2,
  "awayGoals": 1,
  "winner": "Italy",
  "venue": "Rome"
}
```

**Success Response (201 Created):**
```json
{
  "id": 10,
  "message": "Match added successfully",
  "data": {
    "id": 10,
    "date": "2026-06-15",
    "year": 2026,
    "stage": "Group",
    "homeTeam": "Italy",
    "awayTeam": "Portugal",
    "homeGoals": 2,
    "awayGoals": 1,
    "winner": "Italy",
    "venue": "Rome"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid date format. Use YYYY-MM-DD",
  "field": "date",
  "timestamp": "2026-06-21T15:01:56.726Z"
}
```

---

### `POST /api/players`
Add a new player with comprehensive validation.

**Validation Rules:**
| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `name` | String | ✓ | Max 255 characters, trimmed |
| `team` | String | ✓ | Max 255 characters, trimmed |
| `position` | String | ✗ | Must be: Forward, Midfielder, Defender, or Goalkeeper |
| `age` | Integer | ✗ | 15-50 |
| `jersey` | Integer | ✗ | 0-99 |
| `goals` | Integer | ✗ | Must be ≥ 0 |
| `assists` | Integer | ✗ | Must be ≥ 0 |
| `rating` | Float | ✗ | 0-10 |

**Valid Request:**
```json
{
  "name": "Cristiano Ronaldo",
  "team": "Portugal",
  "position": "Forward",
  "age": 41,
  "jersey": 7,
  "goals": 8,
  "assists": 2,
  "rating": 8.9
}
```

**Success Response (201 Created):**
```json
{
  "id": 6,
  "message": "Player added successfully",
  "data": {
    "id": 6,
    "name": "Cristiano Ronaldo",
    "team": "Portugal",
    "position": "Forward",
    "age": 41,
    "jersey": 7,
    "goals": 8,
    "assists": 2,
    "rating": 8.9
  }
}
```

**Error Response - Invalid Position:**
```json
{
  "error": "Invalid position. Must be Forward, Midfielder, Defender, or Goalkeeper",
  "field": "position",
  "timestamp": "2026-06-21T15:01:56.726Z"
}
```

**Error Response - Age Out of Range:**
```json
{
  "error": "Age must be between 15 and 50",
  "field": "age",
  "timestamp": "2026-06-21T15:01:56.726Z"
}
```

---

### `POST /api/contact`
Submit a contact message with email validation.

**Validation Rules:**
| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `name` | String | ✓ | Max 255 characters, trimmed |
| `email` | String | ✓ | Valid email format (user@domain.com) |
| `message` | String | ✓ | 10-5000 characters |

**Valid Request:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "message": "I would like to suggest adding more World Cup data from earlier years."
}
```

**Success Response (201 Created):**
```json
{
  "id": 1,
  "message": "Contact message received successfully",
  "data": {
    "id": 1,
    "email": "john.doe@example.com",
    "submittedAt": "2026-06-21T15:01:56.726Z"
  }
}
```

**Error Response - Invalid Email:**
```json
{
  "error": "Invalid email format",
  "field": "email",
  "timestamp": "2026-06-21T15:01:56.726Z"
}
```

**Error Response - Message Too Short:**
```json
{
  "error": "Message must be at least 10 characters",
  "field": "message",
  "timestamp": "2026-06-21T15:01:56.726Z"
}
```

---

## Error Handling

### General Error Response Format
```json
{
  "error": "Error description",
  "field": "fieldName",
  "timestamp": "2026-06-21T15:01:56.726Z"
}
```

### Common HTTP Status Codes
- **201 Created** - Resource successfully created
- **400 Bad Request** - Validation error (check `field` for details)
- **404 Not Found** - Endpoint not found
- **500 Internal Server Error** - Server error

### 404 Not Found Response
```json
{
  "error": "Not Found",
  "path": "/api/unknown",
  "method": "GET",
  "timestamp": "2026-06-21T15:01:56.726Z"
}
```

---

## Testing the API

### Test with curl (Windows PowerShell)

**Add a Match:**
```powershell
$body = @{
    date = "2026-07-15"
    homeTeam = "Brazil"
    awayTeam = "France"
    homeGoals = 2
    awayGoals = 1
    year = 2026
    stage = "Semi"
    winner = "Brazil"
    venue = "Paris"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/matches" -Method POST -Body $body -ContentType "application/json"
```

**Add a Player:**
```powershell
$body = @{
    name = "Vinicius Jr"
    team = "Brazil"
    position = "Forward"
    age = 25
    jersey = 7
    goals = 5
    assists = 2
    rating = 8.7
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/players" -Method POST -Body $body -ContentType "application/json"
```

**Submit Contact:**
```powershell
$body = @{
    name = "Jane Smith"
    email = "jane.smith@example.com"
    message = "Great dashboard! Would love to see player statistics."
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/contact" -Method POST -Body $body -ContentType "application/json"
```

---

## Key Features

✅ **Input Validation** - All fields validated before database insertion  
✅ **Data Sanitization** - String trimming, length limits, type coercion  
✅ **Error Messages** - Detailed, field-specific error responses  
✅ **Type Safety** - Numeric fields validated and coerced  
✅ **Request Logging** - All requests logged with timestamps  
✅ **Database Error Handling** - Database errors caught and reported  
✅ **CORS-Ready** - Structure supports future CORS implementation

---

## Security Considerations

- All string inputs are trimmed and limited to 255 characters (5000 for messages)
- Email addresses are lowercased for consistency
- Negative values rejected for numeric fields where inappropriate
- Invalid enum values (e.g., positions) rejected
- Type coercion prevents type-related vulnerabilities

---

## Next Steps (Optional Enhancements)

Consider adding:
1. **CORS Middleware** - For cross-origin requests
2. **Rate Limiting** - Prevent API abuse
3. **Authentication** - Protect sensitive endpoints
4. **Request Logging to File** - For monitoring
5. **API Documentation** - Swagger/OpenAPI integration
