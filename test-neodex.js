// lancé par le test « local » de NeoDex : la vérification interne (moules, pièces, textes qui tiennent dans la largeur), une partie
// qui avance, l'écran de fin sans texte coupé, le plein écran et la place prise (avec NEO_SHOTS : garde des images du jeu)
module.exports = async ({ pj, sleep }) => {
  const C = code => pj(`(() => { const T = document.getElementById('gbCanvas').__gb, gb = T.st(); ${code} })()`);
  const key = (k, type = 'keydown') => pj(`document.dispatchEvent(new KeyboardEvent('${type}', {key: '${k}', bubbles: true})), 0`);
  const label = () => pj(`document.getElementById('gbCanvas').getAttribute('aria-label')`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('gbCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'gabarit-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
  const chk = await C('return T.check();'); if (chk !== 'ok') throw new Error('vérification : ' + chk);
  await pj(`document.getElementById('gbNew').click(), 0`); await shot('0-depart');
  await key('Enter'); await sleep(600);
  await key('ArrowLeft'); await key('ArrowUp'); await sleep(900); await shot('1-piece');
  await key(' '); await sleep(300); await shot('2-arrivee'); await sleep(1200);
  const first = await label(), n = +(/manche (\d+)/.exec(first) || [])[1];
  if (!(n >= 2)) throw new Error('pas de manche suivante : « ' + first + ' »');
  // la fin : plus de cœurs ; le titre « FORGE ÉTEINTE » ne touche pas les bords
  for (let i = 0; i < 6 && await C('return gb.mode;') !== 'over'; i++) { await C('gb.hearts = 1; return 0;'); await key(' '); await sleep(1300); }
  if (await C('return gb.mode;') !== 'over') throw new Error('la partie devait finir');
  await sleep(1300); await shot('3-fin');
  const edge = await pj(`(() => { const c = document.getElementById('gbCanvas'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data, W = c.width; let n = 0;
    for (let y = 40; y < 70; y++) for (const x of [0, 1, W - 2, W - 1]) { const i = (y * W + x) * 4; if (d[i] > 200 && d[i + 1] > 100 && d[i + 2] < 100) n++; } return n; })()`);
  if (edge) throw new Error('le titre de fin touche les bords (' + edge + ' pixels)');
  // une commande : bouton 1 du panneau, objet nommé en relief, chrono ; livrée en plaçant chaque pièce dans son moule
  await pj(`document.querySelector('#gbGrid .btn').click(), 0`); await key('Enter'); await sleep(900); await shot('4-commande');
  const ord = await C('if (!gb.order || !gb.name) return "pas de commande " + gb.name; for (let i = 0; i < 9 && gb.mode !== "won"; i++) { const m = gb.molds.find(x => x.real); const all = []; let p = gb.piece; for (let k = 0; k < 4; k++) { all.push(p, T.flip(p)); p = T.rot(p); } gb.piece = all.find(c => T.key(c) === T.key(m.cells)); gb.px = m.x; gb.py = 0; T.drop(); gb.anim.t = 1; T.step(); } return gb.mode + " " + gb.order.made + "/" + gb.order.need + " " + gb.order.stars;');
  if (!ord.startsWith('won 4/4 3')) throw new Error('commande : ' + ord);
  await sleep(1400); await shot('5-livree');
  const grid = await pj(`document.querySelector('#gbGrid .btn').textContent + '|' + document.querySelectorAll('#gbGrid .btn')[1].disabled`); if (!/[*]{3} *[|]false/.test(grid)) throw new Error('grille des commandes : ' + grid);
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  // plein écran, et la zone de jeu qui tient dans la fenêtre
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(200);
  await pj(`document.getElementById('gbFs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('gbCanvas'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && (Math.abs(r.height - innerHeight) < 3 || Math.abs(r.width - innerWidth) < 3); })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas l\'écran');
  const L = await pj(`(() => { const r = document.getElementById('gbCanvas').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('gbCanvas').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (process.env.NEO_FIT_LOG) console.log('FIT', JSON.stringify(L));
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 300) throw new Error('la zone de jeu dépasse la fenêtre ou reste petite : ' + JSON.stringify(L));
  return 'vérification ok · ' + first + ' · commande livrée (' + ord + ') · fin sans titre coupé · plein écran · ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};
