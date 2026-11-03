"""End-to-end API tests: sign-up → profile → consultation → result → history (SRS §9)."""
import uuid

import pytest
from fastapi.testclient import TestClient

from app.config import Settings
from app.main import create_app


@pytest.fixture()
def client(tmp_path):
    settings = Settings(database_url=f"sqlite:///{tmp_path}/test.db", public_deployment=False,
                        encryption_secret="test-only-key", clinical_bundle="demo_v1")
    return TestClient(create_app(settings))


def register(client, language="fr", consent=True):
    body = {"email": f"{uuid.uuid4().hex[:8]}@example.tn", "password": "correct-horse-1", "language": language,
            "isAdultConfirmed": True, "consent": {"granted": consent, "textVersion": "c-1"}, "disclaimerVersion": "d-1"}
    response = client.post("/api/v1/auth/register", json=body)
    assert response.status_code == 201, response.text
    return {"Authorization": "Bearer " + response.json()["accessToken"]}, body


ADULT = {"relation": "SELF", "fullName": "Amel Trabelsi", "dateOfBirth": "1990-04-02", "sex": "F", "weightKg": 62,
         "smokingStatus": "NEVER", "alcoholUse": "NONE", "pregnancyStatus": "NO", "breastfeedingStatus": "NO",
         "allergies": [], "allergiesNone": True, "conditions": [], "conditionsNone": True,
         "medications": [], "medicationsNone": True}


def new_profile(client, headers, **changes):
    response = client.post("/api/v1/profiles", json={**ADULT, **changes}, headers=headers)
    assert response.status_code == 201, response.text
    return response.json()["profileId"]


def test_register_validation_and_login(client):
    bad = client.post("/api/v1/auth/register", json={"email": "x@y.tn", "password": "short-but-ok", "language": "fr",
                                                     "isAdultConfirmed": False, "disclaimerVersion": "d-1"})
    assert bad.status_code == 403 and bad.json()["error"]["code"] == "E-AUTH-005"
    assert set(bad.json()["error"]) >= {"code", "message", "traceId"}
    _, body = register(client)
    again = client.post("/api/v1/auth/register", json=body)
    assert again.json()["error"]["code"] == "E-AUTH-004"
    wrong = client.post("/api/v1/auth/login", json={"email": body["email"], "password": "nope-nope"})
    unknown = client.post("/api/v1/auth/login", json={"email": "who@example.tn", "password": "nope-nope"})
    assert wrong.status_code == unknown.status_code == 401
    assert wrong.json()["error"]["message"] == unknown.json()["error"]["message"]
    ok = client.post("/api/v1/auth/login", json={"email": body["email"], "password": body["password"]})
    assert ok.status_code == 200 and ok.json()["accessToken"]


def test_requests_without_a_token_are_refused(client):
    response = client.get("/api/v1/profiles")
    assert response.status_code == 401 and response.json()["error"]["code"] == "E-AUTH-001"


def test_profile_needs_consent(client):
    headers, _ = register(client, consent=False)
    response = client.post("/api/v1/profiles", json=ADULT, headers=headers)
    assert response.json()["error"]["code"] == "E-CONS-001"


def test_profile_validation(client):
    headers, _ = register(client)
    missing_pregnancy = {**ADULT}
    del missing_pregnancy["pregnancyStatus"]
    assert client.post("/api/v1/profiles", json=missing_pregnancy, headers=headers).status_code == 400
    child_as_self = client.post("/api/v1/profiles", json={**ADULT, "dateOfBirth": "2015-01-01"}, headers=headers)
    assert child_as_self.json()["error"]["code"] == "E-VAL-002"
    bad_term = client.post("/api/v1/profiles", json={**ADULT, "allergiesNone": False,
                                                     "allergies": [{"termCode": "NOPE"}]}, headers=headers)
    assert bad_term.status_code == 400
    new_profile(client, headers)
    second_self = client.post("/api/v1/profiles", json=ADULT, headers=headers)
    assert second_self.status_code == 400


def test_profiles_are_private_to_their_owner(client):
    headers, _ = register(client)
    profile_id = new_profile(client, headers)
    other, _ = register(client)
    assert client.get(f"/api/v1/profiles/{profile_id}", headers=other).status_code == 404
    assert client.post("/api/v1/consultations", json={"profileId": profile_id}, headers=other).status_code == 404


def test_health_data_is_encrypted_at_rest(client):
    headers, _ = register(client)
    new_profile(client, headers)
    row = client.app.state.api.db.one("SELECT data_enc FROM profiles")
    assert "Amel" not in row["data_enc"]


def answer_all(client, headers, cid, step, yes, duration=2):
    while step["type"] == "QUESTION":
        q = step["question"]["code"]
        value = duration if q == "Q_DURATION_DAYS" else ("YES" if q in yes else "NO")
        response = client.post(f"/api/v1/consultations/{cid}/answers", json={"questionCode": q, "value": value},
                               headers=headers)
        assert response.status_code == 200, response.text
        step = response.json()["step"]
    return step


