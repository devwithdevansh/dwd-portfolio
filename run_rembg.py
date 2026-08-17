import sys
from PIL import Image
import rembg

def main():
    images = [
        (r"C:\Users\Lenovo\.gemini\antigravity-ide\brain\9b01f746-a65d-4600-9c61-62a41f9a6e78\yellow_pencil_transparent_1786981715154.jpg", r"d:\projects\portfolio\dwd-portfolio\public\assets\workbench\pencil.png"),
        (r"C:\Users\Lenovo\.gemini\antigravity-ide\brain\9b01f746-a65d-4600-9c61-62a41f9a6e78\metal_ruler_1786982351340.jpg", r"d:\projects\portfolio\dwd-portfolio\public\assets\workbench\ruler.png"),
        (r"C:\Users\Lenovo\.gemini\antigravity-ide\brain\9b01f746-a65d-4600-9c61-62a41f9a6e78\desktop_ui_1786982380312.jpg", r"d:\projects\portfolio\dwd-portfolio\public\assets\workbench\desktop_ui.png"),
        (r"C:\Users\Lenovo\.gemini\antigravity-ide\brain\9b01f746-a65d-4600-9c61-62a41f9a6e78\mobile_ui_1786982459045.jpg", r"d:\projects\portfolio\dwd-portfolio\public\assets\workbench\mobile_ui.png")
    ]
    
    for in_path, out_path in images:
        try:
            print(f"Processing {in_path} -> {out_path}")
            input_image = Image.open(in_path)
            output_image = rembg.remove(input_image)
            output_image.save(out_path)
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    main()
