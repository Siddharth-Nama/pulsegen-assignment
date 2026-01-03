# PulseGen API Documentation

## Authentication
- **Register**: `POST /api/auth/register/`
  - Body: `{ "username": "...", "email": "...", "password": "..." }`
- **Login**: `POST /api/auth/login/`
  - Body: `{ "username": "...", "password": "..." }`
- **Logout**: `POST /api/auth/logout/`
  - Body: `{ "refresh": "..." }`
- **Token Refresh**: `POST /api/auth/token/refresh/`
  - Body: `{ "refresh": "..." }`

## Videos
- **List/Create**: `GET/POST /api/videos/`
  - Body (POST): Multipart form data (`file`, `title`, `description`)
  - Filter: `?search=...`, `?ordering=...`
- **Detail/Delete**: `GET/DELETE /api/videos/<uuid:id>/`
- **Stream**: `GET /api/videos/<uuid:id>/stream/`
  - Supports `Range` header.

## WebSocket (Socket.io)
- **Connect**: `ws://localhost:8000/socket.io/`
- **Events**:
  - `video_status`: Emitted when video status changes. Payload: `{ "id": "...", "status": "..." }`
