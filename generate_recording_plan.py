#!/usr/bin/env python3
"""
Guitar Exercise Video Recording Plan Generator

Reads catalog.json and generates:
- Recording schedule (10 videos/day)
- Markdown checklist
- Directory structure for video files
- Upload batch script
"""

import json
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict


class RecordingPlanGenerator:
    def __init__(self, catalog_path: str = "catalog.json", videos_per_day: int = 10):
        self.catalog_path = catalog_path
        self.videos_per_day = videos_per_day
        self.exercises = []
        self.start_date = datetime.now()

    def load_catalog(self) -> None:
        """Load exercises from catalog.json"""
        with open(self.catalog_path, 'r') as f:
            data = json.load(f)
            self.exercises = data.get('exercises', [])
        print(f"✓ Loaded {len(self.exercises)} exercises from catalog")

    def generate_schedule(self) -> List[Dict]:
        """Generate daily recording schedule"""
        schedule = []
        total_days = (len(self.exercises) + self.videos_per_day - 1) // self.videos_per_day

        for day in range(total_days):
            start_idx = day * self.videos_per_day
            end_idx = min(start_idx + self.videos_per_day, len(self.exercises))
            day_exercises = self.exercises[start_idx:end_idx]

            schedule.append({
                'day': day + 1,
                'date': self.start_date + timedelta(days=day),
                'exercises': day_exercises,
                'total_duration': sum(ex.get('duration_minutes', 5) for ex in day_exercises)
            })

        return schedule

    def create_markdown_schedule(self, schedule: List[Dict]) -> str:
        """Generate markdown recording schedule"""
        md = "# Guitar Exercise Recording Schedule\n\n"
        md += f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M')}\n"
        md += f"**Total Exercises:** {len(self.exercises)}\n"
        md += f"**Videos per Day:** {self.videos_per_day}\n"
        md += f"**Total Days:** {len(schedule)}\n\n"
        md += "---\n\n"

        for day_plan in schedule:
            day_num = day_plan['day']
            date = day_plan['date'].strftime('%Y-%m-%d (%A)')
            exercises = day_plan['exercises']
            duration = day_plan['total_duration']

            md += f"## Day {day_num} - {date}\n\n"
            md += f"**Estimated Recording Time:** {duration} minutes\n\n"
            md += "### Exercises\n\n"

            for ex in exercises:
                category = ex.get('category', 'general')
                filename = ex.get('filename', 'unnamed')
                title = ex.get('title', 'Untitled')
                difficulty = ex.get('difficulty', 'unknown')
                duration_min = ex.get('duration_minutes', 5)

                # Video filename format: category_filename_YYYYMMDD.mp4
                video_name = f"{category}_{filename}_{day_plan['date'].strftime('%Y%m%d')}.mp4"

                md += f"- [ ] **{title}**\n"
                md += f"  - ID: `{ex.get('id', 'N/A')}`\n"
                md += f"  - Category: `{category}`\n"
                md += f"  - Difficulty: `{difficulty}`\n"
                md += f"  - Duration: `{duration_min} min`\n"
                md += f"  - Video File: `{video_name}`\n"
                md += f"  - Tags: {', '.join(f'`{tag}`' for tag in ex.get('tags', []))}\n\n"

            md += "---\n\n"

        return md

    def create_directory_structure(self) -> None:
        """Create directory structure for video files"""
        base_dir = Path("videos")
        base_dir.mkdir(exist_ok=True)

        # Create category subdirectories
        categories = set(ex.get('category', 'general') for ex in self.exercises)
        for category in categories:
            category_dir = base_dir / category
            category_dir.mkdir(exist_ok=True)

        # Create staging directories
        (base_dir / "raw").mkdir(exist_ok=True)
        (base_dir / "edited").mkdir(exist_ok=True)
        (base_dir / "ready_to_upload").mkdir(exist_ok=True)

        print(f"✓ Created directory structure in {base_dir}/")
        print(f"  - {len(categories)} category folders")
        print("  - raw/ (for unprocessed recordings)")
        print("  - edited/ (for post-processed videos)")
        print("  - ready_to_upload/ (for final uploads)")

    def create_gitkeep_files(self) -> None:
        """Create .gitkeep files to preserve empty directories"""
        base_dir = Path("videos")

        for subdir in base_dir.rglob("*"):
            if subdir.is_dir():
                gitkeep = subdir / ".gitkeep"
                gitkeep.touch()

        print("✓ Created .gitkeep files in all directories")

    def generate_upload_script(self, schedule: List[Dict]) -> str:
        """Generate bash script for batch uploads"""
        script = """#!/bin/bash
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
"""
        return script

    def run(self) -> None:
        """Run the full generation process"""
        print("Guitar Exercise Recording Plan Generator")
        print("=" * 50)
        print()

        # Load catalog
        self.load_catalog()

        # Generate schedule
        print("Generating recording schedule...")
        schedule = self.generate_schedule()
        print(f"✓ Created {len(schedule)}-day schedule")

        # Create markdown
        print("\nGenerating markdown schedule...")
        markdown = self.create_markdown_schedule(schedule)
        with open("recording_schedule.md", 'w') as f:
            f.write(markdown)
        print("✓ Saved recording_schedule.md")

        # Create directories
        print("\nCreating directory structure...")
        self.create_directory_structure()
        self.create_gitkeep_files()

        # Create upload script
        print("\nGenerating upload script...")
        upload_script = self.generate_upload_script(schedule)
        script_path = Path("upload_batch.sh")
        with open(script_path, 'w') as f:
            f.write(upload_script)
        script_path.chmod(0o755)  # Make executable
        print("✓ Saved upload_batch.sh (executable)")

        # Summary
        print("\n" + "=" * 50)
        print("GENERATION COMPLETE")
        print("=" * 50)
        print("\nFiles created:")
        print(f"  - recording_schedule.md (checklist for {len(schedule)} days)")
        print(f"  - videos/ (directory structure with {len(set(ex.get('category') for ex in self.exercises))} categories)")
        print("  - upload_batch.sh (batch upload script)")
        print("\nNext steps:")
        print("  1. Review recording_schedule.md")
        print("  2. Start recording (save to videos/raw/)")
        print("  3. Edit videos (move to videos/edited/)")
        print("  4. Move final videos to videos/ready_to_upload/")
        print("  5. Run: ./upload_batch.sh --dry-run")
        print("  6. Run: ./upload_batch.sh --platform [vercel|s3]")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Generate guitar exercise recording plan")
    parser.add_argument(
        "--catalog",
        default="catalog.json",
        help="Path to catalog.json (default: catalog.json)"
    )
    parser.add_argument(
        "--videos-per-day",
        type=int,
        default=10,
        help="Number of videos to record per day (default: 10)"
    )

    args = parser.parse_args()

    generator = RecordingPlanGenerator(
        catalog_path=args.catalog,
        videos_per_day=args.videos_per_day
    )
    generator.run()
