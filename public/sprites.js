// Pixel-art sprites: shapes are drawn on a tiny canvas, then alpha is snapped to 0/255 so edges stay crisp when scaled up.
(function () {
  const cache = new Map();

  const PLANES = {
    tanbinh: { name: 'Tân Binh', body: '#f4f6fb', belly: '#d7deeb', tail: '#e3262f', stripe: '#e3262f', wing: '#c3cbdc', star: true },
    cotruong: { name: 'Cơ Trưởng', body: '#f4f6fb', belly: '#cfdaf0', tail: '#2f6fe0', stripe: '#2f6fe0', wing: '#9fb4dc', cap: true },
    sieuthanh: { name: 'Siêu Thanh', body: '#d9dde6', belly: '#aab2c2', tail: '#8a93a6', stripe: '#3d4a66', wing: '#7c8599', pointy: true },
    chop: { name: 'Chớp', body: '#ef3b2c', belly: '#c22a1e', tail: '#ef3b2c', stripe: '#ffd23f', wing: '#b8261b', prop: true, bolt: true },
    quaixe: { name: 'Quái Xế', body: '#4b2d6f', belly: '#35204f', tail: '#ff4f9a', stripe: '#ff4f9a', wing: '#2b1a40', pointy: true },
    mascot: { body: '#f7f8fc', belly: '#dfe4ef', tail: '#ff4f9a', stripe: '#ff4f9a', wing: '#c9d0e0', face: true, chubby: true },
  };

  function snapAlpha(ctx, w, h) {
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    for (let i = 3; i < d.length; i += 4) d[i] = d[i] > 110 ? 255 : 0;
    ctx.putImageData(img, 0, 0);
  }

  function canvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return [c, c.getContext('2d')];
  }

  function poly(ctx, pts, fill) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    ctx.fill();
  }

  // 48x30 plane facing right. mood (mascot only): 'sleep' | 'awake' | 'angry'
  function plane(kind, mood = 'awake') {
    const key = `plane:${kind}:${mood}`;
    if (cache.has(key)) return cache.get(key);
    const p = PLANES[kind] || PLANES.tanbinh;
    const W = 48, H = 30;
    const [c, ctx] = canvas(W, H);
    const top = p.chubby ? 8 : 11;
    const bot = p.chubby ? 24 : 21;
    const mid = (top + bot) / 2;
    const body = mood === 'angry' ? '#ffb3b3' : p.body;

    // outline pass, then fill pass slightly inset
    const shape = (fill, inset) => {
      poly(ctx, [[5 + inset, top + 1], [3 + inset, 2 + inset], [11 - inset, 2 + inset], [17, top + inset]], fill === 'o' ? '#1b2340' : p.tail);
      ctx.fillStyle = fill === 'o' ? '#1b2340' : body;
      ctx.beginPath();
      if (p.pointy) {
        ctx.moveTo(6 + inset, top + inset);
        ctx.lineTo(36, top + inset);
        ctx.lineTo(47 - inset * 2, mid + 1);
        ctx.lineTo(36, bot - inset);
        ctx.lineTo(6 + inset, bot - inset);
      } else {
        const r = (bot - top) / 2 - inset;
        ctx.moveTo(6 + inset, top + inset);
        ctx.lineTo(42 - r, top + inset);
        ctx.arc(42 - r, mid, r, -Math.PI / 2, Math.PI / 2);
        ctx.lineTo(6 + inset, bot - inset);
      }
      ctx.closePath();
      ctx.fill();
    };
    shape('o', 0);
    shape('f', 1);

    ctx.fillStyle = p.belly;
    ctx.fillRect(7, bot - 4, p.pointy ? 30 : 32, 2);
    ctx.fillStyle = p.stripe;
    ctx.fillRect(7, mid + 1, p.pointy ? 30 : 30, 1);

    if (!p.face) {
      ctx.fillStyle = '#5fb7ff';
      for (let x = 15; x <= 33; x += 3) ctx.fillRect(x, mid - 2, 2, 2);
      ctx.fillStyle = '#1b2340';
      ctx.fillRect(p.pointy ? 37 : 38, mid - 3, 4, 2);
    }

    // wing + engine
    poly(ctx, [[18, mid + 2], [29, mid + 2], [22, H - 2], [16, H - 2]], '#1b2340');
    poly(ctx, [[19, mid + 3], [28, mid + 3], [22, H - 3], [17, H - 3]], p.wing);
    if (!p.pointy && !p.prop) {
      ctx.fillStyle = '#1b2340';
      ctx.fillRect(24, bot - 1, 7, 4);
      ctx.fillStyle = '#9aa6bf';
      ctx.fillRect(25, bot, 5, 2);
    }

    if (p.prop) {
      ctx.fillStyle = '#1b2340';
      ctx.fillRect(44, mid - 8, 2, 16);
      ctx.fillStyle = '#ffd23f';
      ctx.fillRect(43, mid - 1, 3, 3);
    }
    if (p.star) {
      ctx.fillStyle = '#ffd23f';
      ctx.fillRect(7, 5, 3, 3);
      ctx.fillRect(8, 4, 1, 5);
      ctx.fillRect(6, 6, 5, 1);
    }
    if (p.bolt) poly(ctx, [[20, top + 2], [26, top + 2], [23, mid], [28, mid], [19, bot - 2], [22, mid + 1], [17, mid + 1]], '#ffd23f');
    if (p.cap) {
      ctx.fillStyle = '#1b2340';
      ctx.fillRect(31, top - 4, 9, 4);
      ctx.fillRect(29, top - 1, 13, 2);
      ctx.fillStyle = '#ffd23f';
      ctx.fillRect(34, top - 3, 3, 2);
    }
    if (p.face) {
      ctx.fillStyle = '#1b2340';
      const ex = 29, ey = mid - 2;
      if (mood === 'sleep') {
        ctx.fillRect(ex - 1, ey + 1, 4, 1);
        ctx.fillRect(ex + 6, ey + 1, 4, 1);
      } else {
        ctx.fillRect(ex, ey, 2, 3);
        ctx.fillRect(ex + 6, ey, 2, 3);
        if (mood === 'angry') {
          ctx.fillRect(ex - 2, ey - 3, 4, 1);
          ctx.fillRect(ex - 1, ey - 2, 2, 1);
          ctx.fillRect(ex + 6, ey - 3, 4, 1);
          ctx.fillRect(ex + 6, ey - 2, 2, 1);
          ctx.fillRect(ex + 2, ey + 5, 4, 1);
        }
      }
      ctx.fillStyle = mood === 'angry' ? '#ff4f4f' : '#ffa3c4';
      ctx.fillRect(ex - 2, ey + 4, 3, 2);
      ctx.fillRect(ex + 8, ey + 4, 2, 2);
      ctx.fillStyle = '#5fb7ff';
      for (let x = 12; x <= 22; x += 4) ctx.fillRect(x, mid - 2, 2, 2);
    }
    snapAlpha(ctx, W, H);
    const url = c.toDataURL();
    cache.set(key, url);
    return url;
  }

  function cloud(seed) {
    const key = `cloud:${seed}`;
    if (cache.has(key)) return cache.get(key);
    const W = 40, H = 16;
    const [c, ctx] = canvas(W, H);
    const blobs = [[10, 11, 7], [20, 8, 8], [30, 11, 6], [16, 12, 5], [25, 12, 6]];
    ctx.fillStyle = '#ffffff';
    for (const [x, y, r] of blobs) {
      ctx.beginPath();
      ctx.arc(x + ((seed * 3) % 4) - 2, y, r - (seed % 2), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillRect(4, 12, 32, 4);
    snapAlpha(ctx, W, H);
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = '#dbeaf9';
    ctx.fillRect(0, 13, W, 3);
    const url = c.toDataURL();
    cache.set(key, url);
    return url;
  }

  function mountains() {
    if (cache.has('mtn')) return cache.get('mtn');
    const W = 160, H = 30;
    const [c, ctx] = canvas(W, H);
    poly(ctx, [[0, 30], [0, 18], [18, 8], [34, 16], [52, 4], [74, 15], [92, 7], [112, 17], [130, 6], [150, 14], [160, 10], [160, 30]], '#7da7d9');
    poly(ctx, [[0, 30], [0, 24], [24, 15], [46, 22], [70, 13], [96, 23], [120, 14], [144, 22], [160, 18], [160, 30]], '#5d8cc8');
    snapAlpha(ctx, W, H);
    const url = c.toDataURL();
    cache.set('mtn', url);
    return url;
  }

  function airport() {
    if (cache.has('airport')) return cache.get('airport');
    const W = 120, H = 60;
    const [c, ctx] = canvas(W, H);
    // tower
    ctx.fillStyle = '#c9d2e3'; ctx.fillRect(14, 20, 8, 40);
    ctx.fillStyle = '#9fadc7'; ctx.fillRect(20, 20, 2, 40);
    ctx.fillStyle = '#1b2340'; ctx.fillRect(8, 10, 20, 9);
    ctx.fillStyle = '#ffd86b'; ctx.fillRect(10, 12, 16, 4);
    ctx.fillStyle = '#e8edf6'; ctx.fillRect(7, 8, 22, 2); ctx.fillRect(7, 19, 22, 2);
    ctx.fillStyle = '#1b2340'; ctx.fillRect(17, 2, 1, 6);
    ctx.fillStyle = '#ff4f4f'; ctx.fillRect(16, 1, 3, 2);
    // terminal
    ctx.fillStyle = '#dfe5f0'; ctx.fillRect(24, 40, 90, 20);
    ctx.fillStyle = '#8e9bb5'; ctx.fillRect(24, 38, 90, 3);
    ctx.fillStyle = '#2b3a63'; ctx.fillRect(28, 44, 82, 10);
    ctx.fillStyle = '#ffd86b';
    for (let x = 30; x < 108; x += 6) ctx.fillRect(x, 46, 4, 6);
    const url = c.toDataURL();
    cache.set('airport', url);
    return url;
  }

  window.Sprites = { PLANES, plane, cloud, mountains, airport };
})();
