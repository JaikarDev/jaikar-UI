import re
from pathlib import Path

path = Path(__file__).resolve().parents[1] / "index.html"
content = path.read_text(encoding="utf-8")
before = len(content.encode("utf-8"))

content = re.sub(
    r'<img src="data:image/jpeg;base64,[^"]+"([^>]*)>',
    r'<img src="Assets/Dark Arrival/Screenshot_2026-03-31_195708.png" loading="lazy" alt="In-engine UI output preview"\1>',
    content,
    count=1,
)
content = re.sub(
    r'<source src="data:video/mp4;base64,[^"]+"',
    r'<source src="Assets/Videos/DARK ARRIVAL MAIN MENU VIDEO 1.mp4"',
    content,
    count=1,
)

path.write_text(content, encoding="utf-8")
after = len(content.encode("utf-8"))
print(f"Stripped base64: {before/1024/1024:.2f} MB -> {after/1024/1024:.2f} MB")
