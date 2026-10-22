"""Make web-ready WebP versions of every photo referenced in utils/photography.ts.

For each /photography/<country>/<name>.<ext> it writes <name>-800.webp and <name>-1600.webp
next to the original: rotated upright and with ALL metadata (including GPS) stripped.
Only the WebP files are uploaded by scripts/sync-photography.js.

Run from app/: python3 -I scripts/optimize_photos.py   (needs Pillow)
"""
import re
import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
WIDTHS = (800, 1600)


def variant_path(original: Path, width: int) -> Path:
    return original.with_name(f"{original.stem}-{width}.webp")


def main() -> int:
    source = (ROOT / "utils/photography.ts").read_text()
    srcs = sorted(set(re.findall(r'"(/photography/[^"]+)"', source)))
    written = 0
    for src in srcs:
        original = ROOT / "public" / src.lstrip("/")
        if not original.exists():
            print(f"missing: {src}", file=sys.stderr)
            continue
        with Image.open(original) as img:
            upright = ImageOps.exif_transpose(img).convert("RGB")
            for width in WIDTHS:
                out = variant_path(original, width)
                if out.exists() and out.stat().st_mtime >= original.stat().st_mtime:
                    continue
                resized = upright.copy()
                resized.thumbnail((width, width * 2), Image.LANCZOS)
                # Saving without exif/icc/xmp drops every metadata block
                resized.save(out, "WEBP", quality=80, method=6)
                written += 1
    print(f"{len(srcs)} photos, {written} WebP files written")
    return 0


if __name__ == "__main__":
    sys.exit(main())
