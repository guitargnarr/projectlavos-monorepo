#!/bin/bash
#
# Video Upload Batch Script
# Usage: ./upload_batch.sh [--dry-run] [--platform vercel|s3]
#

set -e

# Default values
DRY_RUN=false
PLATFORM="vercel"
VIDEO_DIR="videos/ready_to_upload"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --platform)
      PLATFORM="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

echo "================================"
echo "Video Upload Batch Script"
echo "================================"
echo "Platform: $PLATFORM"
echo "Dry Run: $DRY_RUN"
echo "Video Directory: $VIDEO_DIR"
echo ""

# Check if directory exists
if [ ! -d "$VIDEO_DIR" ]; then
  echo "Error: Directory $VIDEO_DIR does not exist"
  exit 1
fi

# Count videos
VIDEO_COUNT=$(find "$VIDEO_DIR" -name "*.mp4" | wc -l)
echo "Found $VIDEO_COUNT videos to upload"
echo ""

if [ "$VIDEO_COUNT" -eq 0 ]; then
  echo "No videos to upload. Exiting."
  exit 0
fi

# Upload function
upload_video() {
  local video_file="$1"
  local filename=$(basename "$video_file")

  echo "Uploading: $filename"

  if [ "$DRY_RUN" = true ]; then
    echo "  [DRY RUN] Would upload to $PLATFORM"
    return 0
  fi

  case $PLATFORM in
    vercel)
      # Upload to Vercel Blob Storage
      # Requires: npm install -g @vercel/blob
      vercel blob put "$video_file" --token="$VERCEL_TOKEN"
      ;;
    s3)
      # Upload to AWS S3
      # Requires: aws CLI configured
      aws s3 cp "$video_file" "s3://$S3_BUCKET/videos/$filename"
      ;;
    *)
      echo "Unknown platform: $PLATFORM"
      exit 1
      ;;
  esac

  echo "  ✓ Uploaded successfully"
}

# Upload all videos
for video in "$VIDEO_DIR"/*.mp4; do
  if [ -f "$video" ]; then
    upload_video "$video"
  fi
done

echo ""
echo "Upload complete!"

if [ "$DRY_RUN" = true ]; then
  echo ""
  echo "This was a dry run. No files were uploaded."
  echo "Remove --dry-run flag to perform actual upload."
fi
