# Guitar Exercise Video Recording Workflow

Complete automation system for recording, organizing, and uploading guitar exercise videos.

## Overview

This system helps you:
- Organize 100 guitar exercise recordings across 10 days
- Generate daily recording checklists
- Maintain consistent video naming conventions
- Upload videos to cloud storage (Vercel Blob or AWS S3)

## Quick Start

### 1. Generate Recording Plan

```bash
python3 generate_recording_plan.py
```

**Output:**
- `recording_schedule.md` - Daily checklist (10 days, 10 videos/day)
- `videos/` - Directory structure organized by category
- `upload_batch.sh` - Batch upload script

### 2. Review Schedule

```bash
cat recording_schedule.md
```

The schedule includes:
- Daily breakdown of exercises
- Video naming convention: `{category}_{filename}_{YYYYMMDD}.mp4`
- Estimated recording time per day
- Exercise details (difficulty, duration, tags)

### 3. Record Videos

Save recordings to: `videos/raw/`

**Example:**
```bash
# Day 1 - Record alternate picking basic
videos/raw/technique_alternate_picking_basic_20251114.mp4
```

### 4. Edit Videos

Move edited videos to: `videos/edited/`

**Recommended editing:**
- Trim intro/outro
- Add title card
- Normalize audio
- Export at consistent quality (1080p, 30fps recommended)

### 5. Prepare for Upload

Move final videos to: `videos/ready_to_upload/`

```bash
mv videos/edited/technique_alternate_picking_basic_20251114.mp4 \
   videos/ready_to_upload/
```

### 6. Upload Videos

**Test upload (dry-run):**
```bash
./upload_batch.sh --dry-run
```

**Upload to Vercel Blob:**
```bash
export VERCEL_TOKEN="your-token-here"
./upload_batch.sh --platform vercel
```

**Upload to AWS S3:**
```bash
export S3_BUCKET="your-bucket-name"
./upload_batch.sh --platform s3
```

---

## Directory Structure

```
.
├── catalog.json                    # Exercise catalog (100 entries)
├── generate_recording_plan.py      # Plan generator script
├── recording_schedule.md           # Daily recording checklist
├── upload_batch.sh                 # Upload automation script
└── videos/
    ├── raw/                        # Unprocessed recordings
    ├── edited/                     # Post-processed videos
    ├── ready_to_upload/            # Final uploads
    ├── arpeggios/                  # Category: Arpeggios
    ├── blues/                      # Category: Blues
    ├── chords/                     # Category: Chords
    ├── country/                    # Category: Country
    ├── ear_training/               # Category: Ear Training
    ├── exercises/                  # Category: Exercises
    ├── fingerstyle/                # Category: Fingerstyle
    ├── funk/                       # Category: Funk
    ├── improvisation/              # Category: Improvisation
    ├── jazz/                       # Category: Jazz
    ├── latin/                      # Category: Latin
    ├── metal/                      # Category: Metal
    ├── rhythm/                     # Category: Rhythm
    ├── rock/                       # Category: Rock
    ├── scales/                     # Category: Scales
    ├── technique/                  # Category: Technique
    └── theory/                     # Category: Theory
```

---

## Video Naming Convention

**Format:** `{category}_{filename}_{YYYYMMDD}.mp4`

**Examples:**
- `technique_alternate_picking_basic_20251114.mp4`
- `scales_major_scale_position_1_20251114.mp4`
- `arpeggios_major_triad_arpeggio_position_1_20251114.mp4`

**Why this format?**
- Sortable by date
- Easy to identify category
- Descriptive filename
- Consistent across all videos

---

## Script Reference

### generate_recording_plan.py

**Usage:**
```bash
python3 generate_recording_plan.py [options]
```

**Options:**
- `--catalog <path>` - Path to catalog.json (default: catalog.json)
- `--videos-per-day <num>` - Videos per day (default: 10)

**Examples:**
```bash
# Generate default plan (10 videos/day)
python3 generate_recording_plan.py

# Generate custom plan (5 videos/day, 20 days)
python3 generate_recording_plan.py --videos-per-day 5
```

