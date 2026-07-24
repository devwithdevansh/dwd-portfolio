import sys
import os
import glob
from PIL import Image
import rembg

def run_batch():
    directory = r"E:\dwd_portfolio\src\assets\projects\try"
    
    # Get all PNGs except those already ending with _nobg
    files = glob.glob(os.path.join(directory, "*.png"))
    files = [f for f in files if "_nobg" not in f]

    print(f"Found {len(files)} images to process.")

    for idx, filepath in enumerate(files):
        # We will save them as layer_1_nobg.png, layer_2_nobg.png, etc. just to make them easy to use
        # Or keep original name, let's keep original name
        filename = os.path.basename(filepath)
        name, ext = os.path.splitext(filename)
        output_path = os.path.join(directory, f"{name}_nobg.png")
        
        print(f"Processing [{idx+1}/{len(files)}]: {filename}...")
        try:
            input_image = Image.open(filepath)
            output_image = rembg.remove(input_image)
            output_image.save(output_path)
            print(f"  -> Saved to {os.path.basename(output_path)}")
        except Exception as e:
            print(f"  -> Error: {e}")

if __name__ == "__main__":
    run_batch()
