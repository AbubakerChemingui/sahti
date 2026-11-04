"""Inline the first-viewport ("critical") CSS into backend/web/index.html.

Usage:  python scripts/critical_css.py          # rewrite the <style id="critical"> block
        python scripts/critical_css.py --check  # exit 1 if index.html is out of date (used by the tests)

The critical set is every rule of styles.css whose selector touches the shell (top bar, draft banner) or the
landing hero, plus the @font-face rules of the fonts used above the fold. The full stylesheet still loads
afterwards (non-blocking), so nothing is lost if a rule is missing here; it only paints a little later.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

WEB = Path(__file__).resolve().parents[1] / "backend" / "web"
CRITICAL = re.compile(
    r"^(:root|\*|html|body|:focus-visible|\.mono|\[dir=rtl\] \.mono|\.num|\[hidden\]|svg\.i|\.skip|h1|"
    r"\.topbar|\.brand|#nav|\.nav-lang|\.draft-banner|main|\.wrap|\.chapter|\.hero2|\.btn|\.stage|\.box3d|\.box-|"
    r"\.shadow3d|\.stamp|\.scroll-cue|html:not\(\.intro-done\)|body\.is-landing|\[dir=rtl\] h1|\[dir=rtl\] \.hero2|html\[lang=fr\]|\.authed)"
)
FONTS = ("archivo-display-var", "sahti-arabic-mark", "ibm-plex-sans-arabic-latin-400", "ibm-plex-sans-arabic-latin-600",
         "ibm-plex-sans-arabic-latin-700", "ibm-plex-mono-latin-500")


def blocks(css: str):
    """Yield top-level (prelude, body) pairs; @media bodies are returned raw."""
    i, n = 0, len(css)
    while i < n:
        j = css.find("{", i)
        if j < 0:
            return
        prelude = css[i:j].strip()
        depth, k = 1, j + 1
        while depth and k < n:
            depth += {"{": 1, "}": -1}.get(css[k], 0)
            k += 1
        yield prelude, css[j + 1:k - 1]
        i = k


def strip_comments(css: str) -> str:
    return re.sub(r"/\*.*?\*/", "", css, flags=re.S)


def keep_rule(prelude: str) -> bool:
    return any(CRITICAL.match(sel.strip()) for sel in prelude.split(","))


def critical(css: str) -> str:
    out = []
    for prelude, body in blocks(strip_comments(css)):
        if prelude.startswith("@font-face"):
            if any(f in body for f in FONTS):
                out.append(f"{prelude}{{{body.strip()}}}")
        elif prelude.startswith("@keyframes"):
            if any(name in prelude for name in ("hero-rise", "hero-nudge", "box-in", "stamp-in", "cue")):
                out.append(f"{prelude}{{{body.strip()}}}")
        elif prelude.startswith("@media"):
            inner = [f"{p}{{{b.strip()}}}" for p, b in blocks(body) if keep_rule(p)]
            if inner:
                out.append(f"{prelude}{{{''.join(inner)}}}")
        elif not prelude.startswith("@") and keep_rule(prelude):
            out.append(f"{prelude}{{{' '.join(body.split())}}}")
    text = "\n".join(out)
    return text.replace('url("fonts/', 'url("/static/fonts/')


def main() -> int:
    css = (WEB / "styles.css").read_text(encoding="utf-8")
    html_path = WEB / "index.html"
    html = html_path.read_text(encoding="utf-8")
    block = f'<style id="critical">\n{critical(css)}\n</style>'
    new = re.sub(r'<style id="critical">.*?</style>', lambda _: block, html, flags=re.S)
    if "--check" in sys.argv:
        if new != html:
            print("index.html critical CSS is out of date: run python scripts/critical_css.py")
            return 1
        return 0
    html_path.write_text(new, encoding="utf-8")
    print(f"critical CSS: {len(block)} bytes")
    return 0


if __name__ == "__main__":
    sys.exit(main())