**What it does:**
1. Loads exercises from `catalog.json`
2. Splits into daily batches
3. Generates `recording_schedule.md` with checklist
4. Creates `videos/` directory structure
5. Generates `upload_batch.sh` script

---

### upload_batch.sh

**Usage:**
```bash
./upload_batch.sh [options]
```

**Options:**
- `--dry-run` - Preview upload without executing
- `--platform <vercel|s3>` - Upload platform (default: vercel)

**Examples:**
```bash
# Test upload (no files uploaded)
./upload_batch.sh --dry-run

# Upload to Vercel Blob
export VERCEL_TOKEN="your-token"
./upload_batch.sh --platform vercel

# Upload to AWS S3
export S3_BUCKET="your-bucket"
./upload_batch.sh --platform s3
```

**Requirements:**

**Vercel:**
```bash
npm install -g @vercel/blob
export VERCEL_TOKEN="your-vercel-token"
```

**AWS S3:**
```bash
# Install AWS CLI
brew install awscli

# Configure credentials
aws configure

# Set bucket name
export S3_BUCKET="your-bucket-name"
```

---

## Workflow Tips

### Recording Best Practices

1. **Consistent setup:**
   - Same camera angle
   - Same lighting
   - Same audio settings

2. **Daily recording sessions:**
   - Warm up before recording
   - Record in batches (10 videos = ~1 hour)
   - Take breaks between exercises

3. **File management:**
   - Save raw recordings immediately after each take
   - Name files according to convention (use copy-paste from schedule)
   - Back up raw files to external drive

### Editing Workflow

1. **Batch editing:**
   - Edit all Day 1 videos in one session
   - Create template with consistent intro/outro
   - Use keyboard shortcuts for speed

2. **Quality standards:**
   - 1080p resolution (1920x1080)
   - 30fps or 60fps (consistent across all videos)
   - Audio normalization (-14 LUFS recommended)
   - Clear framing (hands + fretboard visible)

3. **Export settings:**
   - Format: MP4 (H.264)
   - Bitrate: 8-12 Mbps for 1080p
   - Audio: AAC, 192 kbps

### Upload Strategy

1. **Daily uploads:**
   - Upload each day's completed videos
   - Keep `ready_to_upload/` directory clean

2. **Batch uploads:**
   - Use `--dry-run` first to verify
   - Upload during off-peak hours (faster)
   - Verify uploads complete successfully

---

## Catalog Structure

`catalog.json` contains 100 exercises with metadata:

```json
{
  "exercises": [
    {
      "id": 1,
      "category": "technique",
      "filename": "alternate_picking_basic",
      "title": "Alternate Picking - Basic",
      "difficulty": "beginner",
      "duration_minutes": 5,
      "tags": ["picking", "fundamentals"]
    }
  ]
}
```

**Fields:**
- `id` - Unique exercise ID (1-100)
- `category` - Exercise category (17 categories total)
- `filename` - Base filename for video
- `title` - Human-readable title
- `difficulty` - beginner | intermediate | advanced
- `duration_minutes` - Estimated recording time
- `tags` - Searchable tags

### Categories (17 total)

1. **technique** - Picking, legato, bending, vibrato, etc.
2. **scales** - Major, minor, pentatonic, modes
3. **arpeggios** - Triads, seventh chords
4. **rhythm** - Strumming patterns, syncopation
5. **chords** - Open, barre, jazz voicings
6. **fingerstyle** - Travis picking, patterns
7. **blues** - Shuffles, licks, turnarounds
8. **jazz** - Comping, walking bass, bebop
9. **metal** - Riffs, tremolo, gallop rhythm
10. **rock** - Power chords, classic riffs
11. **country** - Chicken pickin', double stops
12. **funk** - Rhythm grooves, chord stabs
13. **latin** - Bossa nova, rumba
14. **exercises** - Warm-ups, finger independence
15. **theory** - Intervals, harmony, circle of fifths
16. **ear_training** - Interval recognition, chord quality
17. **improvisation** - Soloing concepts, modal improv

---

