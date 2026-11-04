"""Optional production build of the web client: minify, hash file names, copy fonts and vendor files.

Usage:  python scripts/build_web.py        # writes backend/web/dist/ (needs Node.js for `npx esbuild`)
        SAHTI_WEB_DIST=1 uvicorn app.main:app --app-dir backend

The un-built client in backend/web/ stays the default and keeps working without Node. The server only serves
dist/ when SAHTI_WEB_DIST=1, and falls back to the source (with a warning) if dist/ is older than the source.
The source is not reorganised for the bundler: app.js is a classic script and is only minified, not bundled.
"""
from __future__ import annotations

import hashlib
import json
import shutil
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "backend" / "web"
DIST = WEB / "dist"
ESBUILD = ["npx", "--yes", "esbuild@0.25.10"]


def minify(src: Path, out: Path) -> None:
    subprocess.run([*ESBUILD, str(src), "--minify", "--charset=utf8", "--log-level=warning", f"--outfile={out}"], check=True)


def hashed(path: Path) -> Path:
    digest = hashlib.sha256(path.read_bytes()).hexdigest()[:8]
    target = path.with_name(f"{path.stem}.{digest}{path.suffix}")
    path.rename(target)
    return target


def main() -> int:
    subprocess.run([sys.executable, str(ROOT / "scripts" / "critical_css.py"), "--check"], check=True)
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir()
    shutil.copytree(WEB / "fonts", DIST / "fonts")
    shutil.copytree(WEB / "vendor", DIST / "vendor")   # vendor files are already minified and versioned
    minify(WEB / "app.js", DIST / "app.js")
    minify(WEB / "styles.css", DIST / "styles.css")
    app, css = hashed(DIST / "app.js"), hashed(DIST / "styles.css")
    html = (WEB / "index.html").read_text(encoding="utf-8")
    html = html.replace("/static/app.js", f"/static/{app.name}").replace("/static/styles.css", f"/static/{css.name}")
    (DIST / "index.html").write_text(html, encoding="utf-8")
    sizes = {p.name: p.stat().st_size for p in (app, css, DIST / "index.html")}
    (DIST / "build.json").write_text(json.dumps({"builtAt": time.time(), "files": sizes}, indent=2), encoding="utf-8")
    print(json.dumps(sizes, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
