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

// Extra strings for the redesigned screens.
Object.assign(T.fr, {
  welcomeTitle: "Vous êtes malade ? Commençons par les bonnes questions.",
  welcomeLead: "Sahti vous aide, vous et vos enfants, avec les petits maux du quotidien : remèdes naturels d'abord, puis médicaments sans ordonnance avec la dose exacte.",
  promise1: "Chaque médicament est vérifié contre vos allergies, maladies et traitements.",
  promise2: "En cas de signe de danger, Sahti vous le dit tout de suite.",
  promise3: "Vos données de santé sont chiffrées.",
  homeTitle: "Qui ne se sent pas bien ?", homeLead: "Choisissez la personne concernée.",
  you: "Vous", child: "Enfant",
  questionOf: "Question {n}", describeShort: "Avec vos mots", answered: "{n} réponses",
  morning: "Matin", midday: "Midi", evening: "Soir", night: "Nuit",
  perDay: "{n} fois par jour", afterMeal: "après le repas", beforeMeal: "avant le repas", withMeal: "pendant le repas",
  confidenceCap: "Niveau de confiance de Sahti", notOffered: "Non proposés pour ce profil",
  emergencyTitle: "Situation dangereuse", urgentTitle: "Consultez un médecin",
  samu: "SAMU", civil: "Protection civile", sending: "Envoi…",
});
Object.assign(T.ar, {
  welcomeTitle: "تشعر بالمرض؟ لنبدأ بالأسئلة الصحيحة.",
  welcomeLead: "يساعدك صحتي أنت وأطفالك في الأمراض البسيطة اليومية: العلاجات الطبيعية أولًا، ثم أدوية بدون وصفة بالجرعة الدقيقة.",
  promise1: "يُفحص كل دواء مقابل حساسيتك وأمراضك وأدويتك.",
  promise2: "عند وجود علامة خطر، يخبرك صحتي فورًا.",
  promise3: "بياناتك الصحية مشفّرة.",
  homeTitle: "من لا يشعر بخير؟", homeLead: "اختر الشخص المعني.",
  you: "أنت", child: "طفل",
  questionOf: "السؤال {n}", describeShort: "بكلماتك", answered: "{n} إجابات",
  morning: "صباحًا", midday: "ظهرًا", evening: "مساءً", night: "ليلًا",
  perDay: "{n} مرات في اليوم", afterMeal: "بعد الأكل", beforeMeal: "قبل الأكل", withMeal: "مع الأكل",
  confidenceCap: "درجة ثقة صحتي", notOffered: "غير مقترحة لهذا الملف",
  emergencyTitle: "وضع خطير", urgentTitle: "استشر طبيبًا",
  samu: "الإسعاف", civil: "الحماية المدنية", sending: "جارٍ الإرسال…",
});

// ------------------------------------------------------------------ state and helpers
const store = {
  get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { v === null ? sessionStorage.removeItem(k) : sessionStorage.setItem(k, v); } catch (e) { /* private mode */ } },
};
const S = { token: store.get("sahti.token"), lang: store.get("sahti.lang") || "fr", me: null, dataStatus: null, seenDanger: [], route: "" };
const $app = document.getElementById("app");
const t = (k, vars) => {
  let s = (T[S.lang] && T[S.lang][k]) || T.fr[k] || k;
  if (vars) for (const [key, val] of Object.entries(vars)) s = s.replace("{" + key + "}", val);
  return s;
};
const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmtDate = (iso) => (iso || "").slice(0, 10);
const reduceMotion = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const anim = () => window.gsap && !reduceMotion();

