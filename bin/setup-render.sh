#!/usr/bin/env bash
set -e

echo "🎬 Starting ClipForge setup for Render environment..."

# Create bin directory
mkdir -p bin
cd bin

# Download FFmpeg static build if not already present
if [ ! -f "ffmpeg" ] || [ ! -f "ffprobe" ]; then
  echo "📥 Downloading static FFmpeg..."
  wget -q https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz
  echo "📦 Extracting FFmpeg..."
  tar -xf ffmpeg-release-amd64-static.tar.xz --strip-components=1
  rm -f ffmpeg-release-amd64-static.tar.xz
  echo "✅ FFmpeg and FFprobe extracted successfully."
else
  echo "✨ FFmpeg and FFprobe already present."
fi

# Download yt-dlp if not already present
if [ ! -f "yt-dlp" ]; then
  echo "📥 Downloading yt-dlp..."
  wget -q https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp
  chmod +x yt-dlp
  echo "✅ yt-dlp downloaded and marked executable."
else
  echo "✨ yt-dlp already present."
fi

echo "🚀 Setup completed successfully."
