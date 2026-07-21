import sys
from rembg import remove
from PIL import Image
import os

if len(sys.argv) != 3:
    print("Usage: python remove_bg.py <input_path> <output_path>")
    sys.exit(1)

input_path = sys.argv[1]
output_path = sys.argv[2]

# Ensure output directory exists
os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)

print(f"Processing {input_path}...")
input_image = Image.open(input_path)
output_image = remove(input_image)
output_image.save(output_path)
print(f"Saved to {output_path}")
