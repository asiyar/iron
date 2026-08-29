from pathlib import Path

from PIL import Image


PROJECT = Path("/home/ubuntu/ironpulse")
SOURCE = Path("/home/ubuntu/webdev-static-assets/ironpulse-icon.png")
TARGETS = [
    PROJECT / "assets/images/icon.png",
    PROJECT / "assets/images/splash-icon.png",
    PROJECT / "assets/images/favicon.png",
    PROJECT / "assets/images/android-icon-foreground.png",
]


def optimize_icon() -> None:
    with Image.open(SOURCE) as original:
        image = original.convert("RGB")
        image.thumbnail((1024, 1024), Image.Resampling.LANCZOS)
        for target in TARGETS:
            image.save(target, format="PNG", optimize=True, compress_level=9)
            size_kb = target.stat().st_size / 1024
            print(f"{target.name}: {image.width}x{image.height}, {size_kb:.1f} KB")


if __name__ == "__main__":
    optimize_icon()
