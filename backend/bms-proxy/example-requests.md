# Example API Requests

## Testing the BMS Proxy Service

### 1. Login Request

**Endpoint:** `POST http://localhost:4000/api/login`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "username": "crossbow",
  "password": "crossbow@123"
}
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "cookies": {
    "JSESSIONID": "abc123def456...",
    "DWRSESSIONID": "ghi789jkl012..."
  }
}
```

### 2. Set Temperature Request

**Endpoint:** `POST http://localhost:4000/api/set-temp`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "device_vfdReadingSetTemp": 26,
  "requestType": "ElectricalMeters",
  "subRequestType": "ConfigureDataAtDevice",
  "username": "crossbow"
}
```

**Expected Response:**
Returns the BMS API response directly.

## cURL Examples

### Login
```bash
curl -X POST http://localhost:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "crossbow",
    "password": "crossbow@123"
  }'
```

### Set Temperature
```bash
curl -X POST http://localhost:4000/api/set-temp \
  -H "Content-Type: application/json" \
  -d '{
    "device_vfdReadingSetTemp": 26,
    "requestType": "ElectricalMeters",
    "subRequestType": "ConfigureDataAtDevice",
    "username": "crossbow"
  }'
```

## Testing Flow

1. **Start the service:** `npm run start:dev`
2. **Login first:** Use the login endpoint to authenticate
3. **Set temperature:** Use the set-temp endpoint with the session established
4. **Check cookies:** The service automatically manages session cookies

## Error Scenarios

### No Active Session
```json
{
  "statusCode": 400,
  "message": "No active session. Please login first.",
  "error": "Bad Request"
}
```

### Session Expired
```json
{
  "statusCode": 400,
  "message": "Session expired. Please login again.",
  "error": "Bad Request"
}
```

### Login Failed
```json
{
  "statusCode": 500,
  "message": "Login failed"
}
```
