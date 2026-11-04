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
    noAccount: "Créer un compte", logout: "Déconnexion", home: "Accueil", addSelf: "Créer mon profil", addChild: "Ajouter un enfant",
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
    confirm: "Confirmer", fallback: "Passons par quelques questions.", probable: "Cause probable", confidence: "Confiance", why: "Pourquoi",
    remedies: "Remèdes naturels (à essayer d'abord)", medicines: "Médicaments sans ordonnance",
    excluded: "Non proposés pour ce profil", followUp: "Suivi",
    noSafeMed: "Aucun médicament sûr ne peut être proposé pour ce profil. Demandez conseil à un pharmacien.",
    unchecked: "Éléments non vérifiés du profil :", weightUsed: "Poids incertain : la dose est celle d'un poids plus faible (par sécurité).",
    stillLikely: "Causes encore possibles", understood: "J'ai compris", newConsult: "Retour à l'accueil",
    dangerTitle: "Attention", dangerContinue: "Je continue",
    historyTitle: "Historique", noHistory: "Aucune consultation pour l'instant.", open: "Ouvrir",
    statusIN_PROGRESS: "En cours", statusABANDONED: "Expirée", statusCOMPLETED: "Terminée", statusAWAITING_ACK: "À lire",
    rtILLNESS: "Résultat", rtUNCERTAIN: "Incertain", rtREFERRAL_AGE: "Médecin (âge)", rtREFERRAL_OUT_OF_SCOPE: "Médecin",
    rtREFERRAL_FAILURE: "Erreur — médecin", resume: "Reprendre",
    settings: "Réglages", deleteAccount: "Supprimer mon compte", deleteHelp: "Toutes vos données seront effacées. Entrez votre mot de passe pour confirmer.",
    language: "Langue", consentMissing: "Votre accord est nécessaire pour enregistrer des données de santé.", giveConsent: "Donner mon accord",
    dataVersion: "Données", genericError: "Erreur technique. Réessayez.",
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
    noAccount: "إنشاء حساب", logout: "خروج", home: "الرئيسية", addSelf: "إنشاء ملفي", addChild: "إضافة طفل",
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
    confirm: "تأكيد", fallback: "لنمرّ ببعض الأسئلة.", probable: "السبب المحتمل", confidence: "الثقة", why: "لماذا",
    remedies: "علاجات طبيعية (جرّبها أولًا)", medicines: "أدوية بدون وصفة",
    excluded: "غير مقترحة لهذا الملف", followUp: "المتابعة",
    noSafeMed: "لا يمكن اقتراح دواء آمن لهذا الملف. اطلب نصيحة صيدلي.",
    unchecked: "عناصر في الملف لم يتم التحقق منها:", weightUsed: "الوزن غير مؤكد: الجرعة هي جرعة وزن أقل (للسلامة).",
    stillLikely: "أسباب ما زالت محتملة", understood: "فهمت", newConsult: "العودة إلى الرئيسية",
    dangerTitle: "تنبيه", dangerContinue: "أواصل",
    historyTitle: "السجل", noHistory: "لا توجد استشارات بعد.", open: "فتح",
    statusIN_PROGRESS: "جارية", statusABANDONED: "منتهية الصلاحية", statusCOMPLETED: "مكتملة", statusAWAITING_ACK: "للقراءة",
    rtILLNESS: "نتيجة", rtUNCERTAIN: "غير مؤكدة", rtREFERRAL_AGE: "طبيب (العمر)", rtREFERRAL_OUT_OF_SCOPE: "طبيب",
    rtREFERRAL_FAILURE: "خطأ — طبيب", resume: "متابعة",
    settings: "الإعدادات", deleteAccount: "حذف حسابي", deleteHelp: "ستُمحى كل بياناتك. أدخل كلمة المرور للتأكيد.",
    language: "اللغة", consentMissing: "موافقتك ضرورية لحفظ البيانات الصحية.", giveConsent: "أعطي موافقتي",
    dataVersion: "البيانات", genericError: "خطأ تقني. حاول مرة أخرى.",
  },
};

