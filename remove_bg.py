from rembg import remove
from PIL import Image

input_path = r"e:\dwd_portfolio\src\assets\projects\city-hospital-building\magnific__upload__46338.png"
output_path = r"e:\dwd_portfolio\public\assets\projects\city-hospital-building\hospital_transparent.png"

input_image = Image.open(input_path)
output_image = remove(input_image)
output_image.save(output_path)
