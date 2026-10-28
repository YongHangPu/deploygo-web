#!/usr/bin/env python3
"""
生成官网社交分享封面 public/og-cover.png（1200x630）与 public/apple-touch-icon.png（180x180）。

这是一次性资源生成脚本，不参与应用构建：
    python scripts/generate-og-image.py
依赖 Pillow。品牌图形按 deploygo/public/favicon.svg 的几何比例重绘。
"""

from __future__ import annotations

import math
import os

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_DIR = os.path.join(ROOT, "public")

BG = (13, 17, 23)
PANEL = (17, 22, 31)
PANEL_2 = (13, 18, 25)
BORDER = (48, 54, 61)
TEXT = (230, 237, 243)
TEXT_2 = (182, 194, 207)
MUTED = (139, 148, 158)
BLUE = (88, 166, 255)
GREEN = (63, 185, 80)

FONT_CN_BOLD = r"C:\Windows\Fonts\msyhbd.ttc"
FONT_CN = r"C:\Windows\Fonts\msyh.ttc"
FONT_LATIN_BOLD = r"C:\Windows\Fonts\arialbd.ttf"
FONT_MONO = r"C:\Windows\Fonts\consolab.ttf"


def load(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def add_glow(img: Image.Image) -> None:
    """在底色上叠两团极淡的品牌色光晕（与站点的 CSS 背景一致）。"""
    import numpy as np

    width, height = img.size
    yy, xx = np.mgrid[0:height, 0:width]
    d1 = np.hypot(xx - width * 0.82, yy + height * 0.12)
    a1 = np.clip(1 - d1 / (width * 0.62), 0, None) ** 2
    d2 = np.hypot(xx - width * 0.05, yy - height * 1.02)
    a2 = np.clip(1 - d2 / (width * 0.5), 0, None) ** 2

    glow = np.zeros((height, width, 3), dtype=np.float64)
    glow[..., 0] = BLUE[0] * a1 * 0.18 + GREEN[0] * a2 * 0.10
    glow[..., 1] = BLUE[1] * a1 * 0.18 + GREEN[1] * a2 * 0.10
    glow[..., 2] = BLUE[2] * a1 * 0.18 + GREEN[2] * a2 * 0.10

    base = np.asarray(img.convert("RGB")).astype(np.float64)
    out = np.clip(base + glow, 0, 255).astype(np.uint8)
    img.paste(Image.fromarray(out))


def draw_grid(img: Image.Image) -> None:
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    step = 72
    for x in range(0, img.size[0], step):
        draw.line([(x, 0), (x, img.size[1])], fill=(48, 54, 61, 34), width=1)
    for y in range(0, img.size[1], step):
        draw.line([(0, y), (img.size[0], y)], fill=(48, 54, 61, 34), width=1)
    img.alpha_composite(layer)


def draw_brand_mark(img: Image.Image, origin: tuple[int, int], size: int) -> None:
    """按 favicon.svg 的比例重绘：深色圆角方块 + 蓝色 D + 绿色短横与圆点。"""
    scale = size / 1024
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    x0, y0 = origin
    draw.rounded_rectangle(
        [x0 + 32 * scale, y0 + 32 * scale, x0 + 992 * scale, y0 + 992 * scale],
        radius=220 * scale,
        fill=(13, 17, 23, 255),
        outline=(45, 54, 69, 255),
        width=max(1, int(6 * scale)),
    )

    stroke = max(2, int(104 * scale))
    stem_x = x0 + 286 * scale
    top_y = y0 + 250 * scale
    bottom_y = y0 + 774 * scale
    draw.line([(stem_x, top_y), (stem_x, bottom_y)], fill=BLUE, width=stroke)
    draw.line([(stem_x, top_y), (x0 + 470 * scale, top_y)], fill=BLUE, width=stroke)
    draw.line([(stem_x, bottom_y), (x0 + 470 * scale, bottom_y)], fill=BLUE, width=stroke)
    draw.arc(
        [x0 + 470 * scale, top_y, x0 + 772 * scale, bottom_y],
        start=-90,
        end=90,
        fill=BLUE,
        width=stroke,
    )
    dash_width = max(2, int(58 * scale))
    draw.line(
        [(x0 + 548 * scale, y0 + 512 * scale), (x0 + 732 * scale, y0 + 512 * scale)],
        fill=GREEN,
        width=dash_width,
    )
    radius = 30 * scale
    cx, cy = x0 + 748 * scale, y0 + 512 * scale
    draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=GREEN)
    img.alpha_composite(layer)


