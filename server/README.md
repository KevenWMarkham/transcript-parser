# Transcript Parser - Backend Server

Backend API for the Transcript Parser application.

## Prerequisites

- Node.js 20+
- PostgreSQL 15+ (or use Docker)
- FFmpeg installed on your system
- Gemini API key

## Installation

1. Install dependencies:
```bash
cd server
npm install
```

2. Create `.env` file from `.env.example`:
```bash
copy .env.example .env
```

3. Update `.env` with your credentials:
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: A secure random string for JWT tokens
- `GEMINI_API_KEY`: Your Google Gemini API key

## Database Setup

1. Create database:
```bash
# Using psql
createdb transcript_parser

# Or using Docker
docker run --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=transcript_parser -p 5432:5432 -d postgres:15-alpine
```

2. Generate and run migrations:
```bash
npm run db:generate
npm run db:push
```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Transcripts
- `POST /api/transcripts/upload` - Upload video for transcription (requires auth)
- `GET /api/transcripts` - List all transcripts (requires auth)
- `GET /api/transcripts/:id` - Get transcript details (requires auth)
- `DELETE /api/transcripts/:id` - Delete transcript (requires auth)
- `PATCH /api/transcripts/:id/entry/:entryId` - Update transcript entry (requires auth)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment | development |
| DATABASE_URL | PostgreSQL connection string | Required |
| JWT_SECRET | Secret for JWT tokens | Required |
| GEMINI_API_KEY | Google Gemini API key | Required |
| UPLOAD_DIR | Upload directory path | ./uploads |
| MAX_FILE_SIZE | Max upload size in bytes | 104857600 (100MB) |
| CORS_ORIGIN | CORS allowed origin | http://localhost:5173 |

## Docker

Run with Docker Compose:
```bash
cd ..
docker-compose up
```

This will start:
- PostgreSQL database
- Backend API server
- Frontend application

## FFmpeg

The server requires FFmpeg for audio extraction from video files.

### Windows
Download from https://ffmpeg.org/download.html

### macOS
```bash
brew install ffmpeg
```

### Linux
```bash
sudo apt-get install ffmpeg
```

## Project Structure

```
server/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Express middleware
│   ├── models/         # Database schemas
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   └── index.ts        # Server entry point
├── uploads/            # Uploaded files
│   ├── videos/         # Video files
│   └── audio/          # Extracted audio
└── drizzle/            # Database migrations
```

## Troubleshooting

### Database connection issues
- Ensure PostgreSQL is running
- Check DATABASE_URL format: `postgresql://user:password@host:port/database`

### FFmpeg not found
- Ensure FFmpeg is installed and in PATH
- Test with: `ffmpeg -version`

### File upload failures
- Check UPLOAD_DIR exists and has write permissions
- Verify MAX_FILE_SIZE allows your file

## License

MIT