/* Icons: one stroke family (2px, round caps), drawn inline so nothing is fetched. */
const ICON = {
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  out: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
  alert: '<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z"/><path d="M2 21c0-3 1.9-5.5 5.1-6.1"/>',
  pill: '<path d="M10.5 20.5a7 7 0 1 1-9.9-9.9l9.9-9.9a7 7 0 1 1 9.9 9.9z" transform="scale(.8) translate(3 3)"/><path d="M8.5 8.5l7 7"/>',
  ban: '<circle cx="12" cy="12" r="10"/><path d="M4.9 4.9l14.2 14.2"/>',
  back: '<path d="M15 18l-6-6 6-6"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  sunrise: '<path d="M17 18a5 5 0 0 0-10 0"/><path d="M12 2v7"/><path d="M4.2 10.2l1.4 1.4"/><path d="M1 18h2"/><path d="M21 18h2"/><path d="M18.4 11.6l1.4-1.4"/><path d="M23 22H1"/><path d="M8 6l4-4 4 4"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.9 4.9l1.4 1.4"/><path d="M17.7 17.7l1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.3 17.7l-1.4 1.4"/><path d="M19.1 4.9l-1.4 1.4"/>',
  sunset: '<path d="M17 18a5 5 0 0 0-10 0"/><path d="M12 9V2"/><path d="M4.2 10.2l1.4 1.4"/><path d="M1 18h2"/><path d="M21 18h2"/><path d="M18.4 11.6l1.4-1.4"/><path d="M23 22H1"/><path d="M16 5l-4 4-4-4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
};
const icon = (name, cls = "i") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICON[name]}</svg>`;

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

/* Every screen change goes through render(): content swap, focus to main (screen readers),
   and one short cross-fade so the change is visible but never blocks input. */
function render(html, opts = {}) {
  $app.classList.toggle("wide", !!opts.wide);
  $app.innerHTML = html;
  $app.focus({ preventScroll: true });
  window.scrollTo(0, 0);
  if (anim()) gsap.fromTo($app, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.28, ease: "power2.out", clearProps: "transform,opacity,visibility" });
}

function showError(el, err) {
  const box = typeof el === "string" ? document.querySelector(el) : el;
  if (box) box.textContent = err.message + (err.detail && err.code && err.code.startsWith("E-VAL") ? " (" + err.detail + ")" : "");
}

/* Buttons show they are working while a request runs (no double submits). */
async function busy(btn, fn) {
  if (btn) { btn.setAttribute("aria-busy", "true"); btn.disabled = true; }
  try { return await fn(); } finally { if (btn && btn.isConnected) { btn.removeAttribute("aria-busy"); btn.disabled = false; } }
}

function nav(items) {
  document.getElementById("nav").innerHTML = items.map(([label, fn, ic]) =>
    `<button type="button" data-nav="${fn}" class="${fn}" ${S.route === fn ? 'aria-current="page"' : ""}>${icon(ic)}<span class="lbl">${esc(label)}</span></button>`).join("");
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

function telLinks() {
  return `<div class="tel"><a href="tel:190"><b class="num">190</b><span>${esc(t("samu"))}</span></a><a href="tel:198"><b class="num">198</b><span>${esc(t("civil"))}</span></a></div>`;
}

function dangerHtml(notice, titleId) {
  if (!notice) return "";
  const em = notice.level === "EMERGENCY";
  return `<div class="alert ${em ? "emergency" : "urgent"}" role="alert">${icon("alert")}
    <div style="flex:1"><span class="title" ${titleId ? `id="${titleId}"` : ""}>${esc(t(em ? "emergencyTitle" : "urgentTitle"))}</span>${esc(notice.message)}${em ? telLinks() : ""}</div></div>`;
}

/* The danger notice stays on every later screen (FR-18): a sticky banner, plus a one-time
   interstitial when a new sign is found. It can't be dismissed for the rest of the consultation. */
function showDanger(notice) {
  const banner = document.getElementById("danger-banner");
  if (!notice) { banner.hidden = true; return Promise.resolve(); }
  banner.innerHTML = `<div class="inner">${icon("alert")}<span style="flex:1">${esc(notice.message)}</span>${notice.level === "EMERGENCY"
    ? `<a href="tel:190" class="num">190</a><a href="tel:198" class="num">198</a>` : ""}</div>`;
  banner.hidden = false;
  const fresh = (notice.newSigns || []).filter((c) => !S.seenDanger.includes(c));
  if (!fresh.length) return Promise.resolve();
  S.seenDanger.push(...fresh);
  return new Promise((resolve) => {
    const modal = document.getElementById("modal");
    const card = modal.querySelector(".modal-card");
    card.innerHTML = dangerHtml(notice, "modal-title") + `<button class="btn block lg" id="danger-ok">${esc(t("dangerContinue"))}</button>`;
    modal.hidden = false;
    if (anim()) gsap.fromTo(card, { scale: 0.94, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: "back.out(1.6)" });
    document.getElementById("danger-ok").focus();
    document.getElementById("danger-ok").onclick = () => { modal.hidden = true; resolve(); };
  });
}

function langSwitch() {
  return `<div class="lang-switch" role="group" aria-label="Langue / اللغة">
    <button type="button" class="btn ${S.lang === "fr" ? "" : "secondary"}" data-lang="fr" lang="fr" aria-pressed="${S.lang === "fr"}">Français</button>
    <button type="button" class="btn ${S.lang === "ar" ? "" : "secondary"}" data-lang="ar" lang="ar" aria-pressed="${S.lang === "ar"}">العربية</button></div>`;
}

function bindLang(redraw) {
  document.querySelectorAll("[data-lang]").forEach((b) => b.addEventListener("click", async () => {
    setLang(b.dataset.lang);
    if (S.token) { try { await api("PATCH", "/me", { language: S.lang }); } catch (e) { /* shown on next call */ } }
    redraw();
  }));
}

// ------------------------------------------------------------------ SCR-02 sign-up / SCR-03 login
function welcomeCopy() {
  return `<div class="welcome-copy"><h1>${esc(t("welcomeTitle"))}</h1><p class="lead">${esc(t("welcomeLead"))}</p>
    <ul class="promise"><li>${icon("check")}<span>${esc(t("promise1"))}</span></li><li>${icon("alert")}<span>${esc(t("promise2"))}</span></li>
    <li>${icon("check")}<span>${esc(t("promise3"))}</span></li></ul></div>`;
}

function signup() {
  S.route = "signup"; nav([]);
  render(`<div class="welcome">${welcomeCopy()}
  <form id="f" class="panel" novalidate>
    <h2 style="margin-top:0">${esc(t("signupTitle"))}</h2>
    <div class="field"><label for="email">${esc(t("email"))}</label><input id="email" type="email" autocomplete="email" required></div>
    <div class="field"><label for="pw">${esc(t("password"))}</label><input id="pw" type="password" autocomplete="new-password" minlength="8" required></div>
    <label class="check"><input type="checkbox" id="adult"> <span>${esc(t("adult"))}</span></label>
    <div class="consent"><p>${esc(t("consentText"))}</p><label class="check"><input type="checkbox" id="consent"> <span>${esc(t("consent"))}</span></label></div>
    <div class="consent"><p>${esc(t("disclaimerText"))}</p><label class="check"><input type="checkbox" id="disc"> <span>${esc(t("disclaimer"))}</span></label></div>
    <p class="error" id="err" role="alert"></p>
    <button class="btn block lg" type="submit" id="submit">${esc(t("create"))}</button>
    <p style="text-align:center"><button class="btn quiet" type="button" id="to-login">${esc(t("haveAccount"))}</button></p>
    ${langSwitch()}
  </form></div>`, { wide: true });
  bindLang(signup);
  document.getElementById("to-login").onclick = login;
  document.getElementById("f").onsubmit = (e) => {
    e.preventDefault();
    const err = document.getElementById("err");
    if (!document.getElementById("disc").checked) { err.textContent = T[S.lang].disclaimerText; return; }
    busy(document.getElementById("submit"), async () => {
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
    });
  };
}

function login() {
  S.route = "login"; nav([]);
  render(`<div class="welcome">${welcomeCopy()}
  <form id="f" class="panel">
    <h2 style="margin-top:0">${esc(t("loginTitle"))}</h2>
    <div class="field"><label for="email">${esc(t("email"))}</label><input id="email" type="email" autocomplete="email" required></div>
    <div class="field"><label for="pw">${esc(t("password"))}</label><input id="pw" type="password" autocomplete="current-password" required></div>
    <p class="error" id="err" role="alert"></p>
    <button class="btn block lg" type="submit" id="submit">${esc(t("login"))}</button>
    <p style="text-align:center"><button class="btn quiet" type="button" id="to-signup">${esc(t("noAccount"))}</button></p>
    ${langSwitch()}
  </form></div>`, { wide: true });
  bindLang(login);
  document.getElementById("to-signup").onclick = signup;
  document.getElementById("f").onsubmit = (e) => {
    e.preventDefault();
    busy(document.getElementById("submit"), async () => {
      try {
        const out = await api("POST", "/auth/login", { email: document.getElementById("email").value, password: document.getElementById("pw").value });
        S.token = out.accessToken; store.set("sahti.token", S.token);
        await loadMe();
        home();
      } catch (ex) { showError("#err", ex); }
    });
  };
}

async function loadMe() {
  S.me = await api("GET", "/me");
  setLang(S.me.language);
  const health = await fetch("/api/v1/health").then((r) => r.json());
  S.dataStatus = health.dataStatus;
  document.getElementById("draft-banner").hidden = health.dataStatus === "VALIDATED";
}

function mainNav() { nav([[t("home"), "home", "home"], [t("settings"), "settings", "gear"], [t("logout"), "logout", "out"]]); }

// ------------------------------------------------------------------ SCR-04 home
async function home() {
  S.route = "home"; mainNav(); hideDanger(); S.seenDanger = [];
  render(`<p class="muted">${esc(t("loading"))}</p>`);
  let data;
  try { data = await api("GET", "/profiles"); } catch (ex) { render(`<p class="error">${esc(ex.message)}</p>`); return; }
  const expired = data.items.flatMap((p) => p.expiredConsultations.map((e) =>
    `<div class="note info">${icon("clock")}<span>${esc(t("expired").replace("{d}", fmtDate(e.startedAt)))}</span></div>`));
  const consentBox = S.me && !S.me.consentActive
    ? `<div class="note info">${icon("info")}<div>${esc(t("consentMissing"))}<div class="actions" style="margin-top:8px"><button class="btn" id="consent">${esc(t("giveConsent"))}</button></div></div></div>` : "";
  const age = (p) => p.ageYears >= 2 ? `<span class="num">${p.ageYears}</span> ${esc(t("years"))}` : `<span class="num">${p.ageMonths}</span> ${esc(t("months"))}`;
  const cards = data.items.map((p) => `<article class="person">
      <div class="avatar" aria-hidden="true">${esc((p.fullName || "?").trim().charAt(0).toUpperCase())}</div>
      <h3>${esc(p.fullName)}</h3>
      <div class="meta">${esc(t(p.relation === "SELF" ? "you" : "child"))} · ${age(p)}${p.eligible ? "" : ` · ${esc(t("under2"))}`}</div>
      <div class="actions"><button class="btn" data-start="${p.profileId}">${esc(t("feelSick"))}</button>
      <button class="btn secondary" data-history="${p.profileId}">${esc(t("history"))}</button>
      <button class="btn quiet" data-edit="${p.profileId}">${esc(t("edit"))}</button></div></article>`).join("");
  const hasSelf = data.items.some((p) => p.relation === "SELF");
  render(`${expired.join("")}${consentBox}<h1>${esc(t("homeTitle"))}</h1><p class="lead">${esc(t("homeLead"))}</p>
    <div class="people">${cards}</div>
    <div class="add-row">${hasSelf ? "" : `<button class="btn secondary" id="add-self">${esc(t("addSelf"))}</button>`}
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
  S.route = "profile"; mainNav();
  let p = { relation, sex: "", smokingStatus: "NEVER", alcoholUse: "NONE", allergies: [], conditions: [], medications: [] };
  if (profileId) p = await api("GET", "/profiles/" + profileId);
  relation = p.relation;
  const terms = {};
  for (const [, kind] of LISTS) terms[kind] = (await api("GET", "/reference/terms?kind=" + kind)).items;
  const opt = (values, current) => values.map((v) => `<option value="${v}" ${current === v ? "selected" : ""}>${esc(t(v))}</option>`).join("");
  const triOpt = (current) => ["NO", "YES", "NOT_SURE"].map((v) => `<option value="${v}" ${current === v ? "selected" : ""}>${esc(t(v === "NOT_SURE" ? "notSure" : v.toLowerCase()))}</option>`).join("");
  const listHtml = ([field, kind]) => {
    const codes = (p[field] || []).filter((i) => i.termCode).map((i) => i.termCode);
    const free = (p[field] || []).filter((i) => i.freeText).map((i) => i.freeText).join(", ");
    return `<fieldset class="panel"><legend>${esc(t(field))}</legend>
      <label class="check"><input type="checkbox" name="${field}None" ${p[field + "None"] ? "checked" : ""}> <span>${esc(t("none"))}</span></label>
      <div class="chips">${terms[kind].map((x) => `<label class="chip"><input type="checkbox" name="${field}" value="${x.code}" ${codes.includes(x.code) ? "checked" : ""}> ${esc(x.label)}</label>`).join("")}</div>
      <div class="field"><label for="${field}Other">${esc(t("other"))}</label><input type="text" id="${field}Other" maxlength="100" value="${esc(free)}" aria-describedby="${field}Hint">
      <p class="hint" id="${field}Hint">${esc(t("otherHint"))}</p></div></fieldset>`;
  };
  render(`<h1>${esc(t(relation === "CHILD" ? "childProfileTitle" : "profileTitle"))}</h1>
  <form id="f" novalidate>
    <div class="panel">
      <div class="field" style="margin-top:0"><label for="fullName">${esc(t("fullName"))}</label><input id="fullName" type="text" autocomplete="name" value="${esc(p.fullName)}" required></div>
      <div class="row2">
        <div class="field"><label for="dob">${esc(t("dob"))}</label><input id="dob" type="date" value="${esc(p.dateOfBirth)}" required></div>
        <div class="field"><label for="sex">${esc(t("sex"))}</label><select id="sex"><option value=""></option>
          <option value="F" ${p.sex === "F" ? "selected" : ""}>${esc(t("female"))}</option><option value="M" ${p.sex === "M" ? "selected" : ""}>${esc(t("male"))}</option></select></div>
      </div>
      <div class="row2">
        <div class="field"><label for="weight">${esc(t("weight"))}</label><input id="weight" type="number" inputmode="decimal" step="0.1" lang="en" class="num" value="${esc(p.weightKg)}" required></div>
        <div class="field"><label for="height">${esc(t("height"))}</label><input id="height" type="number" inputmode="decimal" lang="en" class="num" value="${esc(p.heightCm ?? "")}"></div>
      </div>
      <div id="sure" class="field" hidden><span class="label" id="sure-l">${esc(t("sureWeight"))}</span>
        <div class="seg" role="radiogroup" aria-labelledby="sure-l"><label><input type="radio" name="sure" value="yes" ${p.weightUncertain ? "" : "checked"}> ${esc(t("yes"))}</label>
        <label><input type="radio" name="sure" value="no" ${p.weightUncertain ? "checked" : ""}> ${esc(t("no"))}</label></div>
        <p class="hint">${esc(t("sureWeightHelp"))}</p></div>
      <div class="row2">
        <div class="field"><label for="smoking">${esc(t("smoking"))}</label><select id="smoking">${opt(["NEVER", "FORMER", "CURRENT"], p.smokingStatus)}</select></div>
        <div class="field"><label for="alcohol">${esc(t("alcohol"))}</label><select id="alcohol">${opt(["NONE", "OCCASIONAL", "REGULAR"], p.alcoholUse)}</select></div>
      </div>
      <div id="preg" class="row2" hidden>
        <div class="field"><label for="pregnancy">${esc(t("pregnancy"))}</label><select id="pregnancy"><option value=""></option>${triOpt(p.pregnancyStatus)}</select></div>
        <div class="field"><label for="breastfeeding">${esc(t("breastfeeding"))}</label><select id="breastfeeding"><option value=""></option>${triOpt(p.breastfeedingStatus)}</select></div>
      </div>
    </div>
    ${LISTS.map(listHtml).join("")}
    <p class="error" id="err" role="alert"></p>
    <div class="actions"><button class="btn lg" type="submit" id="submit">${esc(t("save"))}</button><button class="btn quiet" type="button" id="cancel">${esc(t("cancel"))}</button></div>
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
  document.getElementById("f").onsubmit = (e) => {
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
    busy(document.getElementById("submit"), async () => {
      try {
        if (profileId) await api("PUT", "/profiles/" + profileId, body); else await api("POST", "/profiles", body);
        home();
      } catch (ex) { showError("#err", ex); }
    });
  };
}

// ------------------------------------------------------------------ SCR-15 before we start
async function beforeWeStart(p) {
  S.route = "consult"; mainNav();
  const extra = {};
  const steps = [];
  if (p.needsPregnancyCheck) steps.push("pregnancy");
  if (p.isChild && p.eligible) steps.push("weight");
  if (p.eligible) steps.push("meds");
  const go = async () => {
    try {
      const out = await api("POST", "/consultations", { profileId: p.profileId, ...extra });
      S.seenDanger = []; S.count = 0;
      if (out.step.type === "RESULT") return resultScreen(out.consultationId);
      describe(out.consultationId, out.step);
    } catch (ex) { render(`<p class="error">${esc(ex.message)}</p>`); }
  };
  const head = `<span class="tag">${esc(t("beforeTitle"))} · ${esc(p.fullName)}</span>`;
  const next = () => {
    const step = steps.shift();
    if (!step) return go();
    if (step === "pregnancy") {
      render(`${head}<p class="question">${esc(t("pregnantNow"))}</p>
        <div class="answers">${["NO", "YES", "NOT_SURE"].map((v) => `<button class="answer" data-v="${v}"><span class="dot"></span>${esc(t(v === "NOT_SURE" ? "notSure" : v.toLowerCase()))}</button>`).join("")}</div>`);
      document.querySelectorAll("[data-v]").forEach((b) => b.onclick = () => { extra.pregnancyReconfirmed = b.dataset.v; next(); });
    } else if (step === "weight") {
      render(`${head}<p class="question"><label for="w">${esc(t("childWeightNow"))}</label></p>
        <div class="number-entry"><input id="w" type="number" inputmode="decimal" step="0.1" lang="en" class="num"><span class="muted">kg</span></div>
        <p class="question" style="font-size:1.25rem;margin-top:var(--s6)">${esc(t("sureWeight"))}</p><p class="hint">${esc(t("sureWeightHelp"))}</p>
        <div class="answers"><button class="answer" data-sure="yes"><span class="dot"></span>${esc(t("yes"))}</button><button class="answer" data-sure="no"><span class="dot"></span>${esc(t("no"))}</button></div>`);
      document.querySelectorAll("[data-sure]").forEach((b) => b.onclick = () => {
        const w = document.getElementById("w").value;
        if (w !== "") extra.weightKg = Number(w);
        extra.weightUncertain = b.dataset.sure === "no";
        next();
      });
    } else {
      render(`${head}<p class="question">${esc(t("newMeds"))}</p>
        <div class="answers"><button class="answer" id="no"><span class="dot"></span>${esc(t("no"))}</button><button class="answer" id="yes"><span class="dot"></span>${esc(t("yes"))} — ${esc(t("updateProfile"))}</button></div>`);
      document.getElementById("no").onclick = next;
      document.getElementById("yes").onclick = () => profileEditor(p.profileId);
    }
  };
  next();
}

// ------------------------------------------------------------------ SCR-13 describe
function describe(cid, firstStep) {
  render(`<span class="tag">${esc(t("describeShort"))}</span><h1 style="margin-top:var(--s4)">${esc(t("describeTitle"))}</h1>
    <p class="lead">${esc(t("describeHelp"))}</p>
    <div class="describe-box"><label for="txt" class="label" hidden>${esc(t("describeTitle"))}</label>
    <textarea id="txt" maxlength="1000" autocomplete="off" spellcheck="false" aria-describedby="hint"></textarea></div>
    <p class="hint" id="hint">${icon("info")} ${esc(t("describeHint"))}</p><p class="error" id="err" role="alert"></p>
    <div class="actions"><button class="btn lg" id="send">${esc(t("send"))}</button><button class="btn secondary lg" id="skip">${esc(t("skip"))}</button></div>`);
  document.getElementById("skip").onclick = () => question(cid, firstStep);
  const send = document.getElementById("send");
  send.onclick = () => {
    const text = document.getElementById("txt").value.trim();
    if (!text) { document.getElementById("txt").focus(); return; }
    busy(send, async () => {
      try {
        const out = await api("POST", `/consultations/${cid}/description`, { text });
        if (out.pendingStep === "DANGER_CONFIRMATION") return question(cid, out.step);
        if (out.pendingStep === "CONVERTED_CONFIRMATION") return confirmConverted(cid, out.step);
        render(`<div class="note blue">${icon("info")}<span>${esc(t("fallback"))}</span></div>`);
        setTimeout(() => question(cid, out.step), 900);
      } catch (ex) { showError("#err", ex); }
    });
  };
}

// ------------------------------------------------------------------ SCR-14 confirm converted
async function confirmConverted(cid, step) {
  await showDanger(step.dangerNotice);
  render(`<span class="tag">${esc(t("describeShort"))}</span><h1 style="margin-top:var(--s4)">${esc(t("confirmTitle"))}</h1><p class="lead">${esc(t("confirmHelp"))}</p>
    <div class="panel"><ul class="converted">${step.converted.map((c) => `<li><label class="check"><input type="checkbox" checked value="${esc(c.questionCode)}"> <span>${esc(c.label)}</span></label></li>`).join("")}</ul></div>
    <p class="error" id="err"></p><button class="btn block lg" id="ok">${esc(t("confirm"))}</button>`);
  const ok = document.getElementById("ok");
  ok.onclick = () => busy(ok, async () => {
    const items = [...document.querySelectorAll(".converted input[type=checkbox]")].map((c) => ({ questionCode: c.value, confirmed: c.checked }));
    try {
      const out = await api("POST", `/consultations/${cid}/description/confirmations`, { items });
      next(cid, out.step);
    } catch (ex) { showError("#err", ex); }
  });
}

function next(cid, step) {
  if (step.type === "RESULT") return showDanger(step.dangerNotice).then(() => resultScreen(cid));
  if (step.type === "CONFIRM_CONVERTED") return confirmConverted(cid, step);
  return question(cid, step);
}

// ------------------------------------------------------------------ SCR-06 question
async function question(cid, step) {
  S.route = "consult"; mainNav();
  await showDanger(step.dangerNotice);
  const q = step.question;
  const important = q.important;
  const n = step.index || 1;
  const pct = Math.min(92, 8 + n * 7);   // indicative only: the number of questions is adaptive
  const answers = q.answerType === "NUMBER"
    ? `<div class="number-entry"><input id="num" type="number" inputmode="numeric" lang="en" class="num" min="${q.min ?? ""}" max="${q.max ?? ""}" aria-labelledby="qtext">
       <span class="muted">${esc(q.unit)}</span></div><button class="btn block lg" id="num-ok" style="margin-top:var(--s4)">${esc(t("continue"))}</button>`
    : `<div class="answers">${["YES", "NO", "UNSURE"].map((v) => `<button class="answer" data-v="${v}"><span class="dot"></span>${esc(t(v.toLowerCase()))}</button>`).join("")}</div>`;
  render(`${important ? `<span class="tag important">${icon("alert")} ${esc(t("importantQ"))}</span>`
      : `<div class="progress"><span>${esc(t("questionOf", { n: "§" })).replace("§", `<span class="num">${n}</span>`)}</span><div class="track" aria-hidden="true"><div class="fill" style="--p:${pct}%"></div></div></div>`}
    <p class="question qtext" id="qtext">${esc(q.text)}</p>${answers}<p class="error" id="err" role="alert"></p>
    ${step.canUndo ? `<div class="undo"><button class="btn quiet" id="undo">${icon("back")} ${esc(t("undo"))}</button></div>` : ""}`);
  const send = (value, btn) => busy(btn, async () => {
    try {
      const out = await api("POST", `/consultations/${cid}/answers`, { questionCode: q.code, value });
      next(cid, out.step);
    } catch (ex) { showError("#err", ex); }
  });
  document.querySelectorAll("[data-v]").forEach((b) => b.onclick = () => send(b.dataset.v, b));
  const numOk = document.getElementById("num-ok");
  if (numOk) numOk.onclick = () => { const v = document.getElementById("num").value; if (v !== "") send(Number(v), numOk); else document.getElementById("num").focus(); };
  const undo = document.getElementById("undo");
  if (undo) undo.onclick = async () => {
    try { const out = await api("POST", `/consultations/${cid}/answers/undo`); question(cid, out.step); } catch (ex) { showError("#err", ex); }
  };
}

// ------------------------------------------------------------------ SCR-07 / SCR-08 / SCR-10 result
const MOMENTS = [["MORNING", "morning", "sunrise"], ["MIDDAY", "midday", "sun"], ["EVENING", "evening", "sunset"], ["NIGHT", "night", "moon"]];
const MEAL = { AFTER_MEAL: "afterMeal", BEFORE_MEAL: "beforeMeal", WITH_MEAL: "withMeal" };

function doseLabel(m) {
  const slots = MOMENTS.map(([code, key, ic]) => {
    const on = (m.moments || []).includes(code);
    return `<div class="slot ${on ? "on" : ""}">${icon(ic)}<span>${esc(t(key))}</span><span class="pill" aria-hidden="true"></span></div>`;
  }).join("");
  const meal = MEAL[m.meal] ? " · " + esc(t(MEAL[m.meal])) : "";
  return `<article class="dose-label">
    <header><h3>${esc(m.label)}</h3><div><span class="amount">${esc(m.dose)}</span> <span class="per">· ${esc(t("perDay", { n: m.timesPerDay }))}${meal}</span></div></header>
    <div class="day-strip" role="img" aria-label="${esc(m.schedule)}">${slots}</div>
    <footer><span>${esc(m.schedule)}</span><span>${esc(m.limits)}</span></footer></article>`;
}

async function resultScreen(cid) {
  S.route = "result"; mainNav();
  let r;
  try { r = await api("GET", `/consultations/${cid}/result`); } catch (ex) { render(`<p class="error">${esc(ex.message)}</p>`); return; }
  if (r.dangerNotice) showDanger({ ...r.dangerNotice, newSigns: [] }); else hideDanger();
  const isResult = r.resultType === "ILLNESS" || r.resultType === "UNCERTAIN";
  const remedy = (x) => `<article class="remedy"><h3>${esc(x.label)}</h3><p>${esc(x.instructions)}</p></article>`;
  const excl = (x) => `<li>${icon("ban")}<span><b>${esc(x.label)}</b><br><span class="muted">${esc(x.reason)}</span></span></li>`;
  const headline = isResult ? (r.resultType === "UNCERTAIN" ? r.stillLikely.map((s) => s.label).join(" · ") : r.illness.label) : "";
  render(`${dangerHtml(r.dangerNotice)}
    ${r.prescriptionMessage ? `<div class="alert urgent" style="margin-top:var(--s4)">${icon("info")}<div>${esc(r.prescriptionMessage)}</div></div>` : ""}
    ${!isResult ? `<div class="result-head" style="margin-top:var(--s4)"><p class="kicker">${esc(r.profileName)}</p><p class="illness">${esc(t("rt" + r.resultType))}</p>
       <div class="alert urgent">${icon("alert")}<div>${esc(r.message)}</div></div></div>` : `
    <section class="result-head" style="margin-top:var(--s4)" aria-labelledby="ill">
      <p class="kicker">${esc(t(r.resultType === "UNCERTAIN" ? "stillLikely" : "probable"))} · ${esc(r.profileName)}</p>
      <h1 class="illness" id="ill">${esc(headline)}</h1>
      <div class="meter"><div class="track" aria-hidden="true"><div class="fill" style="width:${r.confidence}%"></div></div>
        <span class="value num">${r.confidence}%</span><span class="cap">${esc(t("confidenceCap"))}</span></div>
      ${r.message ? `<div class="note info" style="margin:var(--s4) 0 0">${icon("info")}<span>${esc(r.message)}</span></div>` : ""}
      ${r.reasons.length ? `<p class="muted" style="margin-top:var(--s4)">${esc(t("why"))}</p><ul class="reasons">${r.reasons.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
    </section>
    <h2 class="section-title">${icon("leaf")} ${esc(t("remedies"))}</h2>
    <div class="reveal">${r.remedies.map(remedy).join("") || "<p class='muted'>—</p>"}</div>
    <h2 class="section-title">${icon("pill")} ${esc(t("medicines"))}</h2>
    <div class="reveal">${r.medicines.map(doseLabel).join("") || `<div class="note info">${icon("info")}<span>${esc(t("noSafeMed"))}</span></div>`}</div>
    ${r.weightUncertainUsed ? `<p class="hint">${esc(t("weightUsed"))}</p>` : ""}
    ${r.uncheckedProfileItems && r.uncheckedProfileItems.length ? `<p class="hint">${esc(t("unchecked"))} ${r.uncheckedProfileItems.map(esc).join(", ")}</p>` : ""}
    ${r.exclusions.length ? `<h2 class="section-title">${icon("ban")} ${esc(t("notOffered"))}</h2><div class="panel"><ul class="excluded">${r.exclusions.map(excl).join("")}</ul></div>` : ""}
    <h2 class="section-title">${icon("clock")} ${esc(t("followUp"))}</h2><p>${esc(r.followUp)}</p>`}
    <p class="disclaimer">${esc(r.disclaimer)}<br><span class="small">${esc(t("dataVersion"))}: <span class="num">${esc(r.dataVersion || "")} (${esc(r.dataStatus || "")}) · ${esc(fmtDate(r.startedAt))}</span></span></p>
    ${r.status === "AWAITING_ACK" ? `<button class="btn block lg" id="ack">${esc(t("understood"))}</button>` : `<button class="btn block lg secondary" id="home">${esc(t("newConsult"))}</button>`}`);
  // One orchestrated moment: the confidence bar fills, then the advice arrives in order (remedies first).
  if (anim() && isResult) {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".meter .fill", { scaleX: 0, duration: 0.8 })
      .from(".reveal > *", { y: 16, autoAlpha: 0, duration: 0.4, stagger: 0.06, clearProps: "transform,opacity,visibility" }, "-=0.4");
  }
  const ack = document.getElementById("ack");
  if (ack) ack.onclick = () => busy(ack, async () => { await api("POST", `/consultations/${cid}/acknowledgement`, {}); home(); });
  const back = document.getElementById("home");
  if (back) back.onclick = home;
}

