#!/usr/bin/env python3
"""Generate guitar content catalog from GP analysis file."""

import json
from pathlib import Path
from typing import Dict, List, Set

# Read analysis file
analysis_path = Path.home() / "Projects/guitar_consciousness/gp_analysis.json"
with open(analysis_path) as f:
    analysis = json.load(f)

# Extract all unique files with their techniques
file_techniques: Dict[str, Set[str]] = {}
for technique, files in analysis["analysis"]["file_patterns"].items():
    for filename in files:
        if filename not in file_techniques:
            file_techniques[filename] = set()
        file_techniques[filename].add(technique)

# Difficulty classification
def classify_difficulty(filename: str, techniques: Set[str]) -> str:
    """Classify file difficulty based on filename and techniques."""
    filename_lower = filename.lower()

    # Advanced indicators
    if any(t in techniques for t in ["sweep", "tapping"]):
        return "advanced"
    if "insane" in filename_lower or "complex" in filename_lower:
        return "advanced"
    if "harmonic minor" in filename_lower:
        return "advanced"

    # Beginner indicators
    if "all keys" in filename_lower:
        return "beginner"
    if "seven positions" in filename_lower:
        return "beginner"
    if "basic" in filename_lower or "mini course" in filename_lower:
        return "beginner"
    if any(t in techniques for t in ["chord"]) and "static" not in filename_lower:
        return "beginner"

    # Default to intermediate
    return "intermediate"

# Get primary category (most relevant technique)
def get_primary_category(techniques: Set[str]) -> str:
    """Get the primary category for a file based on its techniques."""
    # Priority order for primary categorization
    priority = [
        "sweep", "tapping", "legato", "alternate",
        "economy", "arpeggio", "pentatonic", "scale",
        "chord", "lick", "etude", "solo", "exercise", "pattern"
    ]

    for tech in priority:
        if tech in techniques:
            return tech

    return "exercise"  # fallback

# Create catalog entries
catalog_entries = []
for filename, techniques in file_techniques.items():
    difficulty = classify_difficulty(filename, techniques)
    category = get_primary_category(techniques)

    # Clean up title
    title = filename.replace(".gp", "").replace(".gpx", "")

    catalog_entries.append({
        "filename": filename,
        "title": title,
        "category": category,
        "techniques": sorted(list(techniques)),
        "difficulty": difficulty,
        "tier": None  # Will assign next
    })

# Sort by difficulty then category
difficulty_order = {"beginner": 0, "intermediate": 1, "advanced": 2}
catalog_entries.sort(key=lambda x: (difficulty_order[x["difficulty"]], x["category"]))

# Assign tiers based on difficulty distribution
beginner_files = [e for e in catalog_entries if e["difficulty"] == "beginner"]
intermediate_files = [e for e in catalog_entries if e["difficulty"] == "intermediate"]
advanced_files = [e for e in catalog_entries if e["difficulty"] == "advanced"]

print(f"Difficulty distribution:")
print(f"  Beginner: {len(beginner_files)}")
print(f"  Intermediate: {len(intermediate_files)}")
print(f"  Advanced: {len(advanced_files)}")
print(f"  Total: {len(catalog_entries)}")

# Tier assignment logic
# With 70 files, target distribution: ~10 free / ~40 premium / ~20 pro
# Free: All beginner files (should be ~10)
# Premium: Most intermediate files (~40)
# Pro: Advanced + some intermediate (~20)

# All beginners are free
for entry in beginner_files:
    entry["tier"] = "free"

# Calculate targets based on total files
# Original spec: 10/60/30 for 100 files
# Adjusted for 70 files: 10/40/20 (keeping 10 free, scaling others proportionally)
total_free = len(beginner_files)
target_free = 10
target_premium = 40
target_pro = 20

# If we need more free tier content, promote some easy intermediate files
if total_free < target_free:
    easy_intermediate = [e for e in intermediate_files if "all keys" in e["filename"].lower() or "sequence" in e["filename"].lower()][:target_free-total_free]
    for entry in easy_intermediate:
        entry["tier"] = "free"
        intermediate_files.remove(entry)
    total_free = len([e for e in catalog_entries if e.get("tier") == "free"])

# Split remaining intermediate between premium and pro
# Premium gets files up to target_premium total (including any from beginners already in premium)
intermediate_for_premium = min(len(intermediate_files), target_premium - total_free)
for entry in intermediate_files[:intermediate_for_premium]:
    entry["tier"] = "premium"

# Remaining intermediate + advanced go to pro
for entry in intermediate_files[intermediate_for_premium:]:
    entry["tier"] = "pro"

# All advanced go to pro
for entry in advanced_files:
    entry["tier"] = "pro"

# Count final distribution
tier_counts = {"free": 0, "premium": 0, "pro": 0}
for entry in catalog_entries:
    tier_counts[entry["tier"]] += 1

print(f"\nTier distribution:")
print(f"  Free: {tier_counts['free']}")
print(f"  Premium: {tier_counts['premium']}")
print(f"  Pro: {tier_counts['pro']}")

# Create final catalog
catalog = {
    "version": "1.0",
    "generated_at": "2025-11-14",
    "total_files": len(catalog_entries),
    "tier_distribution": tier_counts,
    "categories": list(set(e["category"] for e in catalog_entries)),
    "files": catalog_entries
}

# Write catalog
output_path = Path("services/guitar/data/catalog.json")
with open(output_path, "w") as f:
    json.dump(catalog, f, indent=2, ensure_ascii=False)

print(f"\nCatalog written to {output_path}")
print(f"Total files: {len(catalog_entries)}")
