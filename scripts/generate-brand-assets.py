#!/usr/bin/env python3
"""IronPulse marka görsellerini üretir (ikon, splash, adaptive icon, plan kartları).

Kullanım:  python3 scripts/generate-brand-assets.py
Çıktı:     assets/images/
"""
from pathlib import Path
import math
from PIL import Image, ImageDraw, ImageFilter

OUT = Path(__file__).resolve().parent.parent / "assets" / "images"
OUT.mkdir(parents=True, exist_ok=True)

BG = (11, 14, 18, 255)      # #0B0E12
LIME = (184, 255, 61, 255)  # #B8FF3D
DIM = (38, 49, 65, 255)     # #263141


def bolt(size):
    """Ölçeklenebilir şimşek poligonu (0-1 normalize koordinatlar)."""
    pts = [(0.56, 0.06), (0.26, 0.55), (0.46, 0.55), (0.40, 0.94),
           (0.74, 0.43), (0.53, 0.43), (0.62, 0.06)]
    return [(x * size, y * size) for x, y in pts]


def pulse_points(size, y, amp):
    """EKG benzeri nabız çizgisi."""
    return [
        (0.08 * size, y), (0.30 * size, y), (0.36 * size, y - amp),
        (0.44 * size, y + amp * 1.15), (0.52 * size, y - amp * 0.55),
        (0.60 * size, y), (0.92 * size, y),
    ]


def make_icon(size, background=True, mono=False, glow=True, scale=0.78):
    """scale: markanın tuval içinde kapladığı oran.
    Adaptive icon güvenli alanı merkezin ~%66'sı olduğu için ön plan katmanı daha küçük kullanılır."""
    img = Image.new("RGBA", (size, size), BG if background else (0, 0, 0, 0))
    fg = (255, 255, 255, 255) if mono else LIME
    inner = int(size * scale)
    offset = (size - inner) // 2

    if glow and not mono:
        halo = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        ImageDraw.Draw(halo).ellipse(
            [size * 0.14, size * 0.14, size * 0.86, size * 0.86],
            fill=(LIME[0], LIME[1], LIME[2], 46),
        )
        img = Image.alpha_composite(img, halo.filter(ImageFilter.GaussianBlur(size * 0.07)))

    mark = Image.new("RGBA", (inner, inner), (0, 0, 0, 0))
    draw = ImageDraw.Draw(mark)
    if not mono:
        draw.line(pulse_points(inner, inner * 0.72, inner * 0.13),
                  fill=(fg[0], fg[1], fg[2], 120), width=max(2, int(inner * 0.028)), joint="curve")
    draw.polygon(bolt(inner), fill=fg)

    layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    layer.paste(mark, (offset, offset), mark)
    return Image.alpha_composite(img, layer)


def physique(name, hue, label_bars):
    """Plan üretici hedef kartı için soyut, kişi içermeyen görsel."""
    w, h = 600, 800
    img = Image.new("RGB", (w, h), (11, 14, 18))
    draw = ImageDraw.Draw(img)

    for y in range(h):  # dikey degrade
        t = y / h
        draw.line([(0, y), (w, y)], fill=(
            int(11 + hue[0] * t * 0.55),
            int(14 + hue[1] * t * 0.55),
            int(18 + hue[2] * t * 0.55),
        ))

    # Soyut gövde silueti
    cx = w / 2
    draw.ellipse([cx - 46, 96, cx + 46, 188], fill=(28, 36, 48))
    draw.rounded_rectangle([cx - 118, 200, cx + 118, 470], radius=64, fill=(28, 36, 48))
    draw.rounded_rectangle([cx - 150, 226, cx - 96, 430], radius=28, fill=(24, 31, 42))
    draw.rounded_rectangle([cx + 96, 226, cx + 150, 430], radius=28, fill=(24, 31, 42))
    draw.rounded_rectangle([cx - 104, 460, cx - 14, 720], radius=40, fill=(26, 34, 45))
    draw.rounded_rectangle([cx + 14, 460, cx + 104, 720], radius=40, fill=(26, 34, 45))

    # Odak çubukları — hedefe göre farklı vurgu
    for index, ratio in enumerate(label_bars):
        top = 610 + index * 40
        draw.rounded_rectangle([48, top, 48 + int(220 * ratio), top + 14], radius=7, fill=LIME[:3])
        draw.rounded_rectangle([48 + int(220 * ratio), top, 268, top + 14], radius=7, fill=DIM[:3])

    img.filter(ImageFilter.SMOOTH).save(OUT / name, "JPEG", quality=86, optimize=True)
    return name


def main():
    made = []

    icon = make_icon(1024)
    icon.save(OUT / "icon.png"); made.append("icon.png")

    icon.resize((48, 48), Image.LANCZOS).save(OUT / "favicon.png"); made.append("favicon.png")

    make_icon(400, background=False, scale=0.86).save(OUT / "splash-icon.png"); made.append("splash-icon.png")

    make_icon(432, background=False, scale=0.58).save(OUT / "android-icon-foreground.png")
    made.append("android-icon-foreground.png")

    bg = Image.new("RGBA", (432, 432), BG)
    bg.save(OUT / "android-icon-background.png"); made.append("android-icon-background.png")

    make_icon(432, background=False, mono=True, glow=False, scale=0.58).save(OUT / "android-icon-monochrome.png")
    made.append("android-icon-monochrome.png")

    made.append(physique("physique-strength.jpg", (46, 24, 10), [0.95, 0.55, 0.40]))
    made.append(physique("physique-muscle.jpg",   (30, 40, 14), [0.60, 0.95, 0.45]))
    made.append(physique("physique-fit.jpg",      (14, 34, 44), [0.55, 0.60, 0.90]))
    made.append(physique("physique-athletic.jpg", (34, 16, 40), [0.75, 0.70, 0.85]))

    print("\n".join(f"  {name}" for name in made))
    print(f"{len(made)} görsel üretildi -> {OUT}")


if __name__ == "__main__":
    main()