## Customization

### Modify Videos Per Day

```bash
# 5 videos/day (20 days total)
python3 generate_recording_plan.py --videos-per-day 5

# 20 videos/day (5 days total)
python3 generate_recording_plan.py --videos-per-day 20
```

### Add Custom Exercises

Edit `catalog.json`:

```json
{
  "id": 101,
  "category": "your_category",
  "filename": "your_filename",
  "title": "Your Exercise Title",
  "difficulty": "intermediate",
  "duration_minutes": 6,
  "tags": ["tag1", "tag2"]
}
```

Then regenerate:
```bash
python3 generate_recording_plan.py
```

### Custom Upload Platforms

Edit `upload_batch.sh` to add custom platforms:

```bash
case $PLATFORM in
  vercel)
    vercel blob put "$video_file" --token="$VERCEL_TOKEN"
    ;;
  s3)
    aws s3 cp "$video_file" "s3://$S3_BUCKET/videos/$filename"
    ;;
  custom)
    # Add your custom upload logic here
    your-upload-command "$video_file"
    ;;
esac
```

---

## Troubleshooting

### "No such file or directory: catalog.json"

**Solution:** Make sure you're in the correct directory:
```bash
ls catalog.json  # Should exist
python3 generate_recording_plan.py
```

### Upload script not executable

**Solution:** Make script executable:
```bash
chmod +x upload_batch.sh
```

### Vercel upload fails

**Solutions:**
1. Check token: `echo $VERCEL_TOKEN`
2. Install CLI: `npm install -g @vercel/blob`
3. Verify file exists: `ls videos/ready_to_upload/`

### AWS S3 upload fails

**Solutions:**
1. Check credentials: `aws sts get-caller-identity`
2. Check bucket: `aws s3 ls s3://$S3_BUCKET`
3. Verify permissions: Ensure write access to bucket

---

## Progress Tracking

Use `recording_schedule.md` to track progress:

```markdown
- [x] **Alternate Picking - Basic**  ✓ Recorded
- [x] **Alternate Picking - Intermediate**  ✓ Recorded
- [ ] **Alternate Picking - Advanced**  ← Next
```

**Tips:**
- Check off exercises as you complete them
- Add notes for retakes or issues
- Track upload status separately

---

## Example Daily Workflow

**Day 1 (Friday):**

1. **Morning - Setup**
   ```bash
   # Review schedule
   cat recording_schedule.md | grep "Day 1"

   # Prepare equipment
   # - Camera charged
   # - Lighting setup
   # - Guitar tuned
   ```

2. **Recording Session (1 hour)**
   - Record 10 exercises
   - Save to `videos/raw/`
   - Check off in schedule

3. **Afternoon - Editing**
   - Import raw files
   - Edit with template
   - Export to `videos/edited/`

4. **Evening - Upload**
   ```bash
   # Move to upload directory
   mv videos/edited/*.mp4 videos/ready_to_upload/

   # Test upload
   ./upload_batch.sh --dry-run

   # Upload
   ./upload_batch.sh --platform vercel
   ```

5. **Cleanup**
   - Archive raw files to external drive
   - Clear `ready_to_upload/`
   - Update progress in schedule

**Repeat for Days 2-10**

---

## Stats

- **Total Exercises:** 100
- **Total Days:** 10 (at 10 videos/day)
- **Categories:** 17
- **Difficulty Levels:** 3 (beginner, intermediate, advanced)
- **Estimated Total Recording Time:** ~600 minutes (10 hours)

---

## Next Steps

1. **Customize catalog** (optional)
   - Add your own exercises
   - Modify difficulty levels
   - Update tags

2. **Test workflow** (recommended)
   - Record 1-2 test videos
   - Practice editing workflow
   - Test upload to cloud

3. **Start recording**
   - Follow `recording_schedule.md`
   - Maintain consistent quality
   - Track progress

4. **Automate further** (advanced)
   - Auto-upload after editing
   - Generate thumbnails
   - Create video descriptions

---

## License

MIT

---

**Questions or issues?** Review this document or check the script source code for implementation details.