def draw_mock(img: Image.Image, box: tuple[int, int, int, int]) -> None:
    """右侧产品窗口示意：标题栏 + 发布进度 + 终端行 + 版本行。"""
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    x0, y0, x1, y1 = box
    draw.rounded_rectangle([x0, y0, x1, y1], radius=16, fill=PANEL + (240,), outline=BORDER + (255,), width=1)

    bar_h = 42
    draw.rounded_rectangle([x0, y0, x1, y0 + bar_h], radius=16, fill=(21, 27, 36, 255))
    draw.rectangle([x0, y0 + bar_h - 16, x1, y0 + bar_h], fill=(21, 27, 36, 255))
    draw.line([(x0, y0 + bar_h), (x1, y0 + bar_h)], fill=BORDER + (255,), width=1)
    for index, color in enumerate([(255, 95, 87), (254, 188, 46), (40, 200, 64)]):
        cx = x0 + 20 + index * 18
        draw.ellipse([cx - 5, y0 + 16, cx + 5, y0 + 26], fill=color + (255,))
    mono_small = load(FONT_MONO, 13)
    draw.text((x0 + 82, y0 + 13), "deploygo", font=mono_small, fill=MUTED)

    pad = 22
    cursor = y0 + bar_h + pad
    title = load(FONT_CN_BOLD, 19)
    cn_small = load(FONT_CN, 12)
    draw.text((x0 + pad, cursor - 2), "deploygo-web", font=title, fill=TEXT)
    draw.text((x0 + pad + 156, cursor + 3), "发布中", font=cn_small, fill=(154, 200, 255))
    cursor += 34

    # 进度条
    track = [x0 + pad, cursor, x1 - pad, cursor + 5]
    draw.rounded_rectangle(track, radius=3, fill=(27, 35, 46, 255))
    filled = [track[0], track[1], track[0] + int((track[2] - track[0]) * 0.58), track[3]]
    draw.rounded_rectangle(filled, radius=3, fill=BLUE)
    cursor += 20

    lines = [
        ("12:04:18", "静态资源同步完成", GREEN),
        ("12:04:19", "切换 live 指向新版本", BLUE),
        ("12:04:20", "写入 version.json", TEXT_2),
        ("12:04:20", "发布完成 9.4s", GREEN),
    ]
    timestamp_font = load(FONT_MONO, 11)
    line_font = load(FONT_CN, 12)
    for stamp, text, color in lines:
        draw.text((x0 + pad, cursor), stamp, font=timestamp_font, fill=(77, 88, 102))
        draw.text((x0 + pad + 72, cursor - 2), text, font=line_font, fill=color)
        cursor += 22

    cursor += 6
    draw.line([(x0 + pad, cursor), (x1 - pad, cursor)], fill=(34, 43, 54, 255), width=1)
    cursor += 12
    rows = [("v1.1.3", "当前", GREEN), ("v1.1.2", "回滚", MUTED), ("v1.1.1", "回滚", MUTED)]
    for tag, action, color in rows:
        draw.text((x0 + pad, cursor), tag, font=load(FONT_MONO, 12), fill=TEXT_2)
        draw.text((x0 + pad + 78, cursor), "42.6 MB", font=load(FONT_MONO, 10), fill=(77, 88, 102))
        draw.text((x1 - pad - 28, cursor - 2), action, font=cn_small, fill=color)
        cursor += 21

    img.alpha_composite(layer)


def build_cover() -> Image.Image:
    img = Image.new("RGBA", (1200, 630), BG + (255,))
    add_glow(img)
    draw_grid(img)

    draw_brand_mark(img, (72, 64), 92)

    latin_bold = load(FONT_LATIN_BOLD, 54)
    draw = ImageDraw.Draw(img)
    draw.text((186, 78), "deploygo", font=latin_bold, fill=TEXT)

    cn_bold = load(FONT_CN_BOLD, 46)
    line1 = "让前端发布"
    line2_a = "更稳"
    line2_b = "、更简单"
    x = 72
    y = 262
    draw.text((x, y), line1, font=cn_bold, fill=TEXT)
    x += cn_bold.getlength(line1)
    stress_x = x
    draw.text((x, y), line2_a, font=cn_bold, fill=GREEN)
    x += cn_bold.getlength(line2_a)
    draw.text((x, y), line2_b, font=cn_bold, fill=TEXT)
    # 「更稳」下方的强调线
    draw.rounded_rectangle(
        [stress_x + 2, y + 76, stress_x + cn_bold.getlength(line2_a) - 2, y + 82],
        radius=3,
        fill=GREEN,
    )

    cn = load(FONT_CN, 25)
    draw.text((72, y + 112), "一键部署、版本管理、重复发布拦截与快速回滚，", font=cn, fill=TEXT_2)
    draw.text((72, y + 150), "收进一个桌面端工具。", font=cn, fill=TEXT_2)

    cn_small = load(FONT_CN, 19)
    draw.text((72, 524), "零停机发布顺序：静态资源 → index.html → version.json", font=cn_small, fill=MUTED)
    draw.text((72, 558), "纯本地 · 无云端 · 凭证不离开你的电脑", font=cn_small, fill=(122, 178, 132))

    draw_mock(img, (742, 112, 1140, 468))

    return img.convert("RGB")


def build_icon() -> Image.Image:
    img = Image.new("RGBA", (180, 180), (13, 17, 23, 255))
    draw_brand_mark(img, (0, 0), 180)
    return img.convert("RGB")


def main() -> None:
    os.makedirs(PUBLIC_DIR, exist_ok=True)
    cover = build_cover()
    cover.save(os.path.join(PUBLIC_DIR, "og-cover.png"), "PNG", optimize=True)

    icon = build_icon()
    icon.save(os.path.join(PUBLIC_DIR, "apple-touch-icon.png"), "PNG", optimize=True)

    print("已生成 public/og-cover.png (1200x630) 与 public/apple-touch-icon.png (180x180)")


if __name__ == "__main__":
    main()
