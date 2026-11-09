#!/usr/bin/env python3
"""为 M1kAovo 相册建立清晰的 WebP 缩略图与预览图，不修改任何原始照片。

首次使用（Mac / VS Code 项目终端）：
    python3 -m venv .venv
    .venv/bin/python -m pip install Pillow
    .venv/bin/python tools/build_gallery_images.py

以后新增照片时，只需要：
    .venv/bin/python tools/build_gallery_images.py
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
ORIGINALS = ROOT / "assets" / "gallery"
OUTPUT_ROOT = ORIGINALS / "_optimized"
IMAGE_TYPES = {".jpg", ".jpeg", ".png", ".webp"}
VARIANTS = {
    "thumbs": (1280, 86),    # Retina 屏幕也足够清晰的相册列表图
    "previews": (3200, 90),  # 点开后的高质量预览，原图仍保留供下载
}


def make_variant(original: Path, target: Path, max_side: int, quality: int):
    if target.exists() and target.stat().st_mtime >= original.stat().st_mtime:
        return False
    target.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(original) as src:
        if getattr(src, "is_animated", False):
            print("跳过动画:", original)
            return False
        icc = src.info.get("icc_profile")
        image = ImageOps.exif_transpose(src)
        has_alpha = "A" in image.getbands() or "transparency" in image.info
        image = image.convert("RGBA" if has_alpha else "RGB")
        image.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)
        params = {"format": "WEBP", "quality": quality, "method": 6}
        if icc:
            params["icc_profile"] = icc
        image.save(target, **params)
    return True


def main():
    originals = [
        f for f in sorted(ORIGINALS.rglob("*"))
        if f.is_file()
        and f.suffix.lower() in IMAGE_TYPES
        and OUTPUT_ROOT not in f.parents
    ]
    created = 0
    for original in originals:
        name = original.relative_to(ORIGINALS).with_suffix(".webp")
        for variant, (max_side, quality) in VARIANTS.items():
            target = OUTPUT_ROOT / variant / name
            if make_variant(original, target, max_side, quality):
                created += 1
    print(f"检查 {len(originals)} 张原图，生成或更新 {created} 个 WebP 文件。")
    print("所有原始 JPG、PNG、WebP 保持不变；只需将 _optimized/ 随网站一起 git push。")


if __name__ == "__main__":
    main()
