// lancé par le test « local » de NeoDex : part, déplace et tourne la pièce, la lâche et vérifie qu'on passe à la manche suivante
// (avec NEO_SHOTS : garde des images du jeu, sans la teinte du thème : la pièce, l'arrivée, la fin après trois lâchers)
module.exports = async ({ pj, sleep }) => {
  const key = (k, type = 'keydown') => pj(`document.dispatchEvent(new KeyboardEvent('${type}', {key: '${k}', bubbles: true})), 0`);
  const label = () => pj(`document.getElementById('gbCanvas').getAttribute('aria-label')`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('gbCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'gabarit-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await shot('0-depart');
  await key('Enter'); await sleep(600);
  await key('ArrowLeft'); await key('ArrowUp'); await sleep(900); await shot('1-piece');
  await key(' '); await sleep(300); await shot('2-arrivee'); await sleep(1200);
  const first = await label();
  if (process.env.NEO_SHOTS) { for (let i = 0; i < 3; i++) { await sleep(400); await key(' '); await sleep(1100); } await sleep(1200); await shot('3-fin'); }
  const n = +(/manche (\d+)/.exec(first) || [])[1];
  if (!(n >= 2)) throw new Error('pas de manche suivante : « ' + first + ' »');
  return first;
};
