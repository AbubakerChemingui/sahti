"""Static web client checks: the inlined critical CSS is in sync, and the optional build is opt-in."""
import re
import subprocess
import sys
from pathlib import Path

from app import main

ROOT = Path(__file__).resolve().parents[2]


def test_critical_css_is_in_sync_with_styles():
    result = subprocess.run([sys.executable, str(ROOT / "scripts" / "critical_css.py"), "--check"], capture_output=True, text=True)
    assert result.returncode == 0, result.stdout


def test_source_client_is_served_by_default(monkeypatch):
    monkeypatch.delenv("SAHTI_WEB_DIST", raising=False)
    assert main._web_dir() == main.WEB_SRC


def test_missing_build_falls_back_to_source(monkeypatch, tmp_path):
    monkeypatch.setenv("SAHTI_WEB_DIST", "1")
    monkeypatch.setattr(main, "WEB_SRC", tmp_path)
    assert main._web_dir() == tmp_path


def test_hero_is_in_the_html_without_javascript():
    html = (main.WEB_SRC / "index.html").read_text(encoding="utf-8")
    assert 'class="chapter hero2" data-ssr' in html and "<h1 id=\"hero-title\">" in html
    critical = html.split('<style id="critical">')[1].split("</style>")[0]
    # No rule that styles the hero text (the LCP candidates) may hide it before scripts run.
    for rule in re.findall(r"([^{}]+)\{([^{}]*)\}", critical):
        selector, body = rule
        if re.search(r"hero2|\.lede|\.ln|h1", selector):
            assert not re.search(r"opacity:\s*0(?![.\d])|visibility:\s*hidden", body) or "data-ssr" in selector, selector
