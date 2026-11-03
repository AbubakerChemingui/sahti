/* Sahti MVP web client (SRS §13 screens). Plain JavaScript, no build step.
   The v1 target is the Flutter Android app (ADR 0004); this client exercises the same API. */
"use strict";

const T = {
  fr: {
    draft: "DONNÉES DE DÉMONSTRATION (BROUILLON) — NE PAS UTILISER POUR DE VRAIS SOINS",
    signupTitle: "Créer un compte", email: "Email", password: "Mot de passe (8 caractères minimum)",
    adult: "J'ai 18 ans ou plus.",
    consentText: "Sahti enregistre vos informations de santé (profil, réponses) de façon chiffrée, uniquement pour vous conseiller. Vous pouvez tout supprimer à tout moment.",
    consent: "J'accepte que mes données de santé soient enregistrées.",
    disclaimerText: "Sahti est votre premier pas vers le mieux-être, pas un remplacement de votre médecin. Quand Sahti dit « consultez un médecin », faites-le.",
    disclaimer: "J'ai compris.",
    create: "Créer mon compte", haveAccount: "J'ai déjà un compte", login: "Se connecter", loginTitle: "Connexion",
    noAccount: "Créer un compte", logout: "Déconnexion", home: "Accueil",
    profilesTitle: "Pour qui ?", addSelf: "Créer mon profil", addChild: "Ajouter un enfant",
    feelSick: "Je me sens malade", history: "Historique", edit: "Modifier", years: "ans", months: "mois",
    under2: "Moins de 2 ans : Sahti vous orientera vers un médecin.",
    expired: "Une consultation commencée le {d} n'a pas été terminée en 24 heures. Elle a été fermée. Vous pouvez en commencer une nouvelle.",
    profileTitle: "Profil de santé", childProfileTitle: "Profil de l'enfant",
    fullName: "Nom complet", dob: "Date de naissance", sex: "Sexe", female: "Femme / fille", male: "Homme / garçon",
    weight: "Poids (kg)", height: "Taille (cm, facultatif)",
    sureWeight: "Êtes-vous sûr(e) de ce poids ?", sureWeightHelp: "Si vous n'êtes pas sûr(e), Sahti utilisera la dose prévue pour un poids plus faible.",
    yes: "Oui", no: "Non", notSure: "Je ne sais pas", unsure: "Je ne sais pas",
    smoking: "Tabac", NEVER: "Jamais", FORMER: "Ancien fumeur", CURRENT: "Fume actuellement",
    alcohol: "Alcool", NONE: "Jamais", OCCASIONAL: "Parfois", REGULAR: "Régulièrement",
    pregnancy: "Enceinte ?", breastfeeding: "Allaitement ?",
    allergies: "Allergies", conditions: "Maladies connues", medications: "Médicaments pris actuellement",
    none: "Aucun(e)", other: "Autre / أخرى (texte libre)", otherHint: "Un élément en texte libre ne peut pas être vérifié : aucun médicament ne sera proposé.",
    save: "Enregistrer", cancel: "Annuler", back: "Retour",
    beforeTitle: "Avant de commencer", pregnantNow: "Êtes-vous enceinte en ce moment ?",
    childWeightNow: "Quel est le poids de l'enfant aujourd'hui (kg) ?", newMeds: "Prenez-vous un nouveau médicament depuis la dernière fois ?",
    updateProfile: "Mettre à jour le profil", continue: "Continuer",
    describeTitle: "Décrivez ce que vous ressentez", describeHelp: "Exemple : « J'ai mal à la gorge et de la fièvre depuis hier ».",
    describeHint: "N'écrivez pas de noms, d'adresses ni de numéros de téléphone.",
    send: "Envoyer", skip: "Passer — posez-moi des questions",
    importantQ: "Question importante", question: "Question", undo: "Revenir à la question précédente",
    confirmTitle: "Avons-nous bien compris ?", confirmHelp: "Décochez ce qui est faux. Seules les réponses cochées seront utilisées.",
    confirm: "Confirmer", fallback: "Passons par quelques questions.",
    resultTitle: "Résultat", probable: "Cause probable", confidence: "Confiance", why: "Pourquoi",
    remedies: "Remèdes naturels (à essayer d'abord)", medicines: "Médicaments sans ordonnance",
    excluded: "Non proposés pour ce profil", followUp: "Suivi",
    noSafeMed: "Aucun médicament sûr ne peut être proposé pour ce profil. Demandez conseil à un pharmacien.",
    unchecked: "Éléments non vérifiés du profil :", weightUsed: "Poids incertain : la dose est celle d'un poids plus faible (par sécurité).",
    stillLikely: "Causes encore possibles", understood: "J'ai compris", newConsult: "Retour à l'accueil",
    dangerTitle: "Attention", dangerContinue: "Je continue", callSamu: "190 SAMU", callCivil: "198 Protection civile",
    historyTitle: "Historique", noHistory: "Aucune consultation pour l'instant.", open: "Ouvrir",
    statusIN_PROGRESS: "En cours", statusABANDONED: "Expirée", statusCOMPLETED: "Terminée", statusAWAITING_ACK: "À lire",
    rtILLNESS: "Résultat", rtUNCERTAIN: "Incertain", rtREFERRAL_AGE: "Médecin (âge)", rtREFERRAL_OUT_OF_SCOPE: "Médecin",
    rtREFERRAL_FAILURE: "Erreur — médecin", resume: "Reprendre",
    settings: "Réglages", deleteAccount: "Supprimer mon compte", deleteHelp: "Toutes vos données seront effacées. Entrez votre mot de passe pour confirmer.",
    language: "Langue", consentMissing: "Votre accord est nécessaire pour enregistrer des données de santé.", giveConsent: "Donner mon accord",
    dataVersion: "Données", loading: "Chargement…", genericError: "Erreur technique. Réessayez.",
  },
  ar: {
    draft: "بيانات تجريبية (مسودة) — لا تُستعمل للعلاج الحقيقي",
    signupTitle: "إنشاء حساب", email: "البريد الإلكتروني", password: "كلمة المرور (8 أحرف على الأقل)",
    adult: "عمري 18 سنة أو أكثر.",
    consentText: "يحفظ صحتي معلوماتك الصحية (الملف والإجابات) مشفّرة، فقط لتقديم النصيحة لك. يمكنك حذف كل شيء في أي وقت.",
    consent: "أوافق على حفظ بياناتي الصحية.",
    disclaimerText: "صحتي خطوتك الأولى نحو الشعور بالتحسن، وليس بديلًا عن طبيبك. عندما يقول صحتي «استشر طبيبًا»، افعل ذلك.",
    disclaimer: "فهمت.",
    create: "إنشاء حسابي", haveAccount: "لدي حساب بالفعل", login: "تسجيل الدخول", loginTitle: "تسجيل الدخول",
    noAccount: "إنشاء حساب", logout: "خروج", home: "الرئيسية",
    profilesTitle: "لمن؟", addSelf: "إنشاء ملفي", addChild: "إضافة طفل",
    feelSick: "أشعر بالمرض", history: "السجل", edit: "تعديل", years: "سنة", months: "شهر",
    under2: "أقل من سنتين: سيوجهك صحتي إلى الطبيب.",
    expired: "استشارة بدأت في {d} لم تكتمل خلال 24 ساعة، فأُغلقت. يمكنك بدء استشارة جديدة.",
    profileTitle: "الملف الصحي", childProfileTitle: "ملف الطفل",
    fullName: "الاسم الكامل", dob: "تاريخ الميلاد", sex: "الجنس", female: "أنثى", male: "ذكر",
    weight: "الوزن (كغ)", height: "الطول (سم، اختياري)",
    sureWeight: "هل أنت متأكد من هذا الوزن؟", sureWeightHelp: "إذا لم تكن متأكدًا، سيستعمل صحتي الجرعة المخصصة لوزن أقل.",
    yes: "نعم", no: "لا", notSure: "لا أعرف", unsure: "لا أعرف",
    smoking: "التدخين", NEVER: "أبدًا", FORMER: "مدخن سابق", CURRENT: "يدخن حاليًا",
    alcohol: "الكحول", NONE: "أبدًا", OCCASIONAL: "أحيانًا", REGULAR: "بانتظام",
    pregnancy: "حامل؟", breastfeeding: "مرضعة؟",
    allergies: "الحساسية", conditions: "الأمراض المعروفة", medications: "الأدوية الحالية",
    none: "لا شيء", other: "أخرى / Autre (نص حر)", otherHint: "لا يمكن التحقق من عنصر مكتوب كنص حر: لن يُقترح أي دواء.",
    save: "حفظ", cancel: "إلغاء", back: "رجوع",
    beforeTitle: "قبل أن نبدأ", pregnantNow: "هل أنتِ حامل حاليًا؟",
    childWeightNow: "ما وزن الطفل اليوم (كغ)؟", newMeds: "هل تتناول دواءً جديدًا منذ المرة الماضية؟",
    updateProfile: "تحديث الملف", continue: "متابعة",
    describeTitle: "صف ما تشعر به", describeHelp: "مثال: «عندي وجيعة في القرجومة وسخانة من البارح».",
    describeHint: "لا تكتب أسماء أو عناوين أو أرقام هاتف.",
    send: "إرسال", skip: "تخطَّ — اطرح عليّ أسئلة",
    importantQ: "سؤال مهم", question: "سؤال", undo: "العودة إلى السؤال السابق",
    confirmTitle: "هل فهمنا جيدًا؟", confirmHelp: "أزل العلامة عمّا هو خطأ. لن تُستعمل إلا الإجابات المؤشَّر عليها.",
    confirm: "تأكيد", fallback: "لنمرّ ببعض الأسئلة.",
    resultTitle: "النتيجة", probable: "السبب المحتمل", confidence: "الثقة", why: "لماذا",
    remedies: "علاجات طبيعية (جرّبها أولًا)", medicines: "أدوية بدون وصفة",
    excluded: "غير مقترحة لهذا الملف", followUp: "المتابعة",
    noSafeMed: "لا يمكن اقتراح دواء آمن لهذا الملف. اطلب نصيحة صيدلي.",
    unchecked: "عناصر في الملف لم يتم التحقق منها:", weightUsed: "الوزن غير مؤكد: الجرعة هي جرعة وزن أقل (للسلامة).",
    stillLikely: "أسباب ما زالت محتملة", understood: "فهمت", newConsult: "العودة إلى الرئيسية",
    dangerTitle: "تنبيه", dangerContinue: "أواصل", callSamu: "190 الإسعاف", callCivil: "198 الحماية المدنية",
    historyTitle: "السجل", noHistory: "لا توجد استشارات بعد.", open: "فتح",
    statusIN_PROGRESS: "جارية", statusABANDONED: "منتهية الصلاحية", statusCOMPLETED: "مكتملة", statusAWAITING_ACK: "للقراءة",
    rtILLNESS: "نتيجة", rtUNCERTAIN: "غير مؤكدة", rtREFERRAL_AGE: "طبيب (العمر)", rtREFERRAL_OUT_OF_SCOPE: "طبيب",
    rtREFERRAL_FAILURE: "خطأ — طبيب", resume: "متابعة",
    settings: "الإعدادات", deleteAccount: "حذف حسابي", deleteHelp: "ستُمحى كل بياناتك. أدخل كلمة المرور للتأكيد.",
    language: "اللغة", consentMissing: "موافقتك ضرورية لحفظ البيانات الصحية.", giveConsent: "أعطي موافقتي",
    dataVersion: "البيانات", loading: "جارٍ التحميل…", genericError: "خطأ تقني. حاول مرة أخرى.",
  },
};

