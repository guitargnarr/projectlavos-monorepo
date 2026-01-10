#!/usr/bin/env python3
"""Generate OG image for Prompt Orchestrator"""

from PIL import Image, ImageDraw, ImageFont
import os

# Image dimensions (1200x630 for OG standard)
WIDTH = 1200
HEIGHT = 630

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
    font_bold = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 64)
    font_large = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 36)
    font_medium = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 28)
except Exception:
    font_bold = ImageFont.load_default()
    font_large = font_bold
    font_medium = font_bold

# Title
draw.text((600, 200), "Prompt Orchestrator", font=font_bold, fill=WHITE, anchor="mm")

# Subtitle
draw.text((600, 280), "Visual AI Workflow Builder", font=font_large, fill=TEAL_400, anchor="mm")

# Description
draw.text((600, 360), "Build prompt workflows using 30 specialized AI personas", font=font_medium, fill=SLATE_300, anchor="mm")

# Feature boxes
features = ["Drag & Drop", "30 Personas", "Visual Builder"]
box_y = 450
total_width = len(features) * 200 - 40
start_x = (WIDTH - total_width) // 2

for i, feature in enumerate(features):
    x = start_x + i * 200 + 80
    box_width = 160
    draw.rectangle([x - box_width//2, box_y - 25, x + box_width//2, box_y + 25],
                   fill=TEAL_500 if i % 2 == 0 else ORANGE_500)
    draw.text((x, box_y), feature, font=font_medium, fill=WHITE, anchor="mm")

# Corner accents
draw.polygon([(0, 0), (60, 0), (0, 60)], fill=TEAL_500)
draw.polygon([(WIDTH, HEIGHT), (WIDTH - 60, HEIGHT), (WIDTH, HEIGHT - 60)], fill=ORANGE_500)

# Footer
draw.text((600, 580), "orchestrator.projectlavos.com", font=font_medium, fill=(100, 116, 139), anchor="mm")

# Save
os.makedirs('public', exist_ok=True)
output_path = os.path.join(os.path.dirname(__file__), 'public', 'og-image.png')
img.save(output_path, 'PNG', quality=95)
print(f"Generated: {output_path}")
