(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ACCENT = [30, 79, 255];
  const INK = [10, 22, 51];

  /* ============ 1. TERMINAL HUD ============ */
  const hud = document.getElementById('hud');
  const hudExec = document.getElementById('hudExec');
  const hudPct = document.getElementById('hudPct');
  const hudProgress = document.getElementById('hudProgress');
  const heroEl = document.querySelector('.hero');
  const execEls = Array.from(document.querySelectorAll('[data-exec]'));

  let lastExec = '';
  let scrollTicking = false;

  function updateScrollHUD() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(100, Math.max(0, (y / max) * 100)) : 0;

    if (hud && heroEl) {
      hud.classList.toggle('show', y > heroEl.offsetHeight * 0.55);
    }
    if (hudProgress) hudProgress.style.width = pct + '%';
    if (hudPct) hudPct.textContent = String(Math.round(pct)).padStart(3, '0') + '%';

    if (hudExec && execEls.length) {
      let current = execEls[0];
      for (let i = 0; i < execEls.length; i++) {
        if (execEls[i].offsetTop <= y + 120) current = execEls[i];
      }
      const name = current ? current.getAttribute('data-exec') : '';
      if (name && name !== lastExec) {
        lastExec = name;
        hudExec.textContent = name;
      }
    }
    scrollTicking = false;
  }

  function onScroll() {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(updateScrollHUD);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  updateScrollHUD();

  /* ============ 2. SCROLL REVEAL ============ */
  const revealEls = document.querySelectorAll('.reveal');
  if (reduced) {
    revealEls.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('in'), i * 70);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ============ 3. HERO CHIP CANVAS ============ */
  function initChip() {
    const cv = document.getElementById('chipCanvas');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const N = 80; // dots across
    const CHIP0 = 0.24, CHIP1 = 0.76; // chip body bounds (normalised)
    const INSET = 0.05; // padding inside chip before the mark starts
    const PADS = [
      [0.5, 0.085], [0.5, 0.915], [0.085, 0.5], [0.915, 0.5],
      [0.16, 0.16], [0.84, 0.16], [0.16, 0.84], [0.84, 0.84],
    ];
    const PAD_HALF = 0.040;
    let W = 0, H = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      if (!W || !H) return;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Cardi mark: a horizontal lens (leaf) plus a small dot to its left
    function inMark(u, v) {
      const lx = (u - 0.585) / 0.415;
      const ly = (v - 0.5) / 0.152;
      if (Math.abs(lx) <= 1 && Math.abs(ly) <= 1 - lx * lx) return true;
      const dx = u - 0.065, dy = v - 0.5;
      return dx * dx + dy * dy <= 0.085 * 0.085;
    }

    function rgba(c, a) { return `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`; }

    function roundRect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    function draw(t) {
      if (!W || !H) return;
      ctx.clearRect(0, 0, W, H);
      const cell = W / N;
      const dotR = cell * 0.30;

      // dotted connectors from chip edge out to each pad
      ctx.strokeStyle = rgba(INK, 0.16);
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      const cx = 0.5, cy = 0.5;
      PADS.forEach(([px, py]) => {
        const dx = px - cx, dy = py - cy;
        const len = Math.hypot(dx, dy);
        const ux = dx / len, uy = dy / len;
        // start just outside the chip square, stop just before the pad
        const edge = Math.min(
          Math.abs((CHIP1 - 0.5) / (ux || 1e-6)),
          Math.abs((CHIP1 - 0.5) / (uy || 1e-6))
        );
        ctx.beginPath();
        ctx.moveTo((cx + ux * edge) * W, (cy + uy * edge) * H);
        ctx.lineTo((px - ux * PAD_HALF * 1.3) * W, (py - uy * PAD_HALF * 1.3) * H);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // chip body outline
      ctx.strokeStyle = rgba(INK, 0.5);
      ctx.lineWidth = 1;
      roundRect(CHIP0 * W, CHIP0 * H, (CHIP1 - CHIP0) * W, (CHIP1 - CHIP0) * H, cell * 1.2);
      ctx.stroke();

      // specular sweep: a soft band of light that travels across the mark, then rests
      const SWEEP_MS = 4600;
      const sp = (t % SWEEP_MS) / SWEEP_MS;
      // ease the band across the first 55% of the cycle, then hold dark
      const sweepPos = sp < 0.55 ? -0.3 + (sp / 0.55) * 1.6 : 9;
      const SWEEP_W = 0.19;

      // dot matrix
      const m0 = CHIP0 + INSET, span = (CHIP1 - INSET) - m0;
      const bloom = [];
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          const nx = (i + 0.5) / N, ny = (j + 0.5) / N;
          let isMark = false, col = null, base = 0;

          if (nx > m0 && nx < CHIP1 - INSET && ny > m0 && ny < CHIP1 - INSET) {
            if (inMark((nx - m0) / span, (ny - m0) / span)) { col = ACCENT; base = 0.92; isMark = true; }
          }
          if (!col) {
            for (const [px, py] of PADS) {
              if (Math.abs(nx - px) < PAD_HALF && Math.abs(ny - py) < PAD_HALF) {
                col = INK; base = 0.5; break;
              }
            }
          }
          if (!col) continue;

          // slow breathing base
          const wave = Math.sin(t * 0.0012 - (nx + ny) * 5.0) * 0.5 + 0.5;
          let a = base * (0.55 + 0.45 * wave);
          let shine = 0;

          if (isMark) {
            // band travelling along a gently tilted axis
            const axis = nx * 0.86 + ny * 0.14;
            const d = Math.abs(axis - sweepPos);
            if (d < SWEEP_W) {
              const e = 1 - d / SWEEP_W;
              shine = e * e * (3 - 2 * e); // smoothstep
            }
            // rare individual twinkles, deterministic per dot so they don't jitter
            const seed = ((i * 73856093) ^ (j * 19349663)) >>> 0;
            const phase = (seed % 997) / 997;
            const tw = Math.pow(Math.max(0, Math.sin(t * 0.0009 + phase * 6.283)), 26);
            shine = Math.min(1, shine + tw * 0.85);
            a = Math.min(1, a + shine * 0.75);
          }

          if (shine > 0.05) {
            // lift the hue toward white at the crest of the highlight
            const k = shine * 0.85;
            const r = Math.round(col[0] + (255 - col[0]) * k);
            const g = Math.round(col[1] + (255 - col[1]) * k);
            const b = Math.round(col[2] + (255 - col[2]) * k);
            ctx.fillStyle = `rgba(${r},${g},${b},${a.toFixed(3)})`;
            if (shine > 0.42) bloom.push([nx * W, ny * H, shine]);
          } else {
            ctx.fillStyle = rgba(col, a);
          }

          const s = dotR * (isMark ? 1 + shine * 0.28 : 1);
          ctx.fillRect(nx * W - s, ny * H - s, s * 2, s * 2);
        }
      }

      // soft bloom over the brightest dots - drawn last so it reads as light, not fill
      if (bloom.length) {
        ctx.globalCompositeOperation = 'lighter';
        for (let k = 0; k < bloom.length; k++) {
          const [bx, by, s] = bloom[k];
          const rr = dotR * 5.5;
          const gg = ctx.createRadialGradient(bx, by, 0, bx, by, rr);
          gg.addColorStop(0, `rgba(120,160,255,${(0.30 * s).toFixed(3)})`);
          gg.addColorStop(1, 'rgba(120,160,255,0)');
          ctx.fillStyle = gg;
          ctx.beginPath();
          ctx.arc(bx, by, rr, 0, 6.283);
          ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
      }
    }

    resize();
    if (reduced) {
      draw(0);
    } else {
      let raf = 0;
      const loop = (t) => { draw(t); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
      // pause when offscreen to save battery
      new IntersectionObserver((es) => {
        es.forEach((e) => {
          if (e.isIntersecting && !raf) raf = requestAnimationFrame(loop);
          else if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = 0; }
        });
      }, { threshold: 0 }).observe(cv);
    }
    window.addEventListener('resize', () => { resize(); if (reduced) draw(0); }, { passive: true });
  }
  initChip();

  /* ============ 4. PIXEL MATRIX BAND ============ */
  function initPixel() {
    const cv = document.getElementById('pixelCanvas');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const CELL = 13;
    let W = 0, H = 0, cols = 0, rows = 0, cells = [];

    function build() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      if (!W || !H) return;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(W / CELL); rows = Math.ceil(H / CELL);
      cells = new Array(cols * rows);
      for (let k = 0; k < cells.length; k++) cells[k] = Math.random();
    }

    function draw() {
      if (!W || !H) return;
      ctx.clearRect(0, 0, W, H);
      const s = CELL - 4;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const v = cells[j * cols + i];
          if (v > 0.955) ctx.fillStyle = `rgba(30,79,255,${(0.35 + (v - 0.955) * 12).toFixed(2)})`;
          else if (v > 0.72) ctx.fillStyle = 'rgba(10,22,51,0.07)';
          else continue;
          ctx.fillRect(i * CELL + 2, j * CELL + 2, s, s);
        }
      }
    }

    build(); draw();
    window.addEventListener('resize', () => { build(); draw(); }, { passive: true });

    if (!reduced) {
      let timer = null;
      const tick = () => {
        const n = Math.max(1, Math.round(cells.length * 0.035));
        for (let k = 0; k < n; k++) cells[(Math.random() * cells.length) | 0] = Math.random();
        draw();
      };
      new IntersectionObserver((es) => {
        es.forEach((e) => {
          if (e.isIntersecting && !timer) timer = setInterval(tick, 140);
          else if (!e.isIntersecting && timer) { clearInterval(timer); timer = null; }
        });
      }, { threshold: 0 }).observe(cv);
    }
  }
  initPixel();

  /* ============ 5. COUNT-UP HELPER ============ */
  function easeOut(p) { return 1 - Math.pow(1 - p, 3); }
  function countUp(el, from, to, dur, fmt) {
    if (reduced) { el.textContent = fmt(to); return; }
    const t0 = performance.now();
    function step(now) {
      const p = Math.min(1, (now - t0) / dur);
      el.textContent = fmt(Math.round(from + (to - from) * easeOut(p)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const idNum = (n) => n.toLocaleString('id-ID');

  // pixel band counter
  const pixelCount = document.getElementById('pixelCount');
  if (pixelCount) {
    const target = 128470;
    new IntersectionObserver((es, obs) => {
      es.forEach((e) => {
        if (e.isIntersecting) { countUp(pixelCount, 0, target, 1400, idNum); obs.disconnect(); }
      });
    }, { threshold: 0.4 }).observe(pixelCount);
  }

  /* ============ 6. HERO SCRAMBLE ============ */
  const scrambleEl = document.querySelector('[data-scramble]');
  if (scrambleEl && !reduced) {
    const finalText = scrambleEl.textContent || '';
    const pool = '01<>/\\_-▮▯#*';
    let frame = 0;
    const total = 26;
    scrambleEl.textContent = finalText.replace(/\S/g, '▮');
    setTimeout(() => {
      const timer = setInterval(() => {
        frame++;
        const revealTo = Math.floor((frame / total) * finalText.length);
        let out = '';
        for (let i = 0; i < finalText.length; i++) {
          const ch = finalText[i];
          if (i < revealTo || ch === ' ') out += ch;
          else out += pool[(Math.random() * pool.length) | 0];
        }
        scrambleEl.textContent = out;
        if (frame >= total) { clearInterval(timer); scrambleEl.textContent = finalText; }
      }, 28);
    }, 850);
  }

  /* ============ 7. SCATTER CHIPS ENTRANCE ============ */
  const scatter = document.getElementById('scatter');
  if (scatter && !reduced) {
    const chips = Array.from(scatter.querySelectorAll('.chip'));
    chips.forEach((c) => {
      c.style.opacity = '0';
      c.style.transform = `translate(${(Math.random() - 0.5) * 40}px, ${(Math.random() - 0.5) * 30}px)`;
    });
    new IntersectionObserver((es, obs) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        chips.forEach((c, i) => {
          setTimeout(() => { c.style.opacity = '1'; c.style.transform = 'translate(0,0)'; }, i * 80);
        });
        obs.disconnect();
      });
    }, { threshold: 0.3 }).observe(scatter);
  }

  /* ============ 8. ACCORDIONS ============ */
  document.querySelectorAll('.acc-item .acc-head').forEach((head) => {
    head.addEventListener('click', () => {
      const item = head.closest('.acc-item');
      if (!item) return;
      const willOpen = !item.classList.contains('open');
      item.classList.toggle('open', willOpen);
      head.setAttribute('aria-expanded', String(willOpen));
      const toggle = head.querySelector('.acc-toggle');
      if (toggle) toggle.textContent = willOpen ? '−' : '+';
    });
  });

  /* ============ 9. KNOWLEDGE GRAPH ============ */
  (function initGraph() {
    const cv = document.getElementById('kgCanvas');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const GROUPS = {
      core:   { name: 'Inti',      color: '#1e4fff' },
      kanal:  { name: 'Kanal',     color: '#3E80FF' },
      engine: { name: 'Otak',      color: '#8B7BFF' },
      data:   { name: 'Data',      color: '#00C2D1' },
      aksi:   { name: 'Agen',      color: '#4ADE80' },
      output: { name: 'Kendali',   color: '#FFB020' },
      integ:  { name: 'Integrasi', color: '#8794B8' },
    };

    const NODES = [
      { id: 'os', label: 'cardi-agent-os', group: 'core', r: 25, desc: 'Inti sistem. Semua kanal, data, agen, dan laporan bertemu di satu tempat - bukan tersebar di lima aplikasi.' },

      { id: 'wa', label: 'whatsapp', group: 'kanal', r: 16, desc: 'Terhubung lewat WhatsApp Business API resmi, bukan cara tidak resmi yang berisiko diblokir.' },
      { id: 'ig', label: 'instagram-dm', group: 'kanal', r: 12, desc: 'DM dan komentar Instagram masuk ke antrean yang sama, ditangani agen yang sama.' },
      { id: 'email', label: 'email', group: 'kanal', r: 12, desc: 'Inbox penjualan dan support dibaca, diklasifikasi, dan dibalas otomatis.' },
      { id: 'web', label: 'web-form', group: 'kanal', r: 11, desc: 'Form dan live chat di website Anda langsung jadi lead yang terkualifikasi.' },

      { id: 'nlp', label: 'reasoning-engine', group: 'engine', r: 19, desc: 'Membaca maksud sebenarnya dari setiap permintaan, lalu memutuskan agen mana yang harus bertindak.' },
      { id: 'ctx', label: 'memori-konteks', group: 'engine', r: 14, desc: 'Mengingat riwayat tiap pelanggan dan tiap proyek, jadi tidak menanyakan hal yang sama dua kali.' },
      { id: 'persona', label: 'persona-brand', group: 'engine', r: 14, desc: 'Nada bicara dan aturan main khas perusahaan Anda. Dikalibrasi saat onboarding, bukan default pabrik.' },
      { id: 'sop', label: 'sop-bisnis', group: 'engine', r: 14, desc: 'Prosedur internal Anda dikodekan jadi aturan yang dipatuhi setiap agen.' },

      { id: 'katalog', label: 'katalog', group: 'data', r: 15, desc: 'Produk, layanan, paket, dan harga. Sumber kebenaran untuk semua jawaban komersial.' },
      { id: 'dokumen', label: 'basis-dokumen', group: 'data', r: 13, desc: 'Kontrak, proposal, FAQ, dan materi internal - bisa dibaca dan dikutip agen saat menjawab.' },
      { id: 'stok', label: 'stok-operasional', group: 'data', r: 12, desc: 'Ketersediaan barang, slot, atau kapasitas tim - real-time, bukan tebakan.' },
      { id: 'pelanggan', label: 'data-pelanggan', group: 'data', r: 15, desc: 'Riwayat interaksi, order, dan preferensi. Tetap milik Anda, bisa diekspor kapan saja.' },

      { id: 'sales', label: 'sales-agent', group: 'aksi', r: 17, desc: 'Mengkualifikasi lead, menjawab pertanyaan produk, menyusun penawaran, dan mengejar closing.' },
      { id: 'support', label: 'support-agent', group: 'aksi', r: 15, desc: 'Menangani pertanyaan dan keluhan pelanggan sampai selesai, 24 jam.' },
      { id: 'billing', label: 'billing-agent', group: 'aksi', r: 14, desc: 'Menerbitkan invoice, memantau pembayaran, dan menagih dengan sopan tanpa merusak hubungan.' },
      { id: 'ops', label: 'ops-agent', group: 'aksi', r: 14, desc: 'Mengerjakan tugas berulang internal: input data, update status, rekap, dan pengingat tim.' },
      { id: 'eskalasi', label: 'eskalasi-manusia', group: 'aksi', r: 12, desc: 'Kalau agen ragu atau nilainya besar, pekerjaan diserahkan ke tim Anda. Tidak pernah menggantung.' },

      { id: 'dash', label: 'dashboard', group: 'output', r: 16, desc: 'Pipeline, konversi, beban kerja, dan biaya - semua terlihat di satu layar.' },
      { id: 'laporan', label: 'laporan-otomatis', group: 'output', r: 14, desc: 'Ringkasan harian dan bulanan dikirim sendiri ke tim dan manajemen Anda.' },
      { id: 'audit', label: 'jejak-audit', group: 'output', r: 12, desc: 'Setiap tindakan agen tercatat: apa yang dilakukan, kapan, dan atas dasar apa.' },

      { id: 'erp', label: 'erp-akuntansi', group: 'integ', r: 11, desc: 'Transaksi mengalir ke sistem pembukuan Anda tanpa entri ulang manual.' },
      { id: 'payment', label: 'payment-gateway', group: 'integ', r: 11, desc: 'Status pembayaran otomatis jadi pemicu tindakan agen berikutnya.' },
      { id: 'sheets', label: 'sheets-crm', group: 'integ', r: 11, desc: 'Sinkron dua arah dengan spreadsheet atau CRM yang sudah tim Anda pakai.' },
      { id: 'ads', label: 'ads-platform', group: 'integ', r: 11, desc: 'Lacak lead dari tiap campaign, jadi biaya akuisisi terlihat sampai level closing.' },
    ];

    const EDGES = [
      ['os', 'wa'], ['os', 'ig'], ['os', 'email'], ['os', 'web'], ['os', 'nlp'],
      ['os', 'katalog'], ['os', 'pelanggan'], ['os', 'dash'],
      ['wa', 'nlp'], ['ig', 'nlp'], ['email', 'nlp'], ['web', 'nlp'],
      ['nlp', 'ctx'], ['nlp', 'persona'], ['nlp', 'sop'],
      ['ctx', 'pelanggan'], ['sop', 'ops'],
      ['nlp', 'sales'], ['nlp', 'support'], ['nlp', 'billing'], ['nlp', 'eskalasi'],
      ['katalog', 'stok'], ['katalog', 'sales'], ['dokumen', 'support'], ['dokumen', 'sales'],
      ['sales', 'pelanggan'], ['support', 'wa'], ['sales', 'wa'],
      ['billing', 'payment'], ['billing', 'pelanggan'],
      ['dash', 'laporan'], ['dash', 'audit'],
      ['sales', 'dash'], ['billing', 'dash'], ['ops', 'dash'],
      ['katalog', 'sheets'], ['pelanggan', 'sheets'], ['billing', 'erp'],
      ['wa', 'ads'], ['eskalasi', 'audit'], ['ops', 'erp'],
    ];

    const byId = {};
    NODES.forEach((n) => { byId[n.id] = n; });
    const adj = {};
    NODES.forEach((n) => { adj[n.id] = new Set(); });
    EDGES.forEach(([a, b]) => { adj[a].add(b); adj[b].add(a); });

    /* --- layout seed: cluster rings --- */
    const groupOrder = Object.keys(GROUPS);
    NODES.forEach((n, i) => {
      if (n.group === 'core') { n.x = 0; n.y = 0; }
      else {
        const gi = groupOrder.indexOf(n.group);
        const ang = (gi / groupOrder.length) * Math.PI * 2 + (i % 4) * 0.34;
        const rad = 150 + (i % 5) * 26;
        n.x = Math.cos(ang) * rad;
        n.y = Math.sin(ang) * rad;
      }
      n.vx = 0; n.vy = 0;
    });

    /* --- state --- */
    let W = 0, H = 0;
    const cam = { x: 0, y: 0, z: 1 };
    const home = { x: 0, y: 0, z: 1 };
    let hoverId = null, selectedId = null, legendGroup = null;
    let dragNode = null, panning = false;
    let ptr = { x: 0, y: 0 }, moved = 0;
    const pulses = [];
    let running = false, rafId = 0, lastT = 0;

    /* --- geometry helpers --- */
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      if (!W || !H) return;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // frame the whole graph inside the stage, leaving room for legend + labels
    function fitView() {
      if (!W || !H) return;
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (let i = 0; i < NODES.length; i++) {
        const n = NODES[i];
        if (n.x - n.r < minX) minX = n.x - n.r;
        if (n.x + n.r > maxX) maxX = n.x + n.r;
        if (n.y - n.r < minY) minY = n.y - n.r;
        if (n.y + n.r > maxY) maxY = n.y + n.r;
      }
      const gw = Math.max(1, maxX - minX), gh = Math.max(1, maxY - minY);
      const padX = W > 700 ? 150 : 40;
      const padY = 60;
      const z = Math.min((W - padX * 2) / gw, (H - padY * 2) / gh);
      cam.z = Math.max(0.4, Math.min(1.9, z));
      cam.x = (minX + maxX) / 2;
      cam.y = (minY + maxY) / 2;
      home.z = cam.z; home.x = cam.x; home.y = cam.y;
      cam.userMoved = false;
    }

    function toScreen(x, y) { return [(x - cam.x) * cam.z + W / 2, (y - cam.y) * cam.z + H / 2]; }
    function toWorld(x, y) { return [(x - W / 2) / cam.z + cam.x, (y - H / 2) / cam.z + cam.y]; }

    function hexA(hex, a) {
      const v = parseInt(hex.slice(1), 16);
      return `rgba(${(v >> 16) & 255},${(v >> 8) & 255},${v & 255},${a})`;
    }

    /* --- physics --- */
    const REPULSE = 14000, SPRING = 0.046, REST = 122, DAMP = 0.86, GRAV = 0.0072;
    function physics() {
      const n = NODES.length;
      for (let i = 0; i < n; i++) {
        const a = NODES[i];
        for (let j = i + 1; j < n; j++) {
          const b = NODES[j];
          let dx = b.x - a.x, dy = b.y - a.y;
          let d2 = dx * dx + dy * dy;
          if (d2 < 40) d2 = 40;
          const d = Math.sqrt(d2);
          const f = REPULSE / d2;
          const fx = (dx / d) * f, fy = (dy / d) * f;
          a.vx -= fx; a.vy -= fy;
          b.vx += fx; b.vy += fy;
        }
      }
      for (let k = 0; k < EDGES.length; k++) {
        const a = byId[EDGES[k][0]], b = byId[EDGES[k][1]];
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 1;
        const f = (d - REST) * SPRING;
        const fx = (dx / d) * f, fy = (dy / d) * f;
        a.vx += fx; a.vy += fy;
        b.vx -= fx; b.vy -= fy;
      }
      for (let i = 0; i < n; i++) {
        const nd = NODES[i];
        const g = nd.group === 'core' ? 0.06 : GRAV;
        // anisotropic pull: looser on x so the field spreads into the wide stage
        nd.vx -= nd.x * g * 0.5;
        nd.vy -= nd.y * g * 1.9;
        if (nd === dragNode) { nd.vx = 0; nd.vy = 0; continue; }
        nd.vx *= DAMP; nd.vy *= DAMP;
        const sp = Math.hypot(nd.vx, nd.vy);
        if (sp > 14) { nd.vx = (nd.vx / sp) * 14; nd.vy = (nd.vy / sp) * 14; }
        nd.x += nd.vx; nd.y += nd.vy;
      }
    }

    /* --- pulses --- */
    let spawnAcc = 0;
    function updatePulses(dt) {
      spawnAcc += dt;
      if (spawnAcc > 90 && pulses.length < 46) {
        spawnAcc = 0;
        pulses.push({ e: (Math.random() * EDGES.length) | 0, t: 0, s: 0.005 + Math.random() * 0.007 });
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        pulses[i].t += pulses[i].s * (dt / 16.67);
        if (pulses[i].t >= 1) pulses.splice(i, 1);
      }
    }

    /* --- draw --- */
    function draw() {
      if (!W || !H) return;
      ctx.clearRect(0, 0, W, H);

      const glow = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.62);
      glow.addColorStop(0, 'rgba(30,79,255,0.10)');
      glow.addColorStop(1, 'rgba(4,16,44,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      const active = hoverId || selectedId;
      let live = null;
      if (active) { live = new Set(adj[active]); live.add(active); }
      else if (legendGroup) {
        live = new Set();
        NODES.forEach((n) => { if (n.group === legendGroup) live.add(n.id); });
      }

      // edges
      for (let k = 0; k < EDGES.length; k++) {
        const ai = EDGES[k][0], bi = EDGES[k][1];
        const a = byId[ai], b = byId[bi];
        const on = !live || (live.has(ai) && live.has(bi));
        const p1 = toScreen(a.x, a.y), p2 = toScreen(b.x, b.y);
        ctx.strokeStyle = on ? 'rgba(126,156,255,0.32)' : 'rgba(126,156,255,0.055)';
        ctx.lineWidth = on ? 1.1 : 0.8;
        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.stroke();
      }

      // pulses
      for (let i = 0; i < pulses.length; i++) {
        const p = pulses[i];
        const ai = EDGES[p.e][0], bi = EDGES[p.e][1];
        const a = byId[ai], b = byId[bi];
        const on = !live || (live.has(ai) && live.has(bi));
        const wx = a.x + (b.x - a.x) * p.t, wy = a.y + (b.y - a.y) * p.t;
        const s = toScreen(wx, wy);
        const col = GROUPS[b.group].color;
        const fade = Math.sin(p.t * Math.PI);
        ctx.globalAlpha = (on ? 0.95 : 0.1) * fade;
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(s[0], s[1], 2.4 * cam.z, 0, 6.283);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // nodes
      ctx.textAlign = 'center';
      for (let i = 0; i < NODES.length; i++) {
        const n = NODES[i];
        const on = !live || live.has(n.id);
        const s = toScreen(n.x, n.y);
        const r = n.r * cam.z;
        const col = GROUPS[n.group].color;
        const isActive = n.id === active;

        if (on) {
          const g2 = ctx.createRadialGradient(s[0], s[1], r * 0.5, s[0], s[1], r * 2.6);
          g2.addColorStop(0, hexA(col, isActive ? 0.45 : 0.26));
          g2.addColorStop(1, hexA(col, 0));
          ctx.fillStyle = g2;
          ctx.beginPath();
          ctx.arc(s[0], s[1], r * 2.6, 0, 6.283);
          ctx.fill();
        }

        ctx.globalAlpha = on ? 1 : 0.16;
        ctx.fillStyle = '#071634';
        ctx.beginPath();
        ctx.arc(s[0], s[1], r, 0, 6.283);
        ctx.fill();
        ctx.strokeStyle = col;
        ctx.lineWidth = isActive ? 2.4 : 1.4;
        ctx.stroke();

        if (n.group === 'core') {
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.arc(s[0], s[1], r * 0.32, 0, 6.283);
          ctx.fill();
        }

        // keep small satellite labels hidden until they matter, so the field stays legible
        const showLabel = n.r > 11 || cam.z > 1.25 || isActive || (live && live.has(n.id) && active);
        if (showLabel) {
          const fs = Math.max(9, 10 * cam.z);
          ctx.font = `${fs}px ui-monospace, SFMono-Regular, Menlo, monospace`;
          ctx.fillStyle = on ? (isActive ? '#FFFFFF' : '#AEBBD8') : 'rgba(174,187,216,0.28)';
          ctx.fillText(n.label, s[0], s[1] + r + fs + 3);
        }
        ctx.globalAlpha = 1;
      }
    }

    /* --- loop --- */
    function frame(t) {
      const dt = Math.min(48, t - lastT || 16);
      lastT = t;
      physics();
      updatePulses(dt);
      draw();
      rafId = requestAnimationFrame(frame);
    }
    function start() { if (!running) { running = true; lastT = performance.now(); rafId = requestAnimationFrame(frame); } }
    function stop() { if (running) { running = false; cancelAnimationFrame(rafId); } }

    /* --- hit test --- */
    function nodeAt(sx, sy) {
      const w = toWorld(sx, sy);
      let best = null, bestD = Infinity;
      for (let i = 0; i < NODES.length; i++) {
        const n = NODES[i];
        const d = Math.hypot(n.x - w[0], n.y - w[1]);
        if (d < n.r + 8 && d < bestD) { best = n; bestD = d; }
      }
      return best;
    }

    /* --- detail panel --- */
    const panel = document.getElementById('kgPanel');
    const pSw = document.getElementById('kgPanelSw');
    const pGroup = document.getElementById('kgPanelGroup');
    const pTitle = document.getElementById('kgPanelTitle');
    const pDesc = document.getElementById('kgPanelDesc');
    const pLinks = document.getElementById('kgPanelLinks');

    function showPanel(n) {
      if (!panel) return;
      const g = GROUPS[n.group];
      pSw.style.background = g.color;
      pGroup.textContent = g.name;
      pTitle.textContent = n.label;
      pDesc.textContent = n.desc;
      const names = Array.from(adj[n.id]).map((id) => byId[id].label);
      pLinks.textContent = `${names.length} relasi → ${names.slice(0, 3).join(', ')}${names.length > 3 ? '…' : ''}`;
      panel.classList.add('show');
    }
    function hidePanel() { if (panel) panel.classList.remove('show'); selectedId = null; }
    const pClose = document.getElementById('kgPanelClose');
    if (pClose) pClose.addEventListener('click', hidePanel);

    /* --- pointer interaction --- */
    function localPt(e) {
      const r = cv.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    cv.addEventListener('pointerdown', (e) => {
      const p = localPt(e);
      ptr = p; moved = 0;
      const n = nodeAt(p.x, p.y);
      if (n) { dragNode = n; cv.classList.add('grabbing'); }
      else { panning = true; cv.classList.add('grabbing'); }
      cv.setPointerCapture(e.pointerId);
    });

    cv.addEventListener('pointermove', (e) => {
      const p = localPt(e);
      const dx = p.x - ptr.x, dy = p.y - ptr.y;

      if (dragNode) {
        moved += Math.abs(dx) + Math.abs(dy);
        const w = toWorld(p.x, p.y);
        dragNode.x = w[0]; dragNode.y = w[1];
        dragNode.vx = 0; dragNode.vy = 0;
        ptr = p;
        return;
      }
      if (panning) {
        moved += Math.abs(dx) + Math.abs(dy);
        cam.x -= dx / cam.z; cam.y -= dy / cam.z;
        cam.userMoved = true;
        ptr = p;
        return;
      }
      const n = nodeAt(p.x, p.y);
      const id = n ? n.id : null;
      if (id !== hoverId) { hoverId = id; cv.classList.toggle('pointing', !!id); }
      ptr = p;
    });

    function endPointer(e) {
      if (moved < 5) {
        const p = localPt(e);
        const n = nodeAt(p.x, p.y);
        if (n) { selectedId = n.id; showPanel(n); }
        else { hidePanel(); }
      }
      dragNode = null; panning = false;
      cv.classList.remove('grabbing');
    }
    cv.addEventListener('pointerup', endPointer);
    cv.addEventListener('pointercancel', () => { dragNode = null; panning = false; cv.classList.remove('grabbing'); });
    cv.addEventListener('pointerleave', () => { hoverId = null; cv.classList.remove('pointing'); });

    // zoom: ctrl/cmd + wheel only, so plain scrolling still moves the page
    cv.addEventListener('wheel', (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const p = localPt(e);
      zoomAt(p.x, p.y, e.deltaY < 0 ? 1.12 : 1 / 1.12);
    }, { passive: false });

    function zoomAt(sx, sy, factor) {
      const w = toWorld(sx, sy);
      cam.z = Math.max(0.45, Math.min(2.6, cam.z * factor));
      cam.x = w[0] - (sx - W / 2) / cam.z;
      cam.y = w[1] - (sy - H / 2) / cam.z;
      cam.userMoved = true;
    }

    const zIn = document.getElementById('kgZoomIn');
    const zOut = document.getElementById('kgZoomOut');
    const zReset = document.getElementById('kgReset');
    if (zIn) zIn.addEventListener('click', () => zoomAt(W / 2, H / 2, 1.22));
    if (zOut) zOut.addEventListener('click', () => zoomAt(W / 2, H / 2, 1 / 1.22));
    if (zReset) {
      zReset.addEventListener('click', () => {
        legendGroup = null; hidePanel();
        buildLegend();
        NODES.forEach((n, i) => {
          if (n.group === 'core') { n.x = 0; n.y = 0; }
          else {
            const gi = groupOrder.indexOf(n.group);
            const ang = (gi / groupOrder.length) * Math.PI * 2 + (i % 4) * 0.34;
            const rad = 150 + (i % 5) * 26;
            n.x = Math.cos(ang) * rad; n.y = Math.sin(ang) * rad;
          }
          n.vx = 0; n.vy = 0;
        });
        for (let i = 0; i < 320; i++) physics();
        fitView();
      });
    }

    /* --- legend (click to isolate a cluster) --- */
    const legendEl = document.getElementById('kgLegend');
    function buildLegend() {
      if (!legendEl) return;
      legendEl.innerHTML = Object.keys(GROUPS)
        .map((k) => `<button class="kg-leg${legendGroup === k ? ' on' : ''}" data-g="${k}"><span class="sw" style="background:${GROUPS[k].color}"></span>${GROUPS[k].name}</button>`)
        .join('');
      legendEl.querySelectorAll('.kg-leg').forEach((b) => {
        b.addEventListener('click', () => {
          const g = b.getAttribute('data-g');
          legendGroup = legendGroup === g ? null : g;
          hidePanel();
          buildLegend();
        });
      });
    }
    buildLegend();

    /* --- lifecycle --- */
    resize();
    // settle the layout before the first paint so it opens already formed
    for (let i = 0; i < 320; i++) physics();
    fitView();

    window.addEventListener('resize', () => {
      resize();
      if (!cam.userMoved) fitView();
      if (reduced) draw();
    }, { passive: true });

    if (reduced) {
      draw();
    } else {
      new IntersectionObserver((es) => {
        es.forEach((e) => { if (e.isIntersecting) start(); else stop(); });
      }, { threshold: 0 }).observe(cv);
    }
  })();

  /* ============ 10. FOLDER BROWSER ============ */
  const personas = {
    fnb: { label: 'retail-ecommerce.', roster: ['sales-agent', 'support-agent', 'billing-agent', 'stock-sync-agent', 'review-agent'] },
    fashion: { label: 'jasa-profesional.', roster: ['lead-qualifier-agent', 'proposal-agent', 'scheduling-agent', 'follow-up-agent', 'onboarding-agent'] },
    jasa: { label: 'distribusi-b2b.', roster: ['order-intake-agent', 'quotation-agent', 'collection-agent', 'reorder-agent', 'sales-report-agent'] },
    enterprise: { label: 'enterprise.', roster: ['multi-divisi-agent', 'sop-compliance-agent', 'integrasi-erp-agent', 'audit-agent', 'analytics-agent'] },
  };
  const browserSide = document.getElementById('browserSide');
  const browserRosterTitle = document.getElementById('browserRosterTitle');
  const browserRoster = document.getElementById('browserRoster');
  if (browserSide && browserRoster) {
    browserSide.querySelectorAll('.browser-folder').forEach((folder) => {
      folder.addEventListener('click', () => {
        const key = folder.getAttribute('data-persona');
        const data = key ? personas[key] : null;
        if (!data) return;
        browserSide.querySelectorAll('.browser-folder').forEach((f) => f.classList.remove('active'));
        folder.classList.add('active');
        if (browserRosterTitle) browserRosterTitle.textContent = 'ROSTER · ' + data.label;
        browserRoster.innerHTML = data.roster
          .map((r, i) => `<span class="roster-chip" style="animation-delay:${i * 55}ms">${r}</span>`)
          .join('');
      });
    });
  }

  /* ============ 11. TOOLS CAROUSEL ============ */
  const track = document.getElementById('toolTrack');
  const prevBtn = document.getElementById('carPrev');
  const nextBtn = document.getElementById('carNext');
  const countEl = document.getElementById('carCount');
  if (track && prevBtn && nextBtn && countEl && track.children.length) {
    const total = track.children.length;
    const step = () => track.children[0].getBoundingClientRect().width + 18;
    const updateCount = () => {
      const idx = Math.round(track.scrollLeft / step());
      countEl.textContent = String(Math.min(idx + 1, total)).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
    };
    prevBtn.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    nextBtn.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    track.addEventListener('scroll', updateCount, { passive: true });
    updateCount();
  }

  /* ============ 12. ROI CALCULATOR ============ */
  const roiChips = document.getElementById('roiChips');
  const roiOutput = document.getElementById('roiOutput');
  const roiManualLabel = document.getElementById('roiManualLabel');
  const roiAgentBar = document.getElementById('roiAgentBar');
  const roiDiff = document.getElementById('roiDiff');
  const AGENT_ANNUAL = 35999988;
  const rupiah = (n) => 'Rp ' + n.toLocaleString('id-ID');

  let roiCurrent = 60000000;
  function updateRoi(rate) {
    const annual = rate * 2 * 12;
    if (roiOutput) countUp(roiOutput, roiCurrent, annual, 650, rupiah);
    if (roiManualLabel) roiManualLabel.textContent = rupiah(annual);
    if (roiDiff) {
      const diff = annual - AGENT_ANNUAL;
      roiDiff.textContent = (diff >= 0 ? '' : '−') + rupiah(Math.abs(diff)).replace('Rp ', 'Rp ');
      roiDiff.style.color = diff >= 0 ? '#4ADE80' : '#EF4444';
    }
    if (roiAgentBar) {
      roiAgentBar.style.width = Math.min(100, Math.max(12, (AGENT_ANNUAL / annual) * 100)) + '%';
    }
    roiCurrent = annual;
  }
  if (roiChips) {
    roiChips.querySelectorAll('.roi-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        roiChips.querySelectorAll('.roi-chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        updateRoi(Number(chip.getAttribute('data-rate')));
      });
    });
    updateRoi(2500000);
  }

  /* ============ 13. COUNTDOWN ============ */
  const cdD = document.getElementById('cdD');
  const cdH = document.getElementById('cdH');
  const cdM = document.getElementById('cdM');
  const cdS = document.getElementById('cdS');
  if (cdD && cdH && cdM && cdS) {
    const target = new Date();
    target.setDate(target.getDate() + 5);
    target.setHours(23, 59, 59, 0);
    const pad = (n) => String(n).padStart(2, '0');
    function tick() {
      const diff = Math.max(0, target.getTime() - Date.now());
      cdD.textContent = pad(Math.floor(diff / 86400000));
      cdH.textContent = pad(Math.floor((diff % 86400000) / 3600000));
      cdM.textContent = pad(Math.floor((diff % 3600000) / 60000));
      cdS.textContent = pad(Math.floor((diff % 60000) / 1000));
    }
    tick();
    setInterval(tick, 1000);
  }
})();
