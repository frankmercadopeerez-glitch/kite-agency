"""Derive browser/install icons from the existing brand mark (requires Pillow)."""
from pathlib import Path
import base64
from PIL import Image

root = Path(__file__).resolve().parent.parent
logo = Image.open(root / "images/kite-cartagena-profile.png").convert("RGBA")
for size, name in [(48, "favicon-48.png"), (180, "apple-touch-icon.png"), (192, "icon-192.png"), (512, "icon-512.png")]:
    logo.resize((size, size), Image.Resampling.LANCZOS).save(root / "icons" / name)
logo.save(root / "favicon.ico", sizes=[(16,16),(32,32),(48,48),(64,64),(128,128),(256,256)])
encoded = base64.b64encode((root / "icons/icon-192.png").read_bytes()).decode("ascii")
(root / "favicon.svg").write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><image width="192" height="192" href="data:image/png;base64,' + encoded + '"/></svg>\n', encoding="utf-8")
print("Generated all icons from images/kite-cartagena-profile.png")
