# WAHA REST API Reference

WAHA provides a complete REST API for sending and receiving WhatsApp messages, media, and managing sessions.

Base URL: `http://localhost:3000`

---

## 1. Session Management

### Start Session
```http
POST /api/sessions/start
Content-Type: application/json

{
  "name": "default"
}
```

### Get Session Status / QR Code
```http
GET /api/sessions/default
```

### Stop Session
```http
POST /api/sessions/stop
Content-Type: application/json

{
  "name": "default"
}
```

---

## 2. Messaging Endpoints

### Send Text Message
```http
POST /api/sendText
Content-Type: application/json

{
  "session": "default",
  "chatId": "1234567890@c.us",
  "text": "Hello from WAHA + n8n automation!"
}
```

### Send Image / File
```http
POST /api/sendImage
Content-Type: application/json

{
  "session": "default",
  "chatId": "1234567890@c.us",
  "file": {
    "url": "https://example.com/invoice.pdf",
    "filename": "invoice.pdf"
  },
  "caption": "Here is your invoice"
}
```

### Send Seen / Read Receipt
```http
POST /api/sendSeen
Content-Type: application/json

{
  "session": "default",
  "chatId": "1234567890@c.us"
}
```

---

## 3. Webhook Payload Format

When a message is received, WAHA sends a POST request with the following JSON structure:

```json
{
  "event": "message",
  "session": "default",
  "payload": {
    "id": "true_1234567890@c.us_3EB0...",
    "timestamp": 1724800000,
    "from": "1234567890@c.us",
    "fromMe": false,
    "body": "Hello world",
    "hasMedia": false
  }
}
```