// ------------------------------------------------------------------ state and helpers
const store = {
  get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { v === null ? sessionStorage.removeItem(k) : sessionStorage.setItem(k, v); } catch (e) { /* private mode */ } },
};
const S = { token: store.get("sahti.token"), lang: store.get("sahti.lang") || "fr", me: null, dataStatus: null, seenDanger: [] };
const $app = document.getElementById("app");
const t = (k) => (T[S.lang] && T[S.lang][k]) || T.fr[k] || k;
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmtDate = (iso) => (iso || "").slice(0, 10);

function setLang(lang) {
  S.lang = lang;
  store.set("sahti.lang", lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.getElementById("draft-banner").textContent = t("draft");
}

async function api(method, path, body) {
  const headers = { "Content-Type": "application/json" };
  if (S.token) headers.Authorization = "Bearer " + S.token;
  const res = await fetch("/api/v1" + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  if (res.status === 204) return {};
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error((data.error && data.error.message) || t("genericError"));
    err.code = data.error && data.error.code;
    err.detail = data.error && data.error.detail;
    err.status = res.status;
    if (err.code === "E-AUTH-001") { logout(); }
    throw err;
  }
  return data;
}

function render(html) {
  $app.innerHTML = html;
  $app.focus();
  window.scrollTo(0, 0);
}

function showError(el, err) {
  const box = typeof el === "string" ? document.querySelector(el) : el;
  if (box) box.textContent = err.message + (err.detail && err.code && err.code.startsWith("E-VAL") ? " (" + err.detail + ")" : "");
}

function nav(items) {
  document.getElementById("nav").innerHTML = items.map(([label, fn]) => `<button type="button" data-nav="${fn}">${esc(label)}</button>`).join("");
  document.querySelectorAll("[data-nav]").forEach((b) => b.addEventListener("click", () => ROUTES[b.dataset.nav]()));
}

function logout() {
  if (S.token) fetch("/api/v1/auth/logout", { method: "POST", headers: { Authorization: "Bearer " + S.token } }).catch(() => {});
  S.token = null; S.me = null;
  store.set("sahti.token", null);
  hideDanger();
  ROUTES.login();
}

function hideDanger() { document.getElementById("danger-banner").hidden = true; }

function dangerHtml(notice, big) {
  if (!notice) return "";
  const cls = notice.level === "EMERGENCY" ? "emergency" : "urgent";
  const tel = notice.level === "EMERGENCY"
    ? `<div class="tel"><a href="tel:190">${esc(t("callSamu"))}</a><a href="tel:198">${esc(t("callCivil"))}</a></div>` : "";
  return `<div class="notice ${cls}" role="alert">${big ? `<div style="font-size:1.3rem">⚠ ${esc(t("dangerTitle"))}</div>` : "⚠ "}${esc(notice.message)}${tel}</div>`;
}

/* The danger notice stays on every later screen (FR-18): banner at the top, plus a one-time
   interstitial when a new sign is found. It can't be dismissed for the rest of the consultation. */
function showDanger(notice) {
  const banner = document.getElementById("danger-banner");
  if (!notice) { banner.hidden = true; return Promise.resolve(); }
  banner.innerHTML = "⚠ " + esc(notice.message) + (notice.level === "EMERGENCY"
    ? ` — <a href="tel:190">190</a> · <a href="tel:198">198</a>` : "");
  banner.hidden = false;
  const fresh = (notice.newSigns || []).filter((c) => !S.seenDanger.includes(c));
  if (!fresh.length) return Promise.resolve();
  S.seenDanger.push(...fresh);
  return new Promise((resolve) => {
    const modal = document.getElementById("modal");
    modal.querySelector(".modal-card").innerHTML = dangerHtml(notice, true) +
      `<button class="btn big" id="danger-ok">${esc(t("dangerContinue"))}</button>`;
    modal.hidden = false;
    document.getElementById("danger-ok").focus();
    document.getElementById("danger-ok").onclick = () => { modal.hidden = true; resolve(); };
  });
}

function langSwitch() {
  return `<div class="lang-switch" role="group" aria-label="Langue / اللغة">
    <button type="button" class="btn ${S.lang === "fr" ? "" : "secondary"}" data-lang="fr" lang="fr">Français</button>
    <button type="button" class="btn ${S.lang === "ar" ? "" : "secondary"}" data-lang="ar" lang="ar">العربية</button></div>`;
}

function bindLang(redraw) {
  document.querySelectorAll("[data-lang]").forEach((b) => b.addEventListener("click", async () => {
    setLang(b.dataset.lang);
    if (S.token) { try { await api("PATCH", "/me", { language: S.lang }); } catch (e) { /* shown on next call */ } }
    redraw();
  }));
}

// ------------------------------------------------------------------ SCR-02 sign-up / SCR-03 login
function signup() {
  nav([]);
  render(`<h1>${esc(t("signupTitle"))}</h1>
  <form id="f" novalidate>
    <label for="email">${esc(t("email"))}</label><input id="email" type="email" autocomplete="email" required>
    <label for="pw">${esc(t("password"))}</label><input id="pw" type="password" autocomplete="new-password" minlength="8" required>
    <label class="check"><input type="checkbox" id="adult"> <span>${esc(t("adult"))}</span></label>
    <div class="card"><p>${esc(t("consentText"))}</p><label class="check"><input type="checkbox" id="consent"> <span>${esc(t("consent"))}</span></label></div>
    <div class="card"><p>${esc(t("disclaimerText"))}</p><label class="check"><input type="checkbox" id="disc"> <span>${esc(t("disclaimer"))}</span></label></div>
    <p class="error" id="err" role="alert"></p>
    <button class="btn big" type="submit">${esc(t("create"))}</button>
    <p><button class="btn ghost" type="button" id="to-login">${esc(t("haveAccount"))}</button></p>
  </form>${langSwitch()}`);
  bindLang(signup);
  document.getElementById("to-login").onclick = login;
  document.getElementById("f").onsubmit = async (e) => {
    e.preventDefault();
    const err = document.getElementById("err");
    if (!document.getElementById("disc").checked) { err.textContent = T[S.lang].disclaimerText; return; }
    try {
      const out = await api("POST", "/auth/register", {
        email: document.getElementById("email").value, password: document.getElementById("pw").value, language: S.lang,
        isAdultConfirmed: document.getElementById("adult").checked,
        consent: { granted: document.getElementById("consent").checked, textVersion: "c-1" }, disclaimerVersion: "d-1",
      });
      S.token = out.accessToken; store.set("sahti.token", S.token);
      await loadMe();
      profileEditor(null, "SELF");
    } catch (ex) { showError(err, ex); }
  };
}

function login() {
  nav([]);
  render(`<h1>${esc(t("loginTitle"))}</h1>
  <form id="f">
    <label for="email">${esc(t("email"))}</label><input id="email" type="email" autocomplete="email" required>
    <label for="pw">${esc(t("password"))}</label><input id="pw" type="password" autocomplete="current-password" required>
    <p class="error" id="err" role="alert"></p>
    <button class="btn big" type="submit">${esc(t("login"))}</button>
    <p><button class="btn ghost" type="button" id="to-signup">${esc(t("noAccount"))}</button></p>
  </form>${langSwitch()}`);
  bindLang(login);
  document.getElementById("to-signup").onclick = signup;
  document.getElementById("f").onsubmit = async (e) => {
    e.preventDefault();
    try {
      const out = await api("POST", "/auth/login", { email: document.getElementById("email").value, password: document.getElementById("pw").value });
      S.token = out.accessToken; store.set("sahti.token", S.token);
      await loadMe();
      home();
    } catch (ex) { showError("#err", ex); }
  };
}

async function loadMe() {
  S.me = await api("GET", "/me");
  setLang(S.me.language);
  const health = await fetch("/api/v1/health").then((r) => r.json());
  S.dataStatus = health.dataStatus;
  document.getElementById("draft-banner").hidden = health.dataStatus !== "VALIDATED" ? false : true;
}

function mainNav() { nav([[t("home"), "home"], [t("settings"), "settings"], [t("logout"), "logout"]]); }

// ------------------------------------------------------------------ SCR-04 home
async function home() {
  mainNav(); hideDanger(); S.seenDanger = [];
  render(`<p class="muted">${esc(t("loading"))}</p>`);
  let data;
  try { data = await api("GET", "/profiles"); } catch (ex) { render(`<p class="error">${esc(ex.message)}</p>`); return; }
  const expired = data.items.flatMap((p) => p.expiredConsultations.map((e) => `<div class="notice info">${esc(t("expired").replace("{d}", fmtDate(e.startedAt)))}</div>`));
  const consentBox = S.me && !S.me.consentActive
    ? `<div class="notice info">${esc(t("consentMissing"))}<div class="row" style="margin-top:8px"><button class="btn" id="consent">${esc(t("giveConsent"))}</button></div></div>` : "";
  const cards = data.items.map((p) => `<div class="card">
      <h3>${esc(p.fullName)}</h3>
      <p class="muted">${p.ageYears >= 2 ? `<span class="num">${p.ageYears}</span> ${esc(t("years"))}` : `<span class="num">${p.ageMonths}</span> ${esc(t("months"))}`}</p>
      ${p.eligible ? "" : `<p class="muted">${esc(t("under2"))}</p>`}
      <div class="row"><button class="btn" data-start="${p.profileId}">${esc(t("feelSick"))}</button>
      <button class="btn secondary" data-history="${p.profileId}">${esc(t("history"))}</button>
      <button class="btn ghost" data-edit="${p.profileId}">${esc(t("edit"))}</button></div></div>`).join("");
  const hasSelf = data.items.some((p) => p.relation === "SELF");
  render(`${expired.join("")}${consentBox}<h1>${esc(t("profilesTitle"))}</h1>${cards}
    <div class="row">${hasSelf ? "" : `<button class="btn secondary" id="add-self">${esc(t("addSelf"))}</button>`}
    <button class="btn secondary" id="add-child">${esc(t("addChild"))}</button></div>`);
  const byId = Object.fromEntries(data.items.map((p) => [p.profileId, p]));
  document.querySelectorAll("[data-start]").forEach((b) => b.onclick = () => beforeWeStart(byId[b.dataset.start]));
  document.querySelectorAll("[data-history]").forEach((b) => b.onclick = () => historyList(byId[b.dataset.history]));
  document.querySelectorAll("[data-edit]").forEach((b) => b.onclick = () => profileEditor(b.dataset.edit));
  const addSelf = document.getElementById("add-self"); if (addSelf) addSelf.onclick = () => profileEditor(null, "SELF");
  document.getElementById("add-child").onclick = () => profileEditor(null, "CHILD");
  const consent = document.getElementById("consent");
  if (consent) consent.onclick = async () => { await api("POST", "/me/consent", { textVersion: "c-1", granted: true }); await loadMe(); home(); };
}

// ------------------------------------------------------------------ SCR-05 profile editor
const LISTS = [["allergies", "ALLERGY"], ["conditions", "CONDITION"], ["medications", "MEDICATION"]];

async function profileEditor(profileId, relation) {
  mainNav();
  let p = { relation, sex: "", smokingStatus: "NEVER", alcoholUse: "NONE", allergies: [], conditions: [], medications: [] };
  if (profileId) p = await api("GET", "/profiles/" + profileId);
  relation = p.relation;
  const terms = {};
  for (const [, kind] of LISTS) terms[kind] = (await api("GET", "/reference/terms?kind=" + kind)).items;
  const opt = (name, values, current) => values.map((v) => `<option value="${v}" ${current === v ? "selected" : ""}>${esc(t(v))}</option>`).join("");
  const listHtml = ([field, kind]) => {
    const codes = (p[field] || []).filter((i) => i.termCode).map((i) => i.termCode);
    const free = (p[field] || []).filter((i) => i.freeText).map((i) => i.freeText).join(", ");
    return `<fieldset class="card"><legend><strong>${esc(t(field))}</strong></legend>
      <label class="check"><input type="checkbox" name="${field}None" ${p[field + "None"] ? "checked" : ""}> <span>${esc(t("none"))}</span></label>
      <div class="chips">${terms[kind].map((x) => `<label><input type="checkbox" name="${field}" value="${x.code}" ${codes.includes(x.code) ? "checked" : ""}> ${esc(x.label)}</label>`).join("")}</div>
      <label for="${field}Other">${esc(t("other"))}</label><input type="text" id="${field}Other" maxlength="100" value="${esc(free)}">
      <p class="muted">${esc(t("otherHint"))}</p></fieldset>`;
  };
  render(`<h1>${esc(t(relation === "CHILD" ? "childProfileTitle" : "profileTitle"))}</h1>
  <form id="f" novalidate>
    <label for="fullName">${esc(t("fullName"))}</label><input id="fullName" type="text" value="${esc(p.fullName)}" required>
    <label for="dob">${esc(t("dob"))}</label><input id="dob" type="date" value="${esc(p.dateOfBirth)}" required>
    <label for="sex">${esc(t("sex"))}</label><select id="sex"><option value=""></option>
      <option value="F" ${p.sex === "F" ? "selected" : ""}>${esc(t("female"))}</option><option value="M" ${p.sex === "M" ? "selected" : ""}>${esc(t("male"))}</option></select>
    <label for="weight">${esc(t("weight"))}</label><input id="weight" type="number" inputmode="decimal" step="0.1" lang="en" class="num" value="${esc(p.weightKg)}" required>
    <div id="sure" class="card" hidden><p><strong>${esc(t("sureWeight"))}</strong></p><p class="muted">${esc(t("sureWeightHelp"))}</p>
      <div class="row"><label class="check"><input type="radio" name="sure" value="yes" ${p.weightUncertain ? "" : "checked"}> ${esc(t("yes"))}</label>
      <label class="check"><input type="radio" name="sure" value="no" ${p.weightUncertain ? "checked" : ""}> ${esc(t("no"))}</label></div></div>
    <label for="height">${esc(t("height"))}</label><input id="height" type="number" inputmode="decimal" lang="en" class="num" value="${esc(p.heightCm ?? "")}">
    <label for="smoking">${esc(t("smoking"))}</label><select id="smoking">${opt("smoking", ["NEVER", "FORMER", "CURRENT"], p.smokingStatus)}</select>
    <label for="alcohol">${esc(t("alcohol"))}</label><select id="alcohol">${opt("alcohol", ["NONE", "OCCASIONAL", "REGULAR"], p.alcoholUse)}</select>
    <div id="preg" hidden>
      <label for="pregnancy">${esc(t("pregnancy"))}</label><select id="pregnancy"><option value=""></option>${["NO", "YES", "NOT_SURE"].map((v) => `<option value="${v}" ${p.pregnancyStatus === v ? "selected" : ""}>${esc(t(v === "NOT_SURE" ? "notSure" : v.toLowerCase()))}</option>`).join("")}</select>
      <label for="breastfeeding">${esc(t("breastfeeding"))}</label><select id="breastfeeding"><option value=""></option>${["NO", "YES", "NOT_SURE"].map((v) => `<option value="${v}" ${p.breastfeedingStatus === v ? "selected" : ""}>${esc(t(v === "NOT_SURE" ? "notSure" : v.toLowerCase()))}</option>`).join("")}</select>
    </div>
    ${LISTS.map(listHtml).join("")}
    <p class="error" id="err" role="alert"></p>
    <div class="row"><button class="btn big" type="submit">${esc(t("save"))}</button></div>
    <p><button class="btn ghost" type="button" id="cancel">${esc(t("cancel"))}</button></p>
  </form>`);
  const ageYears = () => { const d = new Date(document.getElementById("dob").value); return isNaN(d) ? -1 : (Date.now() - d) / 31557600000; };
  const refresh = () => {
    const a = ageYears();
    document.getElementById("preg").hidden = !(document.getElementById("sex").value === "F" && a >= 12 && a <= 55);
    document.getElementById("sure").hidden = !(relation === "CHILD" && document.getElementById("weight").value);
  };
  ["dob", "sex", "weight"].forEach((id) => document.getElementById(id).addEventListener("input", refresh));
  refresh();
  document.getElementById("cancel").onclick = home;
  document.getElementById("f").onsubmit = async (e) => {
    e.preventDefault();
    const val = (id) => document.getElementById(id).value;
    const body = {
      relation, fullName: val("fullName").trim(), dateOfBirth: val("dob"), sex: val("sex"),
      weightKg: val("weight") === "" ? null : Number(val("weight")),
      weightUncertain: relation === "CHILD" && document.querySelector("input[name=sure]:checked")?.value === "no",
      heightCm: val("height") === "" ? null : Number(val("height")),
      smokingStatus: val("smoking"), alcoholUse: val("alcohol"),
    };
    if (!document.getElementById("preg").hidden) { body.pregnancyStatus = val("pregnancy") || null; body.breastfeedingStatus = val("breastfeeding") || null; }
    for (const [field] of LISTS) {
      const items = [...document.querySelectorAll(`input[name=${field}]:checked`)].map((c) => ({ termCode: c.value }));
      val(field + "Other").split(",").map((s) => s.trim()).filter(Boolean).forEach((s) => items.push({ freeText: s }));
      body[field] = items;
      body[field + "None"] = document.querySelector(`input[name=${field}None]`).checked && items.length === 0;
    }
    try {
      if (profileId) await api("PUT", "/profiles/" + profileId, body); else await api("POST", "/profiles", body);
      home();
    } catch (ex) { showError("#err", ex); }
  };
}

// ------------------------------------------------------------------ SCR-15 before we start
async function beforeWeStart(p) {
  mainNav();
  const extra = {};
  const steps = [];
  if (p.needsPregnancyCheck) steps.push("pregnancy");
  if (p.isChild && p.eligible) steps.push("weight");
  if (p.eligible) steps.push("meds");
  const go = async () => {
    try {
      const out = await api("POST", "/consultations", { profileId: p.profileId, ...extra });
      S.seenDanger = [];
      if (out.step.type === "RESULT") return resultScreen(out.consultationId);
      describe(out.consultationId, out.step);
    } catch (ex) { render(`<p class="error">${esc(ex.message)}</p>`); }
  };
  const next = () => {
    const step = steps.shift();
    if (!step) return go();
    if (step === "pregnancy") {
      render(`<h1>${esc(t("beforeTitle"))}</h1><p class="qtext">${esc(t("pregnantNow"))}</p>
        <div class="answers">${["NO", "YES", "NOT_SURE"].map((v) => `<button class="btn secondary" data-v="${v}">${esc(t(v === "NOT_SURE" ? "notSure" : v.toLowerCase()))}</button>`).join("")}</div>`);
      document.querySelectorAll("[data-v]").forEach((b) => b.onclick = () => { extra.pregnancyReconfirmed = b.dataset.v; next(); });
    } else if (step === "weight") {
      render(`<h1>${esc(t("beforeTitle"))}</h1><p class="qtext">${esc(p.fullName)} — ${esc(t("childWeightNow"))}</p>
        <input id="w" type="number" inputmode="decimal" step="0.1" lang="en" class="num">
        <p class="qtext" style="font-size:1.1rem">${esc(t("sureWeight"))}</p><p class="muted">${esc(t("sureWeightHelp"))}</p>
        <div class="answers"><button class="btn secondary" data-sure="yes">${esc(t("yes"))}</button><button class="btn secondary" data-sure="no">${esc(t("no"))}</button></div>
        <p class="error" id="err"></p>`);
      document.querySelectorAll("[data-sure]").forEach((b) => b.onclick = () => {
        const w = document.getElementById("w").value;
        if (w !== "") extra.weightKg = Number(w);
        extra.weightUncertain = b.dataset.sure === "no";
        next();
      });
    } else {
      render(`<h1>${esc(t("beforeTitle"))}</h1><p class="qtext">${esc(t("newMeds"))}</p>
        <div class="answers"><button class="btn secondary" id="no">${esc(t("no"))}</button><button class="btn secondary" id="yes">${esc(t("yes"))} — ${esc(t("updateProfile"))}</button></div>`);
      document.getElementById("no").onclick = next;
      document.getElementById("yes").onclick = () => profileEditor(p.profileId);
    }
  };
  next();
}

// ------------------------------------------------------------------ SCR-13 describe
function describe(cid, firstStep) {
  render(`<h1>${esc(t("describeTitle"))}</h1><p class="muted">${esc(t("describeHelp"))}</p>
    <textarea id="txt" maxlength="1000" autocomplete="off" spellcheck="false" aria-describedby="hint"></textarea>
    <p class="muted" id="hint">${esc(t("describeHint"))}</p><p class="error" id="err"></p>
    <div class="row"><button class="btn" id="send">${esc(t("send"))}</button><button class="btn secondary" id="skip">${esc(t("skip"))}</button></div>`);
  document.getElementById("skip").onclick = () => question(cid, firstStep);
  document.getElementById("send").onclick = async () => {
    const text = document.getElementById("txt").value.trim();
    if (!text) return;
    try {
      const out = await api("POST", `/consultations/${cid}/description`, { text });
      if (out.pendingStep === "DANGER_CONFIRMATION") return question(cid, out.step);
      if (out.pendingStep === "CONVERTED_CONFIRMATION") return confirmConverted(cid, out.step);
      render(`<p class="notice info">${esc(t("fallback"))}</p>`);
      setTimeout(() => question(cid, out.step), 900);
    } catch (ex) { showError("#err", ex); }
  };
}

// ------------------------------------------------------------------ SCR-14 confirm converted
async function confirmConverted(cid, step) {
  await showDanger(step.dangerNotice);
  render(`<h1>${esc(t("confirmTitle"))}</h1><p class="muted">${esc(t("confirmHelp"))}</p>
    <div class="card">${step.converted.map((c) => `<label class="check"><input type="checkbox" checked value="${esc(c.questionCode)}"> <span>${esc(c.label)}</span></label>`).join("")}</div>
    <p class="error" id="err"></p><button class="btn big" id="ok">${esc(t("confirm"))}</button>`);
  document.getElementById("ok").onclick = async () => {
    const items = [...document.querySelectorAll("input[type=checkbox]")].map((c) => ({ questionCode: c.value, confirmed: c.checked }));
    try {
      const out = await api("POST", `/consultations/${cid}/description/confirmations`, { items });
      next(cid, out.step);
    } catch (ex) { showError("#err", ex); }
  };
}

function next(cid, step) {
  if (step.type === "RESULT") return showDanger(step.dangerNotice).then(() => resultScreen(cid));
  if (step.type === "CONFIRM_CONVERTED") return confirmConverted(cid, step);
  return question(cid, step);
}

// ------------------------------------------------------------------ SCR-06 question
async function question(cid, step) {
  mainNav();
  await showDanger(step.dangerNotice);
  const q = step.question;
  const important = q.important;
  const answers = q.answerType === "NUMBER"
    ? `<input id="num" type="number" inputmode="numeric" lang="en" class="num" min="${q.min ?? ""}" max="${q.max ?? ""}">
       <span class="muted">${esc(q.unit)}</span><button class="btn big" id="num-ok" style="margin-top:12px">${esc(t("continue"))}</button>`
    : ["YES", "NO", "UNSURE"].map((v) => `<button class="btn secondary" data-v="${v}">${esc(t(v.toLowerCase()))}</button>`).join("");
  render(`<span class="tag ${important ? "important" : ""}">${esc(important ? t("importantQ") : t("question") + " " + step.index)}</span>
    <p class="qtext">${esc(q.text)}</p><div class="answers">${answers}</div><p class="error" id="err" role="alert"></p>
    ${step.canUndo ? `<p><button class="btn ghost" id="undo">← ${esc(t("undo"))}</button></p>` : ""}`);
  const send = async (value) => {
    try {
      const out = await api("POST", `/consultations/${cid}/answers`, { questionCode: q.code, value });
      next(cid, out.step);
    } catch (ex) { showError("#err", ex); }
  };
  document.querySelectorAll("[data-v]").forEach((b) => b.onclick = () => send(b.dataset.v));
  const numOk = document.getElementById("num-ok");
  if (numOk) numOk.onclick = () => { const v = document.getElementById("num").value; if (v !== "") send(Number(v)); };
  const undo = document.getElementById("undo");
  if (undo) undo.onclick = async () => {
    try { const out = await api("POST", `/consultations/${cid}/answers/undo`); question(cid, out.step); } catch (ex) { showError("#err", ex); }
  };
}

// ------------------------------------------------------------------ SCR-07 / SCR-08 / SCR-10 result
async function resultScreen(cid, readOnly) {
  mainNav();
  let r;
  try { r = await api("GET", `/consultations/${cid}/result`); } catch (ex) { render(`<p class="error">${esc(ex.message)}</p>`); return; }
  if (r.dangerNotice) showDanger({ ...r.dangerNotice, newSigns: [] }); else hideDanger();
  const remedy = (x) => `<div class="card remedy"><h3>${esc(x.label)}</h3><p>${esc(x.instructions)}</p></div>`;
  const med = (m) => `<div class="card med"><h3>${esc(m.label)}</h3><div class="dose">${esc(m.dose)}</div>
     <p>${esc(m.schedule)}</p><p class="muted">${esc(m.limits)}</p></div>`;
  const excl = (x) => `<li>${esc(x.label)} — <span class="muted">${esc(x.reason)}</span></li>`;
  const isResult = r.resultType === "ILLNESS" || r.resultType === "UNCERTAIN";
  render(`${dangerHtml(r.dangerNotice)}
    <h1>${esc(t("resultTitle"))}</h1>
    <p class="muted">${esc(r.profileName)} · <span class="num">${esc(fmtDate(r.startedAt))}</span> · ${esc(t("dataVersion"))}: ${esc(r.dataVersion || "")} (${esc(r.dataStatus || "")})</p>
    ${r.prescriptionMessage ? `<div class="notice urgent">${esc(r.prescriptionMessage)}</div>` : ""}
    ${r.message ? `<div class="notice ${isResult ? "info" : "urgent"}">${esc(r.message)}</div>` : ""}
    ${isResult ? `<div class="card"><p class="muted">${esc(t(r.resultType === "UNCERTAIN" ? "stillLikely" : "probable"))}</p>
       <h3>${r.resultType === "UNCERTAIN" ? r.stillLikely.map((s) => esc(s.label)).join(" · ") : esc(r.illness.label)}</h3>
       <p class="muted">${esc(t("confidence"))}: <span class="num">${r.confidence}%</span></p>
       ${r.reasons.length ? `<p class="muted">${esc(t("why"))}: ${r.reasons.map(esc).join(" · ")}</p>` : ""}</div>
     <h2>${esc(t("remedies"))}</h2>${r.remedies.map(remedy).join("") || "<p class='muted'>—</p>"}
     <h2>${esc(t("medicines"))}</h2>${r.medicines.map(med).join("") || `<div class="notice info">${esc(t("noSafeMed"))}</div>`}
     ${r.weightUncertainUsed ? `<p class="muted">${esc(t("weightUsed"))}</p>` : ""}
     ${r.uncheckedProfileItems && r.uncheckedProfileItems.length ? `<p class="muted">${esc(t("unchecked"))} ${r.uncheckedProfileItems.map(esc).join(", ")}</p>` : ""}
     ${r.exclusions.length ? `<h2>${esc(t("excluded"))}</h2><div class="card excluded"><ul class="list">${r.exclusions.map(excl).join("")}</ul></div>` : ""}
     <h2>${esc(t("followUp"))}</h2><p>${esc(r.followUp)}</p>` : ""}
    <p class="disclaimer">${esc(r.disclaimer)}</p>
    ${r.status === "AWAITING_ACK" ? `<button class="btn big" id="ack">${esc(t("understood"))}</button>` : `<button class="btn big secondary" id="home">${esc(t("newConsult"))}</button>`}`);
  const ack = document.getElementById("ack");
  if (ack) ack.onclick = async () => { await api("POST", `/consultations/${cid}/acknowledgement`, {}); home(); };
  const back = document.getElementById("home");
  if (back) back.onclick = home;
}

// ------------------------------------------------------------------ SCR-09 history
async function historyList(p) {
  mainNav(); hideDanger();
  const data = await api("GET", `/profiles/${p.profileId}/consultations`);
  const rows = data.items.map((c) => `<li class="row" style="justify-content:space-between">
      <span><span class="num">${esc(fmtDate(c.startedAt))}</span> — ${esc(c.illness || t("rt" + c.resultType) || t("status" + c.status))}
      ${c.dangerLevel !== "NONE" ? ' <span class="tag important">⚠</span>' : ""} <span class="muted">(${esc(t("status" + c.status))})</span></span>
      ${c.status === "COMPLETED" || c.status === "AWAITING_ACK" ? `<button class="btn ghost" data-open="${c.consultationId}">${esc(t("open"))}</button>` : ""}
      ${c.status === "IN_PROGRESS" ? `<button class="btn ghost" data-resume="${c.consultationId}">${esc(t("resume"))}</button>` : ""}</li>`).join("");
  render(`<h1>${esc(t("historyTitle"))} — ${esc(p.fullName)}</h1>
    <div class="card">${rows ? `<ul class="list">${rows}</ul>` : `<p class="muted">${esc(t("noHistory"))}</p>`}</div>
    <button class="btn secondary" id="back">${esc(t("back"))}</button>`);
  document.querySelectorAll("[data-open]").forEach((b) => b.onclick = () => resultScreen(b.dataset.open, true));
  document.querySelectorAll("[data-resume]").forEach((b) => b.onclick = async () => {
    const c = await api("GET", "/consultations/" + b.dataset.resume);
    S.seenDanger = (c.step.dangerNotice && c.step.dangerNotice.signCodes) || [];
    next(b.dataset.resume, c.step);
  });
  document.getElementById("back").onclick = home;
}

// ------------------------------------------------------------------ SCR-11 settings
function settings() {
  mainNav(); hideDanger();
  render(`<h1>${esc(t("settings"))}</h1>
    <div class="card"><p><strong>${esc(t("email"))}</strong>: ${esc(S.me && S.me.email)}</p></div>
    <div class="card"><h3>${esc(t("deleteAccount"))}</h3><p class="muted">${esc(t("deleteHelp"))}</p>
      <input type="password" id="pw" autocomplete="current-password"><p class="error" id="err"></p>
      <button class="btn danger" id="del">${esc(t("deleteAccount"))}</button></div>${langSwitch()}`);
  bindLang(() => { mainNav(); settings(); });
  document.getElementById("del").onclick = async () => {
    try { await api("POST", "/me/delete", { password: document.getElementById("pw").value }); logout(); signup(); } catch (ex) { showError("#err", ex); }
  };
}

const ROUTES = { home, settings, logout, login, signup };

// ------------------------------------------------------------------ start
(async function boot() {
  setLang(S.lang);
  document.getElementById("draft-banner").hidden = false; // until /health confirms VALIDATED data
  if (!S.token) return signup();
  try { await loadMe(); home(); } catch (e) { signup(); }
})();
