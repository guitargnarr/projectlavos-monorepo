#!/usr/bin/env python3
"""Generate OG image for Matthew Scott Portfolio"""

from PIL import Image, ImageDraw, ImageFont
import os

# Image dimensions (1200x1200 for square social)
WIDTH = 1200
HEIGHT = 1200

# Brand colors (teal/orange)
SLATE_900 = (15, 23, 42)
TEAL_500 = (20, 184, 166)
TEAL_400 = (45, 212, 191)
ORANGE_500 = (249, 115, 22)
SLATE_300 = (203, 213, 225)
WHITE = (255, 255, 255)

# Create image
img = Image.new('RGB', (WIDTH, HEIGHT), SLATE_900)
draw = ImageDraw.Draw(img)

# Gradient background
for i in range(HEIGHT):
    alpha = i / HEIGHT
    r = int(SLATE_900[0] + (30 - SLATE_900[0]) * alpha * 0.3)
    g = int(SLATE_900[1] + (41 - SLATE_900[1]) * alpha * 0.3)
    b = int(SLATE_900[2] + (59 - SLATE_900[2]) * alpha * 0.3)
    draw.line([(0, i), (WIDTH, i)], fill=(r, g, b))

# Load fonts
try:
    font_bold = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 80)
    font_large = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 48)
    font_medium = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 32)
except Exception:
    font_bold = ImageFont.load_default()
    font_large = font_bold
    font_medium = font_bold

# MS logo (gradient effect with shapes)
center_x = 600
logo_y = 280

# Draw gradient bar behind text
draw.rectangle([center_x - 100, logo_y - 50, center_x + 100, logo_y + 50],
               fill=TEAL_500, outline=TEAL_400, width=4)

# MS initials
draw.text((center_x, logo_y), "MS", font=font_bold, fill=WHITE, anchor="mm")

# Name
draw.text((600, 420), "MATTHEW SCOTT", font=font_bold, fill=WHITE, anchor="mm")

# Title
draw.text((600, 500), "Full Stack Developer", font=font_large, fill=TEAL_400, anchor="mm")

# Location
draw.text((600, 570), "Louisville, KY", font=font_medium, fill=SLATE_300, anchor="mm")

# Tagline
draw.text((600, 680), "Building practical tools", font=font_medium, fill=SLATE_300, anchor="mm")
draw.text((600, 730), "with modern technology", font=font_medium, fill=SLATE_300, anchor="mm")

# Skills section
skills = ["React", "Python", "TypeScript", "PostgreSQL"]
skill_y = 850
total_width = len(skills) * 150 - 30  # 150 per skill, minus last gap
start_x = (WIDTH - total_width) // 2

for i, skill in enumerate(skills):
    x = start_x + i * 150 + 60  # Center each skill
    # Skill box
    box_width = 120
    draw.rectangle([x - box_width//2, skill_y - 20, x + box_width//2, skill_y + 20],
                   fill=TEAL_500 if i % 2 == 0 else ORANGE_500)
    draw.text((x, skill_y), skill, font=font_medium, fill=WHITE, anchor="mm")

# Corner accents
draw.polygon([(0, 0), (80, 0), (0, 80)], fill=TEAL_500)
draw.polygon([(WIDTH, HEIGHT), (WIDTH - 80, HEIGHT), (WIDTH, HEIGHT - 80)], fill=ORANGE_500)

# Footer
draw.text((600, 1120), "projectlavos.com", font=font_medium, fill=(100, 116, 139), anchor="mm")

# Save
os.makedirs('public', exist_ok=True)
output_path = os.path.join(os.path.dirname(__file__), 'public', 'og-image.png')
img.save(output_path, 'PNG', quality=95)
print(f"Generated: {output_path}")