// Extra strings for the redesigned screens.
Object.assign(T.fr, {
  homeTitle: "Qui ne se sent pas bien ?", homeLead: "Choisissez la personne concernée.",
  you: "Vous", child: "Enfant",
  questionOf: "Question {n}", describeShort: "Avec vos mots",
  morning: "Matin", midday: "Midi", evening: "Soir", night: "Nuit",
  perDay: "{n} fois par jour", afterMeal: "après le repas", beforeMeal: "avant le repas", withMeal: "pendant le repas",
  confidenceCap: "Niveau de confiance de Sahti", notOffered: "Non proposés pour ce profil",
  emergencyTitle: "Situation dangereuse", urgentTitle: "Consultez un médecin",
  samu: "SAMU", civil: "Protection civile",
});
Object.assign(T.ar, {
  homeTitle: "من لا يشعر بخير؟", homeLead: "اختر الشخص المعني.",
  you: "أنت", child: "طفل",
  questionOf: "السؤال {n}", describeShort: "بكلماتك",
  morning: "صباحًا", midday: "ظهرًا", evening: "مساءً", night: "ليلًا",
  perDay: "{n} مرات في اليوم", afterMeal: "بعد الأكل", beforeMeal: "قبل الأكل", withMeal: "مع الأكل",
  confidenceCap: "درجة ثقة صحتي", notOffered: "غير مقترحة لهذا الملف",
  emergencyTitle: "وضع خطير", urgentTitle: "استشر طبيبًا",
  samu: "الإسعاف", civil: "الحماية المدنية",
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

/* ------------------------------------------------------------------ navigation and transitions (pass 3)
   Every screen change goes through render(). It swaps the content synchronously (so event binding stays simple),
   moves focus to <main> for screen readers, and then plays a transition with a "ghost" copy of the old screen in
   #transition-layer, a portal outside <main>:
   - initial load and browser back/forward: no transition; back/forward restores the scroll position;
   - a click whose element has a twin on the next screen (data-flip-id): GSAP Flip morphs it into the new hero;
   - other navigations: desktop wipe (ghost clipped away upward, 520 ms), mobile short fade (220 ms);
   - consultation steps: a short forward slide;
   - reduced motion: instant swap.
   The new screen is interactive immediately; the ghost has pointer-events: none. */
const NAV = { kind: "initial", flip: null, popScroll: 0, applying: false };
const DESKTOP = () => window.matchMedia("(min-width: 768px)").matches;

function currentPath() { return (location.hash || "#/").slice(1) || "/"; }

/* Record the screen in the history (hash routes, so hard refresh and deep links work with the server serving "/"). */
function setPath(path, { replace = false } = {}) {
  if (NAV.kind === "pop" || NAV.applying) return;
  if (currentPath() === path) return;
  const state = Object.assign({}, history.state, { scroll: window.scrollY });
  history.replaceState(state, "", location.hash || "#/");
  const method = replace || NAV.kind === "initial" ? "replaceState" : "pushState";
  history[method]({ path, scroll: 0 }, "", "#" + path);
}

/* Call before navigating from a click: the clicked element will morph into its twin on the next screen. */
function flipFrom(el) {
  if (!el || !window.Flip || reduceMotion()) return;
  NAV.flip = { id: el.dataset.flipId, state: Flip.getState(el) };
}

function render(html, opts = {}) {
  const kind = NAV.kind;
  NAV.kind = "nav";
  const layer = document.getElementById("transition-layer");
  const wasLanding = $app.classList.contains("landing");
  const canAnimate = anim() && kind === "nav" && !opts.landing && !wasLanding && $app.childElementCount > 0;
  let ghost = null;
  if (canAnimate) {
    ghost = $app.cloneNode(true);
    ghost.removeAttribute("id");
    ghost.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
    ghost.setAttribute("aria-hidden", "true");
    const r = $app.getBoundingClientRect();
    ghost.style.cssText = `position:absolute;left:${r.left}px;top:${r.top}px;width:${r.width}px;margin:0`;
    const sheet = document.createElement("div");   // full-width sheet so the wipe covers the whole viewport
    sheet.className = "ghost-sheet";
    sheet.appendChild(ghost);
    layer.replaceChildren(sheet);
    ghost = sheet;
  }
  teardownLanding();
  $app.classList.toggle("wide", !!opts.wide);
  $app.classList.toggle("landing", !!opts.landing);
  $app.innerHTML = html;
  $app.focus({ preventScroll: true });
  const y = kind === "pop" ? NAV.popScroll : 0;
  if (window.scrollY !== y) window.scrollTo(0, y);
  if (!canAnimate) { layer.replaceChildren(); NAV.flip = null; return; }

  const flip = NAV.flip;
  NAV.flip = null;
  const twin = flip && $app.querySelector(`[data-flip-id="${flip.id}"]`);
  gsap.killTweensOf([$app, layer]);
  const done = () => layer.replaceChildren();
  if (twin) {   // shared element: the clicked card becomes the next screen's hero
    const g = ghost.querySelector(`[data-flip-id="${flip.id}"]`); if (g) g.style.visibility = "hidden";
    ghost.style.background = "transparent";
    gsap.to(ghost, { opacity: 0, duration: 0.25, ease: "power2.out", onComplete: done });
    Flip.from(flip.state, { targets: twin, duration: 0.75, ease: "power4.inOut", absolute: false, scale: true, zIndex: 30 });
    gsap.from([...$app.children].filter((c) => !c.contains(twin)), { opacity: 0, y: 16, duration: 0.6, ease: "expo.out", delay: 0.25, stagger: 0.05, clearProps: "opacity,transform" });
  } else if (opts.kind === "step") {   // inside a consultation: the next card slides in, the old one leaves
    const dir = S.lang === "ar" ? -1 : 1;
    ghost.style.background = "transparent";
    gsap.to(ghost, { x: -40 * dir, opacity: 0, duration: 0.4, ease: "power2.in", onComplete: done });
    gsap.from($app, { x: 40 * dir, opacity: 0, duration: 0.6, ease: "expo.out", delay: 0.12, clearProps: "opacity,transform" });
  } else if (DESKTOP()) {   // desktop: the old screen is wiped away upward over the new one
    gsap.fromTo(ghost, { clipPath: "inset(0 0 0% 0)" }, { clipPath: "inset(0 0 100% 0)", duration: 0.52, ease: "power4.inOut", onComplete: done });
    gsap.from($app, { y: 32, opacity: 0, duration: 0.7, ease: "expo.out", delay: 0.18, clearProps: "opacity,transform" });
  } else {   // mobile: a short fade, no full-screen wipe
    gsap.to(ghost, { opacity: 0, duration: 0.2, ease: "power2.out", onComplete: done });
    gsap.from($app, { opacity: 0, y: 10, duration: 0.3, ease: "power2.out", clearProps: "opacity,transform" });
  }
}

/* Resolve a path to a screen (deep links, hard refresh, back/forward). */
async function applyPath(path) {
  const [, a, b, c] = path.split("/");
  NAV.applying = true;
  try {
    if (!S.token) return a === "login" ? login() : signup();
    if (!S.me) await loadMe();
    if (a === "settings") return settings();
    if (a === "profile") return b === "new" ? profileEditor(null, c === "CHILD" ? "CHILD" : "SELF") : profileEditor(b);
    if (a === "history" && b) return historyList(b);
    if (a === "result" && b) return resultScreen(b);
    if (a === "start" && b) {
      const all = await api("GET", "/profiles");
      const p = all.items.find((x) => x.profileId === b);
      return p ? beforeWeStart(p) : home();
    }
    if (a === "consult" && b) {
      const s = await api("GET", "/consultations/" + b);
      if (s.status === "IN_PROGRESS") { S.seenDanger = (s.step.dangerNotice && s.step.dangerNotice.signCodes) || []; return next(b, s.step); }
      if (s.status === "ABANDONED") return home();
      return resultScreen(b);
    }
    return home();
  } finally { NAV.applying = false; }
}

window.addEventListener("popstate", (e) => {
  NAV.kind = "pop";
  NAV.popScroll = (e.state && e.state.scroll) || 0;
  applyPath(currentPath()).catch(() => home());
});

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

// ------------------------------------------------------------------ SCR-02 sign-up / SCR-03 login — the landing
/* "La boîte et la notice" (design-system/MASTER.md). Logged-out visitors see five chapters:
   1 the box on stage · 2 the box opens and its notice unfolds (pinned, scrubbed: the signature moment)
   3 night statement + the dose label · 4 the danger promise · 5 the form, then the wordmark.
   Lenis smooths scrolling on this page only. Reduced motion: no pin, no rotation, plain fades. */
Object.assign(T.fr, {
  heroL1: "Le bon remède.", heroL2: "La bonne dose.", heroL3: "Pour vous.",
  heroLead: "Décrivez ce que vous ressentez, en français ou en arabe. Sahti pose les bonnes questions, puis vous donne la notice qui correspond à votre profil : remèdes naturels d'abord, médicaments sans ordonnance à la dose exacte ensuite.",
  heroCta: "Créer mon compte", heroLogin: "Se connecter", openNotice: "Ouvrir la notice",
  readNotice: "Lisez attentivement cette notice", stamp: "PHARMACIE DE POCHE · صيدلية في جيبك · SAHTI · ",
  noticeTitle: "Une notice écrite pour vous",
  leaf1T: "Dites-le avec vos mots", leaf1D: "Sahti comprend, puis vous demande de confirmer. Rien n'est utilisé sans votre accord.",
  leaf2T: "Quelques questions", leaf2D: "Une à la fois. Les questions de sécurité passent toujours en premier.",
  leaf3T: "La dose exacte", leaf3D: "Le bon médicament pour votre profil, à quel moment de la journée, et pendant combien de jours.",
  saidText: "Mal à la gorge et fièvre depuis hier, je ne tousse pas",
  st1: "Remèdes d'abord.", st2: "Médicaments ensuite.", st3: "Jamais au hasard.",
  nightLead: "Chaque médicament est vérifié contre vos allergies, vos maladies et vos traitements. Chaque dose vient d'une bande d'âge et de poids — jamais d'un calcul. Pour un enfant au poids incertain, Sahti prend la bande la plus basse.",
  signalTitle: "Si c'est grave, Sahti vous le dit tout de suite.",
  signalLead: "Difficulté à respirer, nuque raide, sang dans les selles : au moindre signe de danger, un avertissement reste à l'écran jusqu'à la fin de la consultation, avec les numéros d'urgence.",
  joinTitle: "Commencez votre première consultation", joinLead: "Le compte garde, chiffrés, les profils de santé de votre famille.",
  f1k: "Langues", f1v: "Français et arabe, de droite à gauche", f2k: "Profils", f2v: "Vous et vos enfants, chacun avec son poids et ses traitements",
  f3k: "Données", f3v: "Chiffrées, supprimables à tout moment", f4k: "Démo", f4v: "5 maladies courantes, données non validées",
});
Object.assign(T.ar, {
  heroL1: "العلاج المناسب.", heroL2: "الجرعة الصحيحة.", heroL3: "لك أنت.",
  heroLead: "صف ما تشعر به بالفرنسية أو بالعربية. يطرح صحتي الأسئلة الصحيحة، ثم يعطيك النشرة المناسبة لملفك: العلاجات الطبيعية أولًا، ثم أدوية بدون وصفة بالجرعة الدقيقة.",
  heroCta: "إنشاء حسابي", heroLogin: "تسجيل الدخول", openNotice: "افتح النشرة",
  readNotice: "اقرأ هذه النشرة بعناية", stamp: "PHARMACIE DE POCHE · صيدلية في جيبك · SAHTI · ",
  noticeTitle: "نشرة مكتوبة لك",
  leaf1T: "قلها بكلماتك", leaf1D: "يفهم صحتي، ثم يطلب منك التأكيد. لا يُستعمل شيء دون موافقتك.",
  leaf2T: "بعض الأسئلة", leaf2D: "سؤال واحد في كل مرة. أسئلة السلامة تأتي دائمًا أولًا.",
  leaf3T: "الجرعة الدقيقة", leaf3D: "الدواء المناسب لملفك، وفي أي وقت من اليوم، ولكم يومًا.",
  saidText: "عندي وجيعة في القرجومة وسخانة من البارح",
  st1: "العلاجات أولًا.", st2: "ثم الأدوية.", st3: "لا شيء بالصدفة.",
  nightLead: "يُفحص كل دواء مقابل حساسيتك وأمراضك وأدويتك. كل جرعة تأتي من فئة عمر ووزن — لا من حساب. للطفل الذي لا يُعرف وزنه بدقة، يأخذ صحتي الفئة الأدنى.",
  signalTitle: "إذا كان الأمر خطيرًا، يخبرك صحتي فورًا.",
  signalLead: "صعوبة في التنفس، تصلب الرقبة، دم في البراز: عند أي علامة خطر، يبقى تنبيه على الشاشة حتى نهاية الاستشارة، مع أرقام الطوارئ.",
  joinTitle: "ابدأ استشارتك الأولى", joinLead: "يحفظ الحساب الملفات الصحية لعائلتك مشفّرة.",
  f1k: "اللغات", f1v: "الفرنسية والعربية، من اليمين إلى اليسار", f2k: "الملفات", f2v: "أنت وأطفالك، لكل واحد وزنه وأدويته",
  f3k: "البيانات", f3v: "مشفّرة، ويمكن حذفها في أي وقت", f4k: "تجريبي", f4v: "5 أمراض شائعة، بيانات غير معتمدة",
});

const L = { lenis: null, mm: null, tick: null, idle: null, onMove: null };

function teardownLanding() {
  if (L.mm) { L.mm.revert(); L.mm = null; }
  if (L.idle) { L.idle.kill(); L.idle = null; }
  if (L.onMove) { window.removeEventListener("pointermove", L.onMove); L.onMove = null; }
  if (L.tick && window.gsap) { gsap.ticker.remove(L.tick); L.tick = null; }
  if (L.lenis) { L.lenis.destroy(); L.lenis = null; }
  document.body.classList.remove("is-landing");
}

const ar = () => S.lang === "ar";

function boxHtml(cls = "") {
  return `<div class="box3d ${cls}" aria-hidden="true">
    <div class="face front"><div class="box-cross"></div><div class="box-name">Sahti<small>صحتي</small></div>
      <div><div class="mono" style="font-size:.75rem">${esc(ar() ? "نشرة شخصية · FR / AR" : "Notice personnelle · FR / AR")}</div>
      <div class="box-meta"><span>LOT 2026·11</span><span>${esc(ar() ? "تجريبي" : "DÉMO")}</span></div></div></div>
    <div class="face back"></div>
    <div class="face side right"><span class="side-label">${esc(ar() ? "بيانات تجريبية" : "Données de démonstration")}</span></div>
    <div class="face side left"></div>
    <div class="face cap bottom"></div>
    <div class="face cap inside"></div>
    <div class="face lid"></div>
  </div>`;
}

function stampHtml() {
  return `<div class="stamp" aria-hidden="true"><svg viewBox="0 0 140 140">
    <defs><path id="ring" d="M70,70 m-56,0 a56,56 0 1,1 112,0 a56,56 0 1,1 -112,0"/></defs>
    <g class="ring"><text><textPath href="#ring">${esc(t("stamp"))}</textPath></text></g>
    <rect x="58" y="44" width="24" height="52" fill="#00A651"/><rect x="44" y="58" width="52" height="24" fill="#00A651"/></svg></div>`;
}

function leafletHtml() {
  const strip = MOMENTS.map(([, key], i) => `<span class="${i < 3 ? "on" : ""}">${esc(t(key))}</span>`).join("");
  const ok = ar() ? ["ألم في الحلق: نعم", "حمى: نعم", "المدة: يوم واحد"] : ["Mal de gorge : oui", "Fièvre : oui", "Durée : 1 jour"];
  return `<div class="leaflet">
    <article class="leaf" data-leaf="0"><span class="mono">${esc(ar() ? "الخطوة 1 / 3" : "Étape 1 / 3")}</span><h3>${esc(t("leaf1T"))}</h3><p>${esc(t("leaf1D"))}</p>
      <div class="ui"><div class="said"><span class="typed" data-text="${esc(t("saidText"))}">${esc(t("saidText"))}</span><span class="caret" aria-hidden="true"></span></div>
      <ul class="ok">${ok.map((x) => `<li>${icon("check")}${esc(x)}</li>`).join("")}</ul></div></article>
    <article class="leaf" data-leaf="1"><span class="mono">${esc(ar() ? "الخطوة 2 / 3" : "Étape 2 / 3")}</span><h3>${esc(t("leaf2T"))}</h3><p>${esc(t("leaf2D"))}</p>
      <div class="ui"><p class="q">${esc(ar() ? "هل تشعر بألم عند البلع؟" : "Avez-vous mal en avalant ?")}</p>
      <div class="opts"><span class="on">${esc(t("yes"))}</span><span>${esc(t("no"))}</span><span>${esc(t("unsure"))}</span></div></div></article>
    <article class="leaf" data-leaf="2"><span class="mono">${esc(ar() ? "الخطوة 3 / 3" : "Étape 3 / 3")}</span><h3>${esc(t("leaf3T"))}</h3><p>${esc(t("leaf3D"))}</p>
      <div class="ui mini-dose"><span class="mono">${esc(ar() ? "باراسيتامول 500 ملغ" : "Paracétamol 500 mg")}</span>
      <div class="amount">${esc(ar() ? "قرصان" : "2 comprimés")}</div><span class="mono">${esc(ar() ? "3 مرات / يوم · بعد الأكل · 3 أيام كحد أقصى" : "3× / jour · après le repas · max 3 j")}</span>
      <div class="strip">${strip}</div></div></article>
  </div>`;
}

function doseShowcase() {
  return `<article class="dose-label" aria-label="${esc(ar() ? "مثال على بطاقة الجرعة" : "Exemple d'étiquette de dose")}"><header><h3>Paracétamol 500 mg</h3>
    <div><span class="amount">${esc(ar() ? "قرصان" : "2 comprimés")}</span> <span class="per">· ${esc(t("perDay", { n: 3 }))} · ${esc(t("afterMeal"))}</span></div></header>
    <div class="day-strip">${MOMENTS.map(([, key, ic], i) => `<div class="slot ${i < 3 ? "on" : ""}">${icon(ic)}<span>${esc(t(key))}</span><span class="pill" aria-hidden="true"></span></div>`).join("")}</div>
    <footer><span>${esc(ar() ? "6 ساعات على الأقل بين جرعتين · 3 أيام كحد أقصى" : "au moins 6 h entre deux prises · 3 jours maximum")}</span></footer></article>`;
}

function landing(formHtml, bindForm, isLogin) {
  S.route = isLogin ? "login" : "signup";
  setPath(isLogin ? "/login" : "/signup", { replace: true });
  render(`
  <section class="chapter hero2" aria-labelledby="hero-title">
    <div class="wrap hero2-grid">
      <div>
        <h1 id="hero-title"><span class="ln">${esc(t("heroL1"))}</span> <span class="ln">${esc(t("heroL2"))}</span> <span class="ln g">${esc(t("heroL3"))}</span></h1>
        <p class="lede">${esc(t("heroLead"))}</p>
        <div class="cta"><button type="button" class="btn lg" id="go-join">${esc(t(isLogin ? "login" : "heroCta"))}</button>
          <button type="button" class="btn lg secondary" id="go-notice">${esc(t("openNotice"))}</button></div>
      </div>
      <div class="stage">${stampHtml()}${boxHtml("hero-box")}<div class="shadow3d"></div></div>
    </div>
    <div class="wrap"><div class="hero2-foot"><span class="mono">${esc(t("readNotice"))}</span><span class="mono scroll-cue"><i aria-hidden="true"></i>${esc(t("openNotice"))}</span></div></div>
  </section>

  <section class="chapter notice-ch" id="notice" aria-labelledby="notice-title">
    <div class="notice-pin">
      <div class="notice-head"><span class="mono">${esc(ar() ? "نشرة · Notice" : "Notice · نشرة")}</span><h2 id="notice-title">${esc(t("noticeTitle"))}</h2></div>
      <div class="notice-stage">${boxHtml("notice-box")}${leafletHtml()}</div>
    </div>
  </section>

  <section class="chapter night" aria-labelledby="st-title">
    <div class="wrap">
      <div><h2 id="st-title" class="statement"><span>${esc(t("st1"))}</span><span>${esc(t("st2"))}</span><span class="c">${esc(t("st3"))}</span></h2>
        <p class="lede">${esc(t("nightLead"))}</p></div>
      <div class="dose-stage">${doseShowcase()}<p class="mono mono-meta">${esc(ar() ? "مثال · بيانات تجريبية" : "Exemple · données de démonstration")}</p></div>
    </div>
  </section>

  <section class="chapter signal" aria-labelledby="sig-title">
    <div class="wrap">
      <div><h2 id="sig-title">${esc(t("signalTitle"))}</h2><p class="lede">${esc(t("signalLead"))}</p></div>
      <div class="numbers"><a href="tel:190"><b class="num">190</b><span class="mono">SAMU</span></a><a href="tel:198"><b class="num">198</b><span class="mono">${esc(t("civil"))}</span></a></div>
    </div>
  </section>

  <section class="chapter join2" id="join" aria-labelledby="join-title">
    <div class="wrap">
      <div><h2 id="join-title">${esc(t("joinTitle"))}</h2><p class="lede">${esc(t("joinLead"))}</p>
        <ul class="facts">${[1, 2, 3, 4].map((n) => `<li><span class="mono">${esc(t("f" + n + "k"))}</span><span>${esc(t("f" + n + "v"))}</span></li>`).join("")}</ul></div>
      ${formHtml}
    </div>
    <div class="wrap wordmark"><div class="big" aria-hidden="true"><span>Sahti</span><span>صحتي</span></div>
      <div class="foot"><span>${esc(t("disclaimerText"))}</span><span class="mono">${esc(t("draft"))}</span></div></div>
  </section>`, { landing: true });

  document.body.classList.add("is-landing");
  document.getElementById("nav").innerHTML = `<div class="nav-lang" role="group" aria-label="Langue / اللغة">
    <button type="button" data-lang="fr" lang="fr" aria-pressed="${S.lang === "fr"}">FR</button><button type="button" data-lang="ar" lang="ar" aria-pressed="${S.lang === "ar"}">عربي</button></div>
    <button type="button" class="nav-login" id="nav-other">${esc(t(isLogin ? "noAccount" : "heroLogin"))}</button>`;
  bindLang(isLogin ? login : signup);
  const scrollToEl = (el, then) => {
    if (L.lenis) L.lenis.scrollTo(el, { duration: 1.4, onComplete: then }); else { el.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth" }); if (then) setTimeout(then, reduceMotion() ? 0 : 900); }
  };
  document.getElementById("go-join").onclick = () => scrollToEl(document.getElementById("join"), () => document.getElementById("email").focus({ preventScroll: true }));
  document.getElementById("go-notice").onclick = () => scrollToEl(document.getElementById("notice"));
  document.getElementById("nav-other").onclick = isLogin ? signup : login;
  bindForm();
  startLandingMotion();
}

/* app.js runs before the animation libraries (so the first screen paints early); motion starts once they are in. */
function whenMotionReady(fn) {
  if (window.gsap) return fn();
  document.addEventListener("DOMContentLoaded", fn, { once: true });
}

function startLandingMotion() {
  whenMotionReady(runLandingMotion);
}

function runLandingMotion() {
  document.documentElement.classList.remove("motion-pending");
  const g = window.gsap;
  if (!g || !$app.classList.contains("landing")) return;
  g.registerPlugin(window.ScrollTrigger, window.SplitText);
  L.mm = g.matchMedia();
  L.mm.add({ reduce: "(prefers-reduced-motion: reduce)", desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)", mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)" }, (ctx) => {
    const { reduce, desktop } = ctx.conditions;
    if (reduce) {   // opacity-only, no pin, no rotation, no smooth scroll
      g.from(".hero2 h1, .hero2 .lede, .hero2 .cta", { opacity: 0, duration: 0.6, stagger: 0.1 });
      return undefined;
    }
    if (window.Lenis) {
      L.lenis = new Lenis({ autoRaf: false, lerp: 0.1 });
      L.lenis.on("scroll", ScrollTrigger.update);
      L.tick = (time) => L.lenis && L.lenis.raf(time * 1000);
      g.ticker.add(L.tick);
      g.ticker.lagSmoothing(0);
    }

    // Chapter 1 — the box arrives, the headline is printed line by line.
    const intro = g.timeline({ defaults: { ease: "expo.out" } });
    intro.from(".hero-box", { y: 80, rotateY: -80, rotateX: 10, opacity: 0, duration: 1.4 }, 0)
      .from(".hero2 h1 .ln", { yPercent: 18, duration: 0.9, stagger: 0.08 }, 0.1)
      .from(".hero2 .lede, .hero2 .cta", { y: 20, duration: 0.7, stagger: 0.07 }, 0.3)
      .from(".stamp", { scale: 0.6, rotate: -90, opacity: 0, duration: 1 }, 0.4);
    // Idle: the box turns a little and follows the pointer; the stamp turns with scroll.
    const box = $app.querySelector(".hero-box");
    L.idle = g.to(box, { rotateY: "-=14", duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.4 });
    const tiltX = g.quickTo(box, "rotateX", { duration: 0.8, ease: "power3.out" });
    L.onMove = (e) => { tiltX(-14 + (e.clientY / innerHeight - 0.5) * -10); };
    window.addEventListener("pointermove", L.onMove, { passive: true });
    g.to(".stamp .ring", { rotate: 360, ease: "none", scrollTrigger: { trigger: ".hero2", start: "top top", end: "bottom top", scrub: 1 } });
    g.to(".hero-box", { y: 120, rotateY: -70, opacity: 0, ease: "none", scrollTrigger: { trigger: ".hero2", start: "top top", end: "bottom top", scrub: 1 } });

    // Chapter 2 — the signature moment: the box opens and its notice unfolds, one panel per beat.
    const leaves = g.utils.toArray(".leaf");
    if (desktop) {
      const dir = ar() ? -1 : 1;
      g.set(".notice-box", { rotateX: -16, rotateY: -24 * dir, scale: 0.9 });
      g.set(leaves[1], { transformOrigin: ar() ? "right center" : "left center", rotateY: -178 * dir });
      g.set(leaves[2], { transformOrigin: ar() ? "right center" : "left center", rotateY: 178 * dir });
      g.set(".leaflet", { y: 40, scale: 0.55, opacity: 0, xPercent: 33 * dir });
      const tl = g.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: ".notice-pin", start: "top top", end: "+=360%", pin: true, scrub: 1, anticipatePin: 1 } });
      tl.to(".notice-box", { rotateY: 0, rotateX: -22, scale: 1, duration: 1 })
        .to(".notice-box .lid", { rotateX: 230, duration: 0.8 }, ">-0.2")
        .to(".leaflet", { opacity: 1, y: -60, scale: 0.62, duration: 0.8 }, ">-0.1")
        .to(".notice-box", { y: 260, scale: 0.8, opacity: 0, duration: 1 }, ">")
        .to(".leaflet", { y: 30, scale: 1, duration: 1 }, "<")
        .add(() => typeText(), "<")
        .to(leaves[1], { rotateY: 0, duration: 1.2 }, ">")
        .to(".leaflet", { xPercent: 0, duration: 1.2 }, "<")
        .to(leaves[2], { rotateY: 0, duration: 1.2 }, ">")
        .to({}, { duration: 0.6 });
    } else {
      leaves.forEach((leaf) => g.from(leaf, { y: 50, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: leaf, start: "top 85%", onEnter: () => leaf.dataset.leaf === "0" && typeText() } }));
    }

    // Chapter 3 — the statement is printed line by line; the dose label's day strip lights up.
    g.from(".statement span", { yPercent: 100, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: ".night", start: "top 70%" } });
    const slots = $app.querySelectorAll(".dose-stage .slot.on");
    g.from(".dose-stage .dose-label", { rotateX: 24, y: 60, opacity: 0, transformPerspective: 900, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: ".dose-stage", start: "top 80%" } });
    g.from(slots, { backgroundColor: "rgba(226,243,232,0)", duration: 0.5, stagger: 0.28, ease: "power2.out", scrollTrigger: { trigger: ".dose-stage", start: "top 65%" } });
    g.from(".dose-stage .slot.on .pill", { scale: 0, duration: 0.45, stagger: 0.28, ease: "power3.out", scrollTrigger: { trigger: ".dose-stage", start: "top 65%" } });

    // Chapter 4 — the numbers rise; Chapter 5 — the wordmark slides in.
    g.from(".numbers b", { yPercent: 60, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.12, scrollTrigger: { trigger: ".signal", start: "top 70%" } });
    g.from(".wordmark .big span", { yPercent: 40, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: ".wordmark", start: "top 90%" } });
    return () => { g.set(".box3d, .leaf, .leaflet", { clearProps: "all" }); };
  });
}

