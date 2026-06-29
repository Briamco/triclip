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

echo "🚀 Setup completed successfully."
