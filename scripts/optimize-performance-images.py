from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]


def save_webp(source: Path, target: Path, width: int, quality: int = 78) -> None:
    with Image.open(source) as image:
        image.load()
        if image.width <= width:
            resized = image.copy()
        else:
            height = max(1, round(image.height * width / image.width))
            resized = image.resize((width, height), Image.Resampling.LANCZOS)
        target.parent.mkdir(parents=True, exist_ok=True)
        resized.save(target, "WEBP", quality=quality, method=6)


for folder in ("blog", "headers", "social"):
    for source in (ROOT / "images" / folder).glob("*.webp"):
        if source.stem.endswith(("-480", "-768")):
            continue
        save_webp(source, source.with_name(f"{source.stem}-480.webp"), 480)
        save_webp(source, source.with_name(f"{source.stem}-768.webp"), 768)

save_webp(
    ROOT / "images" / "kite-cartagena-profile.png",
    ROOT / "images" / "kite-cartagena-profile-96.webp",
    96,
    82,
)
save_webp(
    ROOT / "images" / "whatsapp-logo.png",
    ROOT / "images" / "whatsapp-logo-116.webp",
    116,
    82,
)

print("Generated responsive card, brand and WhatsApp images.")