function typeText() {
  const el = $app.querySelector(".typed");
  if (!el || !window.gsap) return;
  const full = el.dataset.text;
  const o = { n: 0 };
  gsap.to(o, { n: full.length, duration: 1.4, ease: "none", onUpdate: () => { el.textContent = full.slice(0, Math.round(o.n)); } });
  gsap.fromTo(".leaf .ok li", { opacity: 0, x: ar() ? 10 : -10 }, { opacity: 1, x: 0, stagger: 0.12, delay: 1.4, duration: 0.4, overwrite: true });
}

function signupForm() {
  return `<form id="f" class="panel join-form" novalidate>
    <h3 class="form-title">${esc(t("signupTitle"))}</h3>
    <div class="field"><label for="email">${esc(t("email"))}</label><input id="email" type="email" autocomplete="email" required></div>
    <div class="field"><label for="pw">${esc(t("password"))}</label><input id="pw" type="password" autocomplete="new-password" minlength="8" required></div>
    <label class="check"><input type="checkbox" id="adult"> <span>${esc(t("adult"))}</span></label>
    <div class="consent"><p>${esc(t("consentText"))}</p><label class="check"><input type="checkbox" id="consent"> <span>${esc(t("consent"))}</span></label></div>
    <div class="consent"><p>${esc(t("disclaimerText"))}</p><label class="check"><input type="checkbox" id="disc"> <span>${esc(t("disclaimer"))}</span></label></div>
    <p class="error" id="err" role="alert"></p>
    <button class="btn block lg" type="submit" id="submit">${esc(t("create"))}</button>
    <p style="text-align:center"><button class="btn quiet" type="button" id="to-login">${esc(t("haveAccount"))}</button></p>
    ${langSwitch()}
  </form>`;
}

