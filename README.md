# 🎬 ClipForge — Precision Video Trimming

A modern web application for trimming videos with surgical precision. Upload a local video or paste a YouTube URL, select your trim range, and download the result.

![Stack](https://img.shields.io/badge/Stack-React%20%2B%20Node.js-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- 📁 **Upload Videos** — Drag & drop or browse local video files (up to 500MB)
- 🔗 **YouTube Support** — Paste any YouTube URL to fetch and trim
- ✂️ **Precision Trimming** — Draggable timeline handles with frame-accurate control
- ⬇️ **Fast Export** — Stream-copy trimming for near-instant results
- 🎨 **Cinematic UI** — Dark industrial design inspired by professional editing tools

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/) v8+
- [ffmpeg](https://ffmpeg.org/) (with ffprobe)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) (for YouTube support)

### Install ffmpeg & yt-dlp

```bash
# Ubuntu/Debian
sudo apt install ffmpeg
pip install yt-dlp

# macOS
brew install ffmpeg yt-dlp

# Arch Linux
sudo pacman -S ffmpeg yt-dlp
```

## Quick Start

```bash
# Clone and enter the project
cd clipforge

# Install all dependencies
pnpm install:all

# Start both server and client
pnpm dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## Project Structure

```
clipforge/
├── package.json          # Root scripts
├── server/               # Express.js API
│   ├── src/
│   │   ├── index.js      # Server entry
│   │   ├── routes/       # API routes
│   │   ├── utils/        # ffmpeg, yt-dlp helpers
│   │   └── middleware/   # Multer upload config
│   └── uploads/          # Temporary video storage
└── client/               # React + Vite UI
    └── src/
        ├── components/   # UI components
        ├── hooks/        # Custom React hooks
        └── utils/        # API client, formatters
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload a video file |
| POST | `/api/youtube` | Download from YouTube URL |
| POST | `/api/trim` | Trim a video segment |
| GET | `/api/video/:filename` | Stream video for preview |
| GET | `/api/download/:filename` | Download trimmed video |
| DELETE | `/api/cleanup/:filename` | Delete a file |

## Tech Stack

- **Frontend**: React 18, Vite, Axios, React Icons
- **Backend**: Express.js, Multer, FFmpeg, yt-dlp
- **Package Manager**: pnpm
