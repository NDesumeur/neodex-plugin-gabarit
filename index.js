// Gabarit : une pièce de métal chaud tombe vers un moule creusé dans le sol, on la tourne et on la place pour qu'elle le remplisse exactement.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Gabarit</span><span class="hint">← → placer · ↑ tourner · Maj retourner · ↓ accélérer · Espace lâcher · P pause</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="gbCanvas" width="128" height="166" role="img" aria-label="Gabarit"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="gbStats"></div></div>
      <div class="row"><button class="btn main" id="gbNew">NOUVELLE PARTIE</button></div>
      <div class="hint">Le moule est la forme creusée dans le sol, bordée de rouge. Tourne et retourne la pièce pour qu'elle ait la même forme, place-la au-dessus et lâche-la : elle doit remplir le moule exactement. Le pointillé montre où elle va tomber. Dès la manche 5, un faux moule presque pareil apparaît à côté : regarde bien. Dès la manche 8, il faut parfois retourner la pièce (Maj). Plus tu places vite, plus tu gagnes, et les pièces réussies d'affilée rapportent davantage. Trois ratés et la forge s'éteint.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:0 0 auto;position:relative}
.gameBox canvas{height:min(72vh,720px);width:auto;aspect-ratio:128/166;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}


export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: "GABARIT", T: {"k": "#0e080a", "k2": "#1a1014", "fill": "#24181c", "fillOn": "#342228", "hl": "#3e2c30", "line": "#6a5058", "acc": "#ffb04a", "accL": "#fff0b0", "accS": "#e86a1a", "accD": "#4a2008", "rivet": "#fff0e0", "btn": "#3e2c30", "btnHi": "#6a5058", "btnLo": "#1a1014", "btnHov": "#4e3640", "btnHovHi": "#8a6a72", "text": "#f8f0f0", "muted": "#c8b0b8", "acc2": "#ffd84a", "gold": "#ffd84a", "orange": "#ff8a3a", "red": "#ff4a3a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#120a0e", "bgDot": "#24181c", "bgDot2": "#1a1014", "spark": "#6a2a10", "spark2": "#ffb04a", "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]},
  emblem: ["kkkkkkkk....", "kooooook....", "kogggook....", "kooooook....", "kkkkooookkkk", "...kooooook.", "...kkkkkkkk.", "............", "kkkk...kkkkk", "kssskkkksssk", "kssssssssssk"],
  icons: [[/^NOUVELLE/, 'play'], [/^RECORDS/, 'crown']] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (v > (b ?? 0)) {  // un score nul n'est jamais un record
    games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

/* ---------- Gabarit : une pièce de métal tombe vers le sol de la forge, où un moule est creusé. On la tourne, on la retourne
   et on la place pour qu'elle remplisse le moule exactement. Raté = un cœur de moins (3). Grille de 8 px ---------- */
const GB = {C: 8, COLS: 16, ROWS: 19, HUD: 14, GROUND: 13};
GB.W = GB.COLS * GB.C; GB.H = GB.HUD + GB.ROWS * GB.C;
const gbs = gstore('gabarit', {games: 0, fits: 0, perfect: 0});
let gb = null, gbac = null, gbMute = false;
const gbNorm = cells => { const mx = Math.min(...cells.map(c => c[0])), my = Math.min(...cells.map(c => c[1])); return cells.map(([x, y]) => [x - mx, y - my]).sort((a, b) => a[1] - b[1] || a[0] - b[0]); };
const gbRot = cells => gbNorm(cells.map(([x, y]) => [-y, x]));
const gbFlip = cells => gbNorm(cells.map(([x, y]) => [-x, y]));
const gbKey = cells => gbNorm(cells).map(c => c.join(',')).join(';');
// le moule : une « ligne de toits » à l'envers (chaque colonne creusée depuis la surface, sur 1 à 4 cases), seule forme qu'une pièce qui tombe peut remplir
function gbMold(r, lvl) {
  const w = 2 + Math.floor(r() * Math.min(4, 2 + lvl / 4)), cells = [];
  let n = 0, tries = 0;
  do { cells.length = 0; for (let x = 0; x < w; x++) { const d = 1 + Math.floor(r() * Math.min(4, 2 + lvl / 3)); for (let y = 0; y < d; y++) cells.push([x, y]); } n = cells.length; } while ((n < 4 || n > 4 + Math.min(6, lvl)) && tries++ < 50);
  return gbNorm(cells);
}
// métal chauffé : biseau clair en haut à gauche, sombre en bas à droite ; refroidi en or quand il a rempli le moule
const gbBlock = (base, hi, lo, glow) => { const c = el('canvas'); c.width = c.height = GB.C; const g = c.getContext('2d');
  px(g, '#1a0e0a', 0, 0, 8, 8); px(g, base, 1, 1, 6, 6); px(g, hi, 1, 1, 6, 1); px(g, hi, 1, 1, 1, 6); px(g, lo, 1, 6, 6, 1); px(g, lo, 6, 1, 1, 6); px(g, glow, 2, 2, 2, 1); return c; };
const GB_HOT = gbBlock('#e86a1a', '#ffb04a', '#a8381a', '#fff0b0'), GB_GOLD = gbBlock('#e8b83a', '#fff09a', '#a8781a', '#ffffff'), GB_BAD = gbBlock('#6a5a5a', '#8a7a7a', '#3a2e2e', '#a89a9a');
const GB_STONE = [0, 1, 2].map(v => { const c = el('canvas'); c.width = c.height = GB.C; const g = c.getContext('2d');
  px(g, '#3a3036', 0, 0, 8, 8); px(g, '#4e434a', 0, 0, 8, 1); px(g, '#4e434a', 0, 0, 1, 8); px(g, '#2a2228', 0, 7, 8, 1); px(g, '#2a2228', 7, 0, 1, 8);
  if (v === 1) { px(g, '#2a2228', 3, 2, 2, 1); px(g, '#2a2228', 4, 3, 1, 2); } if (v === 2) px(g, '#5a4e56', 5, 4, 1, 1); return c; });
// le fond : la forge, murs de briques sombres, une enclume et deux torches
const GB_BACK = (() => { const c = el('canvas'); c.width = GB.W; c.height = GB.GROUND * GB.C; const g = c.getContext('2d');
  px(g, '#1e1418', 0, 0, GB.W, c.height);
  for (let r = 0; r < c.height / 6; r++) { const y = r * 6, o = r % 2 ? 6 : 0; px(g, '#170e12', 0, y + 5, GB.W, 1); for (let x = o; x < GB.W; x += 12) px(g, '#170e12', x, y, 1, 5); }
  const torch = x => { px(g, '#4a3a2a', x, 54, 2, 10); px(g, '#2a1a10', x - 1, 52, 4, 3); };
  torch(8); torch(GB.W - 10);
  sprite(g, ['..kkkkkkkkkkkk..', '.kssssssssssssk.', 'kssssssssssssssk', '.kkkkSSSSSSkkkk.', '....kSSSSSSk....', '...kSSSSSSSSk...', '..kkkkkkkkkkkk..'], GB.W - 30, c.height - 9, {k: '#0e080a', s: '#5a5a66', S: '#3a3a44'});
  return c; })();
function gbBeep(f, d, type = 'square', slide = 0, vol = .04) { if (gbMute) return; try { gbac ??= new AudioContext(); const o = gbac.createOscillator(), g = gbac.createGain(), t = gbac.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(gbac.destination); o.start(t); o.stop(t + d); } catch {} }
// une nouvelle partie garde le même objet : la boucle du jeu (gameLoop) continue de tourner dessus
const renew = (old, o) => { if (!old) return o; for (const k of Object.keys(old)) if (k !== 'raf') delete old[k]; return Object.assign(old, o); };
function gbNew() {
  const g = gb?.g;
  gb = renew(gb, {g, mode: 'ready', tick: 0, seen: 0, lvl: 0, score: 0, hearts: 3, fits: 0, streak: 0, dead: 0, record: false, rnd: seeded(Date.now() % 1e9), anim: null, sparks: []});
  gbLevel(); gbInfo();
}
// une manche : le moule (et parfois un faux moule presque pareil), la pièce tournée et retournée au hasard, en haut au milieu
function gbLevel() {
  const r = gb.rnd, mold = gbMold(r, gb.lvl), mw = Math.max(...mold.map(c => c[0])) + 1;
  const mx = 1 + Math.floor(r() * (GB.COLS - mw - 2));
  gb.molds = [{cells: mold, x: mx, real: true}];
  if (gb.lvl >= 4) {  // le leurre : même largeur, une colonne de profondeur différente, ailleurs
    const fake = mold.map(c => [...c]), col = Math.floor(r() * mw), deep = fake.filter(c => c[0] === col).length;
    const out = deep > 1 && r() < .5 ? fake.filter(c => !(c[0] === col && c[1] === deep - 1)) : (deep < 4 ? [...fake, [col, deep]] : fake.filter(c => !(c[0] === col && c[1] === deep - 1)));
    const fx = mx + mw + 2 + mw <= GB.COLS - 1 ? mx + mw + 2 : mx - mw - 2;
    if (fx >= 1 && gbKey(out) !== gbKey(mold)) gb.molds.push({cells: gbNorm(out), x: fx, real: false});
  }
  let piece = mold; const turns = 1 + Math.floor(r() * 3); for (let i = 0; i < turns; i++) piece = gbRot(piece);
  if (gb.lvl >= 7 && r() < .5) piece = gbFlip(piece);
  gb.piece = piece; gb.px = Math.floor((GB.COLS - (Math.max(...piece.map(c => c[0])) + 1)) / 2); gb.py = 0;
  gb.fall = 0; gb.time = 0; gb.speed = Math.max(5, 30 - gb.lvl * 2); gb.soft = false;
}
const gbSolid = (x, y) => x < 0 || x >= GB.COLS || y >= GB.ROWS || (y >= GB.GROUND && !gb.molds.some(m => m.cells.some(([cx, cy]) => m.x + cx === x && GB.GROUND + cy === y)));
const gbFits = (cells, x, y) => cells.every(([cx, cy]) => !gbSolid(x + cx, y + cy));
function gbTry(cells, dx, dy) {  // bouger ou tourner, avec un petit décalage si un bord gêne
  for (const kick of [0, -1, 1, -2, 2]) if (gbFits(cells, gb.px + dx + kick, gb.py + dy)) { gb.piece = cells; gb.px += dx + kick; gb.py += dy; return true; }
  return false;
}
function gbLand() {
  const real = gb.molds.find(m => m.real), placed = gbKey(gb.piece.map(([x, y]) => [gb.px + x, gb.py + y])), want = gbKey(real.cells.map(([x, y]) => [real.x + x, GB.GROUND + y]));
  const ok = placed === want && gb.piece.every(([x, y]) => gb.py + y >= GB.GROUND);
  gb.anim = {ok, t: 50, cells: gb.piece.map(([x, y]) => [gb.px + x, gb.py + y])};
  if (ok) {
    const n = gb.piece.length, bonus = Math.max(0, 8 - Math.floor(gb.time)) * 10;  // vite placé = bonus
    const pts = (50 * n + bonus) * (1 + Math.min(4, gb.streak) * .25);
    gb.score += Math.round(pts); gb.fits++; gb.streak++; gbBeep(660, .1); if (!gbMute) setTimeout(() => gbBeep(990, .2), 90);
    for (const [x, y] of gb.anim.cells) for (let k = 0; k < 2; k++) gb.sparks.push({x: x * GB.C + 4, y: GB.HUD + y * GB.C, vx: (gb.rnd() - .5) * 1.5, vy: -1 - gb.rnd() * 1.5, t: 24});
  } else { gb.hearts--; gb.streak = 0; gbBeep(140, .4, 'sawtooth', 60, .07); }
  gb.mode = 'anim';
}
function gbEnd() {
  gb.mode = 'over'; gb.dead = 0;
  gbs.games++; gbs.fits += gb.fits; gb.record = best('gabarit', gb.score); saveGames(); gbInfo();
}
function gbUpdate() {
  for (const s of gb.sparks) { s.x += s.vx; s.y += s.vy; s.vy += .08; s.t--; } gb.sparks = gb.sparks.filter(s => s.t > 0);
  if (gb.mode === 'over') { gb.dead++; return; }
  if (gb.mode === 'anim') { if (--gb.anim.t <= 0) { gb.anim = null; if (gb.hearts <= 0) return gbEnd(); gb.lvl++; gbLevel(); gb.mode = 'play'; } return; }
  if (gb.mode !== 'play') return;
  gb.time += 1 / 60;
  if (++gb.fall >= (gb.soft ? 2 : gb.speed)) { gb.fall = 0; if (gbFits(gb.piece, gb.px, gb.py + 1)) gb.py++; else gbLand(); }
}
function gbDrop() { if (gb.mode !== 'play') return; while (gbFits(gb.piece, gb.px, gb.py + 1)) gb.py++; gbBeep(200, .08, 'triangle', 90, .05); gbLand(); }
function gbDraw() {
  const g = gb.g, {C, W, HUD, GROUND} = GB, Y = y => HUD + y * C;
  for (; gb.seen < gb.tick; gb.seen++) if (gb.mode !== 'play') gbUpdate();
  g.imageSmoothingEnabled = false;
  g.drawImage(GB_BACK, 0, HUD);
  for (const x of [8, W - 10]) { const f = (gb.tick >> 3) % 3; px(g, '#ff8a3a', x - 1, HUD + 47 - f, 4, 4 + f); px(g, '#ffd84a', x, HUD + 49 - f, 2, 3); }
  // le sol de pierre et les moules (bords rougis pour le vrai comme pour le leurre : il faut regarder la forme)
  for (let y = GROUND; y < GB.ROWS; y++) for (let x = 0; x < GB.COLS; x++) { if (!gbSolid(x, y)) { px(g, '#0e080a', x * C, Y(y), C, C); continue; } g.drawImage(GB_STONE[(x * 7 + y * 3) % 5 === 0 ? 1 : (x + y) % 7 === 0 ? 2 : 0], x * C, Y(y)); }
  for (const m of gb.molds) for (const [cx, cy] of m.cells) { const x = (m.x + cx) * C, y = Y(GROUND + cy);
    if (!m.cells.some(c => c[0] === cx - 1 && c[1] === cy)) px(g, '#a8381a', x, y, 1, C); if (!m.cells.some(c => c[0] === cx + 1 && c[1] === cy)) px(g, '#a8381a', x + C - 1, y, 1, C);
    if (!m.cells.some(c => c[0] === cx && c[1] === cy + 1)) px(g, '#a8381a', x, y + C - 1, C, 1); }
  // l'ombre d'arrivée : où la pièce tombera si on la lâche
  if (gb.mode === 'play') { let gy = gb.py; while (gbFits(gb.piece, gb.px, gy + 1)) gy++;
    for (const [cx, cy] of gb.piece) { const x = (gb.px + cx) * C, y = Y(gy + cy); for (let i = 0; i < C; i += 2) { px(g, '#ffb04a', x + i, y, 1, 1); px(g, '#ffb04a', x + i, y + C - 1, 1, 1); px(g, '#ffb04a', x, y + i, 1, 1); px(g, '#ffb04a', x + C - 1, y + i, 1, 1); } } }
  // la pièce, ou le résultat de la manche
  if (gb.anim) for (const [x, y] of gb.anim.cells) g.drawImage(gb.anim.ok ? GB_GOLD : (gb.anim.t >> 2) % 2 ? GB_BAD : GB_HOT, x * C, Y(y));
  else if (gb.mode === 'play' || gb.mode === 'pause') for (const [cx, cy] of gb.piece) g.drawImage(GB_HOT, (gb.px + cx) * C, Y(gb.py + cy));
  for (const s of gb.sparks) px(g, s.t > 12 ? '#fff0b0' : '#ffb04a', s.x, s.y);
  if (gb.anim) pxFont(g, gb.anim.ok ? (gb.streak > 1 ? 'PILE ! ×' + gb.streak : 'PILE !') : 'RATÉ !', W / 2, HUD + 40, gb.anim.ok ? '#ffd84a' : '#ff4a3a', 12, 'center');
  // l'affichage : score, manche, cœurs
  px(g, '#120a0e', 0, 0, W, HUD);
  pxFont(g, String(gb.score), 4, 10, '#ffffff', 8); pxFont(g, 'N° ' + (gb.lvl + 1), W / 2 + 4, 10, '#c8b0b8', 8, 'center');
  for (let i = 0; i < 3; i++) { const x = W - 30 + i * 9, c = i < gb.hearts ? '#ff4a3a' : '#3a2a32'; px(g, c, x, 4, 3, 2); px(g, c, x + 4, 4, 3, 2); px(g, c, x, 5, 7, 2); px(g, c, x + 1, 7, 5, 1); px(g, c, x + 2, 8, 3, 1); px(g, c, x + 3, 9, 1, 1); }
  if (gb.mode === 'ready') gameText(g, W, [['GABARIT', '#ffb04a', 16], ['← → : placer', '#ffffff'], ['↑ : tourner', '#ffffff'], ['Maj : retourner', '#ffffff'], ['Espace : lâcher', '#ffffff'], ['Record ' + (games.best.gabarit || 0), '#ffd84a']], 46);
  if (gb.mode === 'pause') gameText(g, W, [['PAUSE', '#ffffff', 12], ['Entrée : reprendre', '#b8b0c8']], 60);
  if (gb.mode === 'over' && gb.dead > 30) gameText(g, W, [['FORGE ÉTEINTE', '#ff8a3a', 12], [gb.fits + (gb.fits > 1 ? ' pièces moulées' : ' pièce moulée'), '#ffffff'], [gb.score + ' points', '#ffffff'], [gb.record ? 'NOUVEAU RECORD !' : 'Record ' + (games.best.gabarit || 0), '#ffd84a'], [gb.dead > 60 ? 'Entrée : rejouer' : '', '#b8b0c8']], 50);
  if (gb.tick % 30 === 0) g.canvas.setAttribute('aria-label', 'Gabarit : ' + (gb.mode === 'play' || gb.mode === 'anim' ? 'manche ' + (gb.lvl + 1) + ', ' + gb.score + ' points, ' + gb.hearts + ' cœurs, ' + gb.fits + ' pièces moulées' : gb.mode === 'over' ? 'partie finie, ' + gb.score + ' points' : gb.mode === 'pause' ? 'pause' : 'prêt'));
}
function gbInfo() {
  $('gbStats').replaceChildren(...[['Meilleur score', games.best.gabarit || 0], ['Parties', gbs.games], ['Pièces moulées', gbs.fits]].flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));
}
function gbStart() {
  if (gb.mode === 'ready' || gb.mode === 'pause') { gb.mode = 'play'; return true; }
  if (gb.mode === 'over' && gb.dead > 60) { gbNew(); gb.mode = 'play'; return true; }
  return false;
}
document.addEventListener('keydown', e => {
  if (!view.classList.contains('on') || !gb || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key, keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Enter', 'Shift', 'q', 'd', 'a', 'z', 'w', 's', 'x', 'c'];
  if (!keys.includes(k)) { if ((k === 'p' || k === 'Escape') && gb.mode === 'play') gb.mode = 'pause'; return; }
  e.preventDefault();
  if (gb.mode !== 'play') { if (!e.repeat && (k === ' ' || k === 'Enter' || gb.mode === 'ready')) gbStart(); return; }
  if (k === 'ArrowLeft' || k === 'q' || k === 'a') gbTry(gb.piece, -1, 0);
  else if (k === 'ArrowRight' || k === 'd') gbTry(gb.piece, 1, 0);
  else if (k === 'ArrowUp' || k === 'z' || k === 'w' || k === 'x') { if (!e.repeat && gbTry(gbRot(gb.piece), 0, 0)) gbBeep(440, .03, 'square', 0, .02); }
  else if (k === 'Shift' || k === 'c') { if (!e.repeat && gbTry(gbFlip(gb.piece), 0, 0)) gbBeep(520, .03, 'square', 0, .02); }
  else if (k === 'ArrowDown' || k === 's') gb.soft = true;
  else if (k === ' ' && !e.repeat) gbDrop();
});
document.addEventListener('keyup', e => { if (gb && (e.key === 'ArrowDown' || e.key.toLowerCase() === 's')) gb.soft = false; });
// au doigt : à gauche / à droite pour déplacer, au milieu pour tourner, deux appuis rapides au milieu pour lâcher
{ const cv = $('gbCanvas');
  cv.onpointerdown = e => { e.preventDefault(); if (!gb || gbStart() || gb.mode !== 'play') return; const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width;
    if (x < .33) gbTry(gb.piece, -1, 0); else if (x > .67) gbTry(gb.piece, 1, 0); else { if (performance.now() - (gb.tap || 0) < 280) { gbTry(gbRot(gbRot(gbRot(gb.piece))), 0, 0); gbDrop(); } else gbTry(gbRot(gb.piece), 0, 0); gb.tap = performance.now(); } }; }
$('gbNew').onclick = () => { gbNew(); $('gbNew').blur(); };
{  // vérification : chaque pièce peut reprendre la forme de son moule (rotations et retournement), une pièce bien placée remplit le moule, une mal placée rate
  const keep = gb, realBest = games.best.gabarit, realStats = {...gbs}; gb = null; gbMute = true; gbNew();
  let shapes = true, fill = true, miss = true;
  for (let i = 0; i < 120; i++) {
    gb.rnd = seeded(i); gb.lvl = i % 15; gbLevel(); const m = gb.molds.find(x => x.real);
    const all = []; let p = gb.piece; for (let k = 0; k < 4; k++) { all.push(p, gbFlip(p)); p = gbRot(p); }
    const right = all.find(c => gbKey(c) === gbKey(m.cells)); if (!right) { shapes = false; continue; }
    gb.mode = 'play'; gb.piece = right; gb.px = m.x; gb.py = 0; gbDrop(); if (!gb.anim.ok) fill = false;
    gb.hearts = 3; gb.mode = 'play'; gbLevel(); const m2 = gb.molds.find(x => x.real); gb.piece = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]]; gb.px = Math.min(GB.COLS - 6, m2.x); gb.py = 0; gbDrop(); if (gb.anim.ok && m2.cells.length !== 6) miss = false;
  }
  console.assert(shapes && fill && miss, 'gabarit', {shapes, fill, miss});
  if (realBest === undefined) delete games.best.gabarit; else games.best.gabarit = realBest; Object.assign(gbs, realStats);
  gb = keep; gbMute = false;
}
ctx.onOpen(() => {
  if (!gb || !gb.g) { gbNew(); gb.g = $('gbCanvas').getContext('2d'); }
  gameLoop(gb, 'gabarit', gbUpdate, gbDraw); gbInfo();
});
}
