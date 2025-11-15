# Guitar Content Catalog

This directory contains the structured catalog of Guitar Pro files for the Guitar Consciousness service.

## Overview

- **Total Files**: 70 unique Guitar Pro files
- **Version**: 1.0
- **Generated**: 2025-11-14

## Catalog Structure

### catalog.json

The main catalog file with the following structure:

```json
{
  "version": "1.0",
  "generated_at": "2025-11-14",
  "total_files": 70,
  "tier_distribution": {...},
  "categories": [...],
  "files": [
    {
      "filename": "string",
      "title": "string",
      "category": "string",
      "techniques": ["array"],
      "difficulty": "beginner|intermediate|advanced",
      "tier": "free|premium|pro"
    }
  ]
}
```

### Fields

- **filename**: Original Guitar Pro file name (.gp or .gpx)
- **title**: Display title (filename without extension)
- **category**: Primary technique category
- **techniques**: Array of all applicable techniques
- **difficulty**: Skill level (beginner/intermediate/advanced)
- **tier**: Access tier (free/premium/pro)

## Tier Distribution

### Free Tier (10 files)
Beginner-friendly content for users getting started:
- Basic scales in all keys
- Fundamental chord concepts
- Mini courses on foundational topics
- Simple pentatonic exercises

**Difficulty**: 9 beginner, 1 intermediate

### Premium Tier (30 files)
Intermediate content for developing players:
- Scale variations and sequences
- Pentatonic patterns
- Economy picking exercises
- Arpeggio sequences
- Legato patterns
- Alternate picking drills

**Difficulty**: 30 intermediate

### Pro Tier (30 files)
Advanced techniques and complex patterns:
- Sweep picking sequences
- Two-handed tapping
- Harmonic minor arpeggios
- Complex scale sequences
- Advanced economy picking
- Etudes and complex licks

**Difficulty**: 22 intermediate, 8 advanced

## Categories (11 Total)

| Category | File Count | Primary Techniques |
|----------|------------|-------------------|
| Scale | 24 | Major, minor, harmonic minor, hexatonic |
| Arpeggio | 10 | m7b5, extended, sequences, harmonic minor |
| Pentatonic | 8 | Major, minor, sequences, patterns |
| Economy | 8 | Economy picking exercises and sequences |
| Exercise | 4 | General technique exercises |
| Legato | 4 | Legato patterns and workouts |
| Lick | 3 | Musical phrases and lick building |
| Sweep | 3 | Sweep picking sequences |
| Alternate | 2 | Alternate picking patterns |
| Chord | 2 | Chord theory and soloing |
| Tapping | 2 | Two-handed tapping sequences |

## Tier Assignment Logic

### Difficulty Classification

Files are classified into difficulty levels based on:

**Beginner**:
- "All Keys" scale/pentatonic exercises
- "Seven Positions" pattern exercises
- "Mini Course" educational content
- Basic chord exercises
- Fundamental technique patterns

**Intermediate**:
- Technique-specific exercises (legato, alternate, economy)
- Pentatonic and arpeggio sequences
- Scale variations and patterns
- Standard difficulty exercises

**Advanced**:
- Sweep picking content
- Tapping exercises
- Harmonic minor arpeggios
- Files with "insane", "complex", or similar indicators
- Advanced sequences and etudes

### Tier Assignment Rules

1. **Free Tier**: All beginner files, plus easy intermediate files if needed to reach 10 total
2. **Premium Tier**: Most intermediate files (target ~40 total including free tier)
3. **Pro Tier**: All advanced files plus challenging intermediate files (target ~30 total)

## Usage

### Loading the Catalog

```typescript
import catalog from './services/guitar/data/catalog.json';

// Get all free tier files
const freeTier = catalog.files.filter(f => f.tier === 'free');

// Get files by category
const scaleExercises = catalog.files.filter(f => f.category === 'scale');

// Get files by difficulty
const beginnerFiles = catalog.files.filter(f => f.difficulty === 'beginner');
```

### Filtering by Multiple Techniques

```typescript
// Files that include sweep picking
const sweepFiles = catalog.files.filter(f =>
  f.techniques.includes('sweep')
);

// Files that combine pentatonic and economy picking
const combinedTech = catalog.files.filter(f =>
  f.techniques.includes('pentatonic') &&
  f.techniques.includes('economy')
);
```

## Data Source

Generated from analysis of Guitar Pro files located at:
`~/Projects/guitar_consciousness/gp_analysis.json`

The analysis identified technique patterns, categorized files, and provided the foundation for tier assignments.

## Notes

- Some files appear in multiple technique categories (e.g., "5 Sweep:Economy Pentatonic Scale Patterns" includes sweep, economy, pentatonic, and scale)
- The primary category is determined by technique priority (sweep > tapping > legato > alternate > economy > arpeggio > pentatonic > scale)
- Total unique files (70) is less than the 100 GP files analyzed because not all files matched technique pattern keywords

## Regenerating the Catalog

To regenerate the catalog from updated analysis:

```bash
python3 generate_catalog.py
```

This will:
1. Read the latest gp_analysis.json
2. Extract and classify files
3. Assign tiers based on difficulty distribution
4. Write updated catalog.json

---

**Last Updated**: 2025-11-14
**Catalog Version**: 1.0