// ------------------------------------------------------------------ SCR-09 history
async function historyList(p) {
  S.route = "history"; mainNav(); hideDanger();
  const data = await api("GET", `/profiles/${p.profileId}/consultations`);
  const rows = data.items.map((c) => `<li>
      ${c.dangerLevel !== "NONE" ? `<span class="tag important" title="${esc(t("dangerTitle"))}">${icon("alert")}</span>` : ""}
      <div class="what"><b>${esc(c.illness || t("rt" + c.resultType) || t("status" + c.status))}</b><div class="when"><span class="num">${esc(fmtDate(c.startedAt))}</span> · ${esc(t("status" + c.status))}</div></div>
      ${c.status === "COMPLETED" || c.status === "AWAITING_ACK" ? `<button class="btn secondary" data-open="${c.consultationId}">${esc(t("open"))}</button>` : ""}
      ${c.status === "IN_PROGRESS" ? `<button class="btn" data-resume="${c.consultationId}">${esc(t("resume"))}</button>` : ""}</li>`).join("");
  render(`<h1>${esc(t("historyTitle"))}</h1><p class="lead">${esc(p.fullName)}</p>
    <div class="panel">${rows ? `<ul class="history">${rows}</ul>` : `<p class="muted">${esc(t("noHistory"))}</p>`}</div>
    <div class="actions"><button class="btn secondary" id="back">${icon("back")} ${esc(t("back"))}</button></div>`);
  document.querySelectorAll("[data-open]").forEach((b) => b.onclick = () => resultScreen(b.dataset.open));
  document.querySelectorAll("[data-resume]").forEach((b) => b.onclick = async () => {
    const c = await api("GET", "/consultations/" + b.dataset.resume);
    S.seenDanger = (c.step.dangerNotice && c.step.dangerNotice.signCodes) || [];
    next(b.dataset.resume, c.step);
  });
  document.getElementById("back").onclick = home;
}

// ------------------------------------------------------------------ SCR-11 settings
function settings() {
  S.route = "settings"; mainNav(); hideDanger();
  render(`<h1>${esc(t("settings"))}</h1>
    <div class="panel"><span class="label">${esc(t("email"))}</span><p style="margin:0">${esc(S.me && S.me.email)}</p>
      <span class="label" style="margin-top:var(--s4)">${esc(t("language"))}</span>${langSwitch().replace('class="lang-switch"', 'class="lang-switch" style="border:0;margin-top:0;padding-top:0"')}</div>
    <div class="panel"><h3>${esc(t("deleteAccount"))}</h3><p class="muted">${esc(t("deleteHelp"))}</p>
      <div class="field"><label for="pw">${esc(t("password"))}</label><input type="password" id="pw" autocomplete="current-password"></div><p class="error" id="err"></p>
      <button class="btn danger" id="del">${esc(t("deleteAccount"))}</button></div>`);
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