function signup() {
  landing(signupForm(), () => {
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
  }, false);
}

function login() {
  landing(`<form id="f" class="panel join-form">
    <h3 class="form-title">${esc(t("loginTitle"))}</h3>
    <div class="field"><label for="email">${esc(t("email"))}</label><input id="email" type="email" autocomplete="email" required></div>
    <div class="field"><label for="pw">${esc(t("password"))}</label><input id="pw" type="password" autocomplete="current-password" required></div>
    <p class="error" id="err" role="alert"></p>
    <button class="btn block lg" type="submit" id="submit">${esc(t("login"))}</button>
    <p style="text-align:center"><button class="btn quiet" type="button" id="to-signup">${esc(t("noAccount"))}</button></p>
    ${langSwitch()}
  </form>`, () => {
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
  }, true);
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
  S.route = "home"; setPath("/"); mainNav(); hideDanger(); S.seenDanger = [];
  let data;
  try { data = await api("GET", "/profiles"); } catch (ex) { render(`<p class="error">${esc(ex.message)}</p>`); return; }
  const expired = data.items.flatMap((p) => p.expiredConsultations.map((e) =>
    `<div class="note info">${icon("clock")}<span>${esc(t("expired").replace("{d}", fmtDate(e.startedAt)))}</span></div>`));
  const consentBox = S.me && !S.me.consentActive
    ? `<div class="note info">${icon("info")}<div>${esc(t("consentMissing"))}<div class="actions" style="margin-top:8px"><button class="btn" id="consent">${esc(t("giveConsent"))}</button></div></div></div>` : "";
  const age = (p) => p.ageYears >= 2 ? `<span class="num">${p.ageYears}</span> ${esc(t("years"))}` : `<span class="num">${p.ageMonths}</span> ${esc(t("months"))}`;
  const cards = data.items.map((p) => `<article class="person">
      <div class="avatar" aria-hidden="true">${esc((p.fullName || "?").trim().charAt(0).toUpperCase())}</div>
      <h3 data-flip-id="person-${p.profileId}">${esc(p.fullName)}</h3>
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
  document.querySelectorAll("[data-history]").forEach((b) => b.onclick = () => { flipFrom(b.closest(".person").querySelector("[data-flip-id]")); historyList(byId[b.dataset.history]); });
  document.querySelectorAll("[data-edit]").forEach((b) => b.onclick = () => profileEditor(b.dataset.edit));
  const addSelf = document.getElementById("add-self"); if (addSelf) addSelf.onclick = () => profileEditor(null, "SELF");
  document.getElementById("add-child").onclick = () => profileEditor(null, "CHILD");
  const consent = document.getElementById("consent");
  if (consent) consent.onclick = async () => { await api("POST", "/me/consent", { textVersion: "c-1", granted: true }); await loadMe(); home(); };
}

// ------------------------------------------------------------------ SCR-05 profile editor
const LISTS = [["allergies", "ALLERGY"], ["conditions", "CONDITION"], ["medications", "MEDICATION"]];

async function profileEditor(profileId, relation) {
  S.route = "profile"; setPath(profileId ? "/profile/" + profileId : "/profile/new/" + relation); mainNav();
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
  S.route = "consult"; setPath("/start/" + p.profileId); mainNav();
  const stepOpts = { kind: "step" };
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
  const head = `<span class="tag">${esc(t("beforeTitle"))} · ${esc(p.fullName)}</span>`;
  const next = () => {
    const step = steps.shift();
    if (!step) return go();
    if (step === "pregnancy") {
      render(`${head}<p class="question">${esc(t("pregnantNow"))}</p>
        <div class="answers">${["NO", "YES", "NOT_SURE"].map((v) => `<button class="answer" data-v="${v}"><span class="dot"></span>${esc(t(v === "NOT_SURE" ? "notSure" : v.toLowerCase()))}</button>`).join("")}</div>`, stepOpts);
      document.querySelectorAll("[data-v]").forEach((b) => b.onclick = () => { extra.pregnancyReconfirmed = b.dataset.v; next(); });
    } else if (step === "weight") {
      render(`${head}<p class="question"><label for="w">${esc(t("childWeightNow"))}</label></p>
        <div class="number-entry"><input id="w" type="number" inputmode="decimal" step="0.1" lang="en" class="num"><span class="muted">kg</span></div>
        <p class="question" style="font-size:1.25rem;margin-top:var(--s6)">${esc(t("sureWeight"))}</p><p class="hint">${esc(t("sureWeightHelp"))}</p>
        <div class="answers"><button class="answer" data-sure="yes"><span class="dot"></span>${esc(t("yes"))}</button><button class="answer" data-sure="no"><span class="dot"></span>${esc(t("no"))}</button></div>`, stepOpts);
      document.querySelectorAll("[data-sure]").forEach((b) => b.onclick = () => {
        const w = document.getElementById("w").value;
        if (w !== "") extra.weightKg = Number(w);
        extra.weightUncertain = b.dataset.sure === "no";
        next();
      });
    } else {
      render(`${head}<p class="question">${esc(t("newMeds"))}</p>
        <div class="answers"><button class="answer" id="no"><span class="dot"></span>${esc(t("no"))}</button><button class="answer" id="yes"><span class="dot"></span>${esc(t("yes"))} — ${esc(t("updateProfile"))}</button></div>`, stepOpts);
      document.getElementById("no").onclick = next;
      document.getElementById("yes").onclick = () => profileEditor(p.profileId);
    }
  };
  next();
}

// ------------------------------------------------------------------ SCR-13 describe
function consultPath(cid) { setPath("/consult/" + cid, { replace: /^\/(consult|start)\//.test(currentPath()) }); }

function describe(cid, firstStep) {
  consultPath(cid);
  render(`<span class="tag">${esc(t("describeShort"))}</span><h1 style="margin-top:var(--s4)">${esc(t("describeTitle"))}</h1>
    <p class="lead">${esc(t("describeHelp"))}</p>
    <div class="describe-box"><label for="txt" class="label" hidden>${esc(t("describeTitle"))}</label>
    <textarea id="txt" maxlength="1000" autocomplete="off" spellcheck="false" aria-describedby="hint"></textarea></div>
    <p class="hint" id="hint">${icon("info")} ${esc(t("describeHint"))}</p><p class="error" id="err" role="alert"></p>
    <div class="actions"><button class="btn lg" id="send">${esc(t("send"))}</button><button class="btn secondary lg" id="skip">${esc(t("skip"))}</button></div>`, { kind: "step" });
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
  consultPath(cid);
  await showDanger(step.dangerNotice);
  render(`<span class="tag">${esc(t("describeShort"))}</span><h1 style="margin-top:var(--s4)">${esc(t("confirmTitle"))}</h1><p class="lead">${esc(t("confirmHelp"))}</p>
    <div class="panel"><ul class="converted">${step.converted.map((c) => `<li><label class="check"><input type="checkbox" checked value="${esc(c.questionCode)}"> <span>${esc(c.label)}</span></label></li>`).join("")}</ul></div>
    <p class="error" id="err"></p><button class="btn block lg" id="ok">${esc(t("confirm"))}</button>`, { kind: "step" });
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
  S.route = "consult"; consultPath(cid); mainNav();
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
    ${step.canUndo ? `<div class="undo"><button class="btn quiet" id="undo">${icon("back")} ${esc(t("undo"))}</button></div>` : ""}`, { kind: "step" });
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
  S.route = "result"; setPath("/result/" + cid, { replace: /^\/(consult|start)\//.test(currentPath()) }); mainNav();
  let r;
  try { r = await api("GET", `/consultations/${cid}/result`); } catch (ex) { render(`<p class="error">${esc(ex.message)}</p>`); return; }
  if (r.dangerNotice) showDanger({ ...r.dangerNotice, newSigns: [] }); else hideDanger();
  const isResult = r.resultType === "ILLNESS" || r.resultType === "UNCERTAIN";
  const remedy = (x) => `<article class="remedy"><h3>${esc(x.label)}</h3><p>${esc(x.instructions)}</p></article>`;
  const excl = (x) => `<li>${icon("ban")}<span><b>${esc(x.label)}</b><br><span class="muted">${esc(x.reason)}</span></span></li>`;
  const headline = isResult ? (r.resultType === "UNCERTAIN" ? r.stillLikely.map((s) => s.label).join(" · ") : r.illness.label) : "";
  render(`${dangerHtml(r.dangerNotice)}
    ${r.prescriptionMessage ? `<div class="alert urgent" style="margin-top:var(--s4)">${icon("info")}<div>${esc(r.prescriptionMessage)}</div></div>` : ""}
    ${!isResult ? `<div class="result-head" style="margin-top:var(--s4)"><p class="kicker">${esc(r.profileName)}</p><p class="illness" data-flip-id="cons-${cid}">${esc(t("rt" + r.resultType))}</p>
       <div class="alert urgent">${icon("alert")}<div>${esc(r.message)}</div></div></div>` : `
    <section class="result-head" style="margin-top:var(--s4)" aria-labelledby="ill">
      <p class="kicker">${esc(t(r.resultType === "UNCERTAIN" ? "stillLikely" : "probable"))} · ${esc(r.profileName)}</p>
      <h1 class="illness" id="ill" data-flip-id="cons-${cid}">${esc(headline)}</h1>
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
  if (typeof p === "string") {   // deep link: only the id is known
    const all = await api("GET", "/profiles");
    p = all.items.find((x) => x.profileId === p);
    if (!p) return home();
  }
  S.route = "history"; setPath("/history/" + p.profileId); mainNav(); hideDanger();
  const data = await api("GET", `/profiles/${p.profileId}/consultations`);
  const rows = data.items.map((c) => `<li>
      ${c.dangerLevel !== "NONE" ? `<span class="tag important" title="${esc(t("dangerTitle"))}">${icon("alert")}</span>` : ""}
      <div class="what"><b data-flip-id="cons-${c.consultationId}">${esc(c.illness || t("rt" + c.resultType) || t("status" + c.status))}</b><div class="when"><span class="num">${esc(fmtDate(c.startedAt))}</span> · ${esc(t("status" + c.status))}</div></div>
      ${c.status === "COMPLETED" || c.status === "AWAITING_ACK" ? `<button class="btn secondary" data-open="${c.consultationId}">${esc(t("open"))}</button>` : ""}
      ${c.status === "IN_PROGRESS" ? `<button class="btn" data-resume="${c.consultationId}">${esc(t("resume"))}</button>` : ""}</li>`).join("");
  render(`<h1>${esc(t("historyTitle"))}</h1><p class="lead history-who" data-flip-id="person-${p.profileId}">${esc(p.fullName)}</p>
    <div class="panel">${rows ? `<ul class="history">${rows}</ul>` : `<p class="muted">${esc(t("noHistory"))}</p>`}</div>
    <div class="actions"><button class="btn secondary" id="back">${icon("back")} ${esc(t("back"))}</button></div>`);
  document.querySelectorAll("[data-open]").forEach((b) => b.onclick = () => { flipFrom(b.closest("li").querySelector("[data-flip-id]")); resultScreen(b.dataset.open); });
  document.querySelectorAll("[data-resume]").forEach((b) => b.onclick = async () => {
    const c = await api("GET", "/consultations/" + b.dataset.resume);
    S.seenDanger = (c.step.dangerNotice && c.step.dangerNotice.signCodes) || [];
    next(b.dataset.resume, c.step);
  });
  document.getElementById("back").onclick = home;
}

// ------------------------------------------------------------------ SCR-11 settings
function settings() {
  S.route = "settings"; setPath("/settings"); mainNav(); hideDanger();
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


// ------------------------------------------------------------------ pass 4: cursor and magnetic buttons
/* One cursor element, fine pointers only, transform-only with a 0.15 lerp driven by gsap.ticker (no layout reads per
   frame). It grows over interactive elements and steps aside over text fields so the native caret and selection stay.
   Magnetic pull (max 16 px) on primary and large buttons; never on touch, reduced motion, disabled or placeholder links. */
function initPointerCraft() {
  const fine = window.matchMedia("(pointer: fine)").matches;
  if (!fine || reduceMotion() || !window.gsap) return;
  const dot = document.createElement("div");
  dot.className = "cursor";
  dot.setAttribute("aria-hidden", "true");
  document.body.appendChild(dot);
  document.documentElement.classList.add("has-cursor");
  const pos = { x: innerWidth / 2, y: innerHeight / 2 }, target = { x: pos.x, y: pos.y };
  let shown = false;
  window.addEventListener("pointermove", (e) => {
    target.x = e.clientX; target.y = e.clientY;
    if (!shown) { shown = true; pos.x = target.x; pos.y = target.y; dot.classList.add("on"); }
  }, { passive: true });
  document.addEventListener("pointerleave", () => { shown = false; dot.classList.remove("on"); });
  gsap.ticker.add(() => {
    pos.x += (target.x - pos.x) * 0.15;
    pos.y += (target.y - pos.y) * 0.15;
    dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
  });
  const INTERACTIVE = "a[href], button:not(:disabled), [role=button], label.chip, label.check, .seg label, select";
  const TEXT = "input:not([type=checkbox]):not([type=radio]), textarea, [contenteditable]";
  document.addEventListener("pointerover", (e) => {
    const el = e.target;
    dot.classList.toggle("text", !!el.closest(TEXT));
    dot.classList.toggle("link", !el.closest(TEXT) && !!el.closest(INTERACTIVE));
    dot.classList.toggle("danger", !!el.closest(".signal, .btn.danger, .tel"));
  });

  // magnetic pull: delegated, so it works for every screen without re-binding
  const MAG = ".btn.lg:not(:disabled):not([aria-busy=true]), .btn:not(.secondary):not(.quiet):not(:disabled), .numbers a";
  let active = null, mx = null, my = null;
  const release = () => {
    if (!active) return;
    gsap.to(active, { x: 0, y: 0, duration: 0.5, ease: "power3.out" });   // spring back
    active = null;
  };
  document.addEventListener("pointermove", (e) => {
    const el = e.target.closest && e.target.closest(MAG);
    if (el !== active) { release(); if (el) { active = el; mx = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" }); my = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" }); } }
    if (!active) return;
    const r = active.getBoundingClientRect();   // one read per pointer event, not per frame
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    mx(Math.max(-1, Math.min(1, dx)) * 16);
    my(Math.max(-1, Math.min(1, dy)) * 10);
  }, { passive: true });
  document.addEventListener("pointerdown", () => { if (active) gsap.to(active, { x: 0, y: 0, duration: 0.15 }); });
}

/* Dev-only frame meter: open /?fps=1 to see the frame rate, the longest frame and frames over 20 ms while you scroll. */
function initFrameMeter() {
  if (!new URLSearchParams(location.search).has("fps")) return;
  const box = document.createElement("div");
  box.className = "fps-meter";
  box.setAttribute("aria-hidden", "true");
  document.body.appendChild(box);
  let last = performance.now(), frames = 0, worst = 0, slow = 0, t0 = last;
  const tick = (now) => {
    const dt = now - last; last = now; frames++;
    if (dt > worst) worst = dt;
    if (dt > 20) slow++;
    if (now - t0 >= 1000) {
      box.textContent = `${Math.round(frames * 1000 / (now - t0))} fps · max ${worst.toFixed(1)} ms · >20 ms: ${slow}`;
      frames = 0; t0 = now; worst = 0;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const ROUTES = { home, settings, logout, login, signup };

// ------------------------------------------------------------------ start
(async function boot() {
  setLang(S.lang);
  history.scrollRestoration = "manual";
  initFrameMeter();
  whenMotionReady(() => {
    if (window.gsap) gsap.registerPlugin(...[window.Flip, window.ScrollTrigger, window.SplitText].filter(Boolean));
    initPointerCraft();
  });
  document.getElementById("draft-banner").hidden = false; // until /health confirms VALIDATED data
  NAV.kind = "initial";
  try { await applyPath(currentPath()); } catch (e) { NAV.kind = "initial"; signup(); }
})();
