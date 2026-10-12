/* Cardi ecosystem — shared script */
(function () {
  var WA = '6281289895646';

  // mobile nav
  var t = document.querySelector('.nav-toggle');
  var n = document.getElementById('mainnav');
  if (t && n) {
    t.addEventListener('click', function () {
      var open = n.classList.toggle('open');
      t.setAttribute('aria-expanded', open ? 'true' : 'false');
      t.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    });
  }

  // forms -> WhatsApp message
  document.querySelectorAll('form[data-wa-form]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var lines = ['*' + (f.getAttribute('data-wa-title') || 'Pesan dari website') + '*'];
      var groups = {};
      Array.prototype.forEach.call(f.elements, function (el) {
        if (!el.name || el.type === 'submit') return;
        var label = '';
        if (el.type === 'checkbox') {
          if (!el.checked) return;
          var lg = el.closest('fieldset');
          label = lg ? lg.querySelector('legend').textContent : el.name;
          (groups[label] = groups[label] || []).push(el.value);
          return;
        }
        var l = f.querySelector('label[for="' + el.id + '"]');
        label = l ? l.textContent.replace(' *', '') : el.name;
        if (el.value.trim()) lines.push(label + ': ' + el.value.trim());
      });
      Object.keys(groups).forEach(function (k) { lines.push(k + ': ' + groups[k].join(', ')); });
      window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    });
  });

  // brand check quiz
  var quiz = document.getElementById('brand-quiz');
  if (quiz) {
    quiz.addEventListener('submit', function (e) {
      e.preventDefault();
      var pillars = ['dilihat', 'diingat', 'dipercaya'];
      var scores = {}, missing = 0;
      pillars.forEach(function (p) {
        var sum = 0, cnt = 0;
        quiz.querySelectorAll('[data-pillar="' + p + '"]').forEach(function (item) {
          var c = item.querySelector('input:checked');
          if (c) { sum += parseInt(c.value, 10); cnt++; } else { missing++; }
        });
        scores[p] = cnt ? Math.round(((sum / cnt) - 1) / 4 * 100) : 0;
      });
      var res = document.getElementById('quiz-result');
      var warn = document.getElementById('quiz-warn');
      if (missing) { warn.hidden = false; warn.textContent = 'Masih ada ' + missing + ' pernyataan yang belum dinilai.'; return; }
      warn.hidden = true;
      var total = Math.round((scores.dilihat + scores.diingat + scores.dipercaya) / 3);
      pillars.forEach(function (p) {
        res.querySelector('[data-bar="' + p + '"]').style.width = scores[p] + '%';
        res.querySelector('[data-val="' + p + '"]').textContent = scores[p];
      });
      res.querySelector('[data-total]').textContent = total;
      var weakest = pillars.slice().sort(function (a, b) { return scores[a] - scores[b]; })[0];
      var names = { dilihat: 'Dilihat', diingat: 'Diingat', dipercaya: 'Dipercaya' };
      var rec = res.querySelector('[data-rec]');
      var go = res.querySelector('[data-go]');
      var path;
      if (total < 60 || scores[weakest] < 50) {
        rec.textContent = 'Pilar terlemah: ' + names[weakest] + '. Brand kamu perlu dibangun dulu supaya penjualan berikutnya lebih mudah. Rekomendasi: mulai dengan tim ahli Cardi Nusantara (Brand Check Up lengkap).';
        path = 'Cardi Nusantara';
        go.href = go.getAttribute('data-nus');
        go.textContent = 'Ke Cardi Nusantara';
      } else {
        rec.textContent = 'Fondasi brand kamu sudah cukup kuat (pilar terlemah: ' + names[weakest] + '). Saatnya mengubah kepercayaan jadi penjualan. Rekomendasi: Cardi Agent AI untuk marketing, sales, dan retensi.';
        path = 'Cardi Agent AI';
        go.href = go.getAttribute('data-agent');
        go.textContent = 'Ke Cardi Agent AI';
      }
      var biz = (document.getElementById('q-bisnis') || {}).value || '';
      var msg = 'Halo Cardi, ini hasil Cek Brand saya' + (biz ? ' (' + biz + ')' : '') + ':\nDilihat ' + scores.dilihat + ' · Diingat ' + scores.diingat + ' · Dipercaya ' + scores.dipercaya + ' · Total ' + total + '/100\nRekomendasi: ' + path + '. Saya ingin konsultasi lanjutan.';
      res.querySelector('[data-wa]').href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
      res.hidden = false;
      res.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
})();
