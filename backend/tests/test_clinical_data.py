"""Clinical data bundle validation (SRS FR-39, §8.7)."""
import shutil

import pytest

from app import clinical
from app.clinical import BundleError, load_bundle


def test_demo_bundle_loads_and_is_marked_draft():
    snap = load_bundle("demo_v1")
    assert snap.review_status == "DRAFT"
    assert set(snap.illnesses) == {"COLD", "SORE_THROAT", "TENSION_HEADACHE", "DIARRHOEA", "HEARTBURN"}


def _copy_bundle(tmp_path, monkeypatch):
    shutil.copytree(clinical.BUNDLE_DIR / "demo_v1", tmp_path / "broken")
    monkeypatch.setattr(clinical, "BUNDLE_DIR", tmp_path)
    return tmp_path / "broken"


def _append(path, line):
    with path.open("a", encoding="utf-8") as handle:
        handle.write(line + "\n")


def test_overlapping_dose_bands_are_refused(tmp_path, monkeypatch):
    folder = _copy_bundle(tmp_path, monkeypatch)
    _append(folder / "dose_rules.csv",
            "MED_PARA_500,216,1440,60,80,3,TABLET,3,MORNING|MIDDAY|EVENING,AFTER_MEAL,6,3,test")
    with pytest.raises(BundleError, match="overlapping"):
        load_bundle("broken")


def test_non_otc_medicine_cannot_be_linked(tmp_path, monkeypatch):
    folder = _copy_bundle(tmp_path, monkeypatch)
    text = (folder / "medicines.csv").read_text(encoding="utf-8")
    (folder / "medicines.csv").write_text(text.replace(",true,", ",false,", 1), encoding="utf-8")
    with pytest.raises(BundleError, match="OTC"):
        load_bundle("broken")


def test_missing_arabic_text_is_refused(tmp_path, monkeypatch):
    folder = _copy_bundle(tmp_path, monkeypatch)
    _append(folder / "natural_remedies.csv", "REM_X,Repos,,Reposez-vous.,استرح.,test")
    with pytest.raises(BundleError, match="French and Arabic"):
        load_bundle("broken")


def test_validated_bundle_needs_a_reviewer(tmp_path, monkeypatch):
    folder = _copy_bundle(tmp_path, monkeypatch)
    text = (folder / "manifest.csv").read_text(encoding="utf-8")
    (folder / "manifest.csv").write_text(text.replace("DRAFT", "VALIDATED"), encoding="utf-8")
    with pytest.raises(BundleError, match="reviewer"):
        load_bundle("broken")