def test_full_consultation_with_own_words_and_history(client):
    headers, _ = register(client)
    profile_id = new_profile(client, headers)
    start = client.post("/api/v1/consultations", json={"profileId": profile_id, "pregnancyReconfirmed": "NO"},
                        headers=headers)
    assert start.status_code == 201
    cid = start.json()["consultationId"]
    assert start.json()["dataStatus"] == "DRAFT"

    described = client.post(f"/api/v1/consultations/{cid}/description",
                            json={"text": "J'ai le nez qui coule, j'éternue et je tousse depuis 2 jours"}, headers=headers)
    assert described.json()["pendingStep"] == "CONVERTED_CONFIRMATION"
    blocked = client.post(f"/api/v1/consultations/{cid}/answers",
                          json={"questionCode": "Q_BREATHING_DIFFICULTY", "value": "NO"}, headers=headers)
    assert blocked.status_code == 409 and blocked.json()["error"]["code"] == "E-CONS-006"
    items = [{"questionCode": i["questionCode"], "confirmed": True} for i in described.json()["converted"]]
    step = client.post(f"/api/v1/consultations/{cid}/description/confirmations", json={"items": items},
                       headers=headers).json()["step"]
    step = answer_all(client, headers, cid, step, {"Q_RUNNY_NOSE", "Q_SNEEZING", "Q_COUGH", "Q_SORE_THROAT"})
    assert step["type"] == "RESULT"

    result = client.get(f"/api/v1/consultations/{cid}/result", headers=headers).json()
    assert result["resultType"] == "ILLNESS" and result["illness"]["code"] == "COLD"
    assert result["dataStatus"] == "DRAFT" and result["disclaimer"]
    assert result["remedies"] and result["medicines"]

    history = client.get(f"/api/v1/profiles/{profile_id}/consultations", headers=headers).json()
    assert history["total"] == 1 and history["items"][0]["resultType"] == "ILLNESS"
    finished = client.post(f"/api/v1/consultations/{cid}/answers",
                           json={"questionCode": "Q_FEVER", "value": "NO"}, headers=headers)
    assert finished.json()["error"]["code"] == "E-CONS-005"


def test_emergency_notice_is_carried_by_every_step_and_the_result(client):
    headers, _ = register(client, language="ar")
    profile_id = new_profile(client, headers)
    cid = client.post("/api/v1/consultations", json={"profileId": profile_id}, headers=headers).json()["consultationId"]
    step = client.post(f"/api/v1/consultations/{cid}/answers",
                       json={"questionCode": "Q_BREATHING_DIFFICULTY", "value": "YES"}, headers=headers).json()["step"]
    assert step["type"] == "QUESTION" and step["dangerNotice"]["emergencyNumbers"] == [190, 198]
    step = client.post(f"/api/v1/consultations/{cid}/answers/undo", headers=headers).json()["step"]
    assert step["dangerNotice"]["level"] == "EMERGENCY"
    step = answer_all(client, headers, cid, step, {"Q_HEADACHE", "Q_HEAD_BAND"})
    result = client.get(f"/api/v1/consultations/{cid}/result", headers=headers).json()
    assert result["dangerNotice"]["level"] == "EMERGENCY"
    assert "190" in result["dangerNotice"]["message"]


def test_baby_profile_is_referred_and_acknowledged(client):
    headers, _ = register(client)
    new_profile(client, headers)
    baby = new_profile(client, headers, relation="CHILD", fullName="Baby Test", dateOfBirth="2026-01-01",
                       sex="M", weightKg=8.5, pregnancyStatus=None, breastfeedingStatus=None)
    start = client.post("/api/v1/consultations", json={"profileId": baby}, headers=headers).json()
    assert start["status"] == "AWAITING_ACK" and start["step"]["type"] == "RESULT"
    result = client.get(f"/api/v1/consultations/{start['consultationId']}/result", headers=headers).json()
    assert result["resultType"] == "REFERRAL_AGE" and result["medicines"] == []
    ack = client.post(f"/api/v1/consultations/{start['consultationId']}/acknowledgement", headers=headers)
    assert ack.json()["status"] == "COMPLETED"


def test_expired_consultation_is_reported_once(client):
    headers, _ = register(client)
    profile_id = new_profile(client, headers)
    cid = client.post("/api/v1/consultations", json={"profileId": profile_id}, headers=headers).json()["consultationId"]
    client.app.state.api.db.execute("UPDATE consultations SET started_at = '2020-01-01T00:00:00+00:00' WHERE id = ?",
                                    (cid,))
    first = client.get("/api/v1/profiles", headers=headers).json()["items"][0]
    assert [e["consultationId"] for e in first["expiredConsultations"]] == [cid]
    second = client.get("/api/v1/profiles", headers=headers).json()["items"][0]
    assert second["expiredConsultations"] == []


def test_draft_data_is_refused_in_a_public_deployment(tmp_path):
    settings = Settings(database_url=f"sqlite:///{tmp_path}/p.db", public_deployment=True,
                        encryption_secret="k", clinical_bundle="demo_v1")
    client = TestClient(create_app(settings))
    assert client.get("/api/v1/health").json()["activeDataVersion"] is None
    headers, _ = register(client)
    response = client.get("/api/v1/profiles", headers=headers)
    assert response.status_code == 503 and response.json()["error"]["code"] == "E-DATA-002"


def test_logs_do_not_contain_personal_data(client, caplog):
    caplog.set_level("INFO")
    headers, body = register(client)
    new_profile(client, headers)
    text = caplog.text
    assert body["email"] not in text and "Amel" not in text and body["password"] not in text


def test_web_client_is_served(client):
    response = client.get("/")
    assert response.status_code == 200 and "Sahti" in response.text
