// Navigation leak check (Playwright): signs up, runs one consultation, then loops history → result → settings → back → home
// ten times and prints heap, DOM nodes, listeners, live GSAP tweens and ScrollTriggers after a forced GC.
// Usage: start the app on :8077, then  NODE_PATH=$(npm root -g) node scripts/perf/leak_check.js
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--js-flags=--expose-gc'] });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const cdp = await p.context().newCDPSession(p);
  await cdp.send('Performance.enable');
  const errors = []; p.on('pageerror', (e) => errors.push(e.message));
  const snap = async (label) => {
    await p.waitForTimeout(1200);
    await cdp.send('HeapProfiler.enable'); await cdp.send('HeapProfiler.collectGarbage'); await cdp.send('HeapProfiler.collectGarbage'); await p.waitForTimeout(300);
    const m = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((x) => [x.name, x.value]));
    const g = await p.evaluate(() => ({
      tweens: window.gsap ? gsap.globalTimeline.getChildren(true, true, true).length : -1,
      triggers: window.ScrollTrigger ? ScrollTrigger.getAll().length : -1,
      lenis: document.documentElement.classList.contains('lenis'),
      layer: document.getElementById('transition-layer').childElementCount,
    }));
    console.log(label.padEnd(30), `heap ${(m.JSHeapUsedSize / 1048576).toFixed(2)} MB · nodes ${m.Nodes} · listeners ${m.JSEventListeners} · gsap tweens ${g.tweens} · ScrollTriggers ${g.triggers} · lenis ${g.lenis} · ghost ${g.layer}`);
  };
  // Logged-out landing, then sign up (landing motion must be torn down)
  await p.goto('http://127.0.0.1:8077/'); await p.waitForTimeout(2500);
  await p.mouse.wheel(0, 1500); await p.waitForTimeout(800);
  await snap('landing (scrolled)');
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await p.waitForTimeout(800);
  await p.fill('#email', 'leak' + Date.now() + '@example.tn'); await p.fill('#pw', 'demo-pass-123');
  for (const id of ['adult', 'consent', 'disc']) await p.check('#' + id, { force: true });
  await p.click('#submit'); await p.locator('#fullName').first().waitFor();
  await p.fill('#fullName', 'Karim Haddad'); await p.fill('#dob', '1988-02-11'); await p.selectOption('#sex', 'M'); await p.fill('#weight', '80');
  for (const n of ['allergiesNone', 'conditionsNone', 'medicationsNone']) await p.check(`input[name=${n}]`);
  await p.click('#submit'); await p.locator('[data-start]').first().waitFor();
  await p.click('[data-start]'); await p.click('#no'); await p.click('#skip');
  for (let i = 0; i < 30; i++) {
    await p.waitForTimeout(300);
    if (await p.locator('#home').count()) break;
    if (await p.locator('#danger-ok').count()) { await p.click('#danger-ok'); continue; }
    if (await p.locator('#num').count()) { await p.fill('#num', '2'); await p.click('#num-ok'); continue; }
    const txt = await p.textContent('.qtext');
    await p.click(`[data-v=${/tête|bandeau/.test(txt) && !/brutalement|nuque/.test(txt) ? 'YES' : 'NO'}]`);
  }
  await p.click('#home'); await p.locator('[data-history]').first().waitFor();
  await snap('app home, before loop');
  for (let i = 1; i <= 10; i++) {
    await p.click('[data-history]'); await p.locator('[data-open]').first().waitFor(); await p.waitForTimeout(500);
    await p.click('[data-open]'); await p.locator('.disclaimer').first().waitFor(); await p.waitForTimeout(500);
    await p.click('#nav [data-nav=settings]'); await p.locator('#del').first().waitFor(); await p.waitForTimeout(400);
    await p.goBack(); await p.locator('.disclaimer').first().waitFor(); await p.waitForTimeout(300);
    await p.click('#nav [data-nav=home]'); await p.locator('[data-history]').first().waitFor(); await p.waitForTimeout(300);
    if (i === 1 || i === 5 || i === 10) await snap(`after ${i} loop(s) (5 screens each)`);
  }
  console.log('ERRORS', errors);
  await b.close();
})();
