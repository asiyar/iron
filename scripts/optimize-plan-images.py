from pathlib import Path

from PIL import Image

source = Path("/home/ubuntu/webdev-static-assets")
target = Path("/home/ubuntu/ironpulse/assets/images")

for name in ("athletic", "muscle", "fit", "strength"):
    image = Image.open(source / f"ironpulse-physique-{name}.png").convert("RGB")
    image.thumbnail((360, 480), Image.Resampling.LANCZOS)
    image.save(target / f"physique-{name}.jpg", "JPEG", quality=78, optimize=True, progressive=True)
