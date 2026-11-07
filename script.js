(function() {
  var track = document.getElementById('carrosselTrack');
  var dotsContainer = document.getElementById('carrDots');
  var slides = track ? track.querySelectorAll('.carr-slide') : [];
  var total = slides.length;
  var atual = 0;
  var visiveis = 3;
  function getVisiveis() { return window.innerWidth <= 600 ? 1 : 3; }
  function calcularLargura() {
    visiveis = getVisiveis();
    var outer = track.parentElement;
    var gap = 16;
    var largura = (outer.offsetWidth - gap * (visiveis - 1)) / visiveis;
    slides.forEach(function(s) { s.style.width = largura + 'px'; s.style.minWidth = largura + 'px'; });
    return largura;
  }
  function maxIndex() { return Math.max(0, total - visiveis); }
  function moverPara(index) {
    var largura = calcularLargura();
    var gap = 16;
    atual = Math.min(Math.max(index, 0), maxIndex());
    track.style.transform = 'translateX(-' + (atual * (largura + gap)) + 'px)';
    atualizarDots();
  }
  function atualizarDots() {
    var dots = dotsContainer.querySelectorAll('.carr-dot');
    dots.forEach(function(d, i) { d.classList.toggle('ativo', i === atual); });
  }
  function criarDots() {
    dotsContainer.innerHTML = '';
    var max = maxIndex();
    document.getElementById('carrosselWrapper').classList.toggle('sem-nav', max === 0);
    if (max === 0) return;
    for (var i = 0; i <= max; i++) {
      var btn = document.createElement('button');
      btn.className = 'carr-dot' + (i === 0 ? ' ativo' : '');
      btn.setAttribute('aria-label', 'Slide ' + (i + 1));
      (function(idx) { btn.addEventListener('click', function() { moverPara(idx); }); })(i);
      dotsContainer.appendChild(btn);
    }
  }
  window.moverCarrossel = function(dir) { moverPara(atual + dir); };
  var ultimaLargura = window.innerWidth;
  window.addEventListener('resize', function() {
    if (window.innerWidth === ultimaLargura) return;
    ultimaLargura = window.innerWidth;
    calcularLargura(); criarDots(); moverPara(0);
  });
  if (track && total > 0) {
    var inicioX = 0;
    track.addEventListener('touchstart', function(e) { inicioX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function(e) {
      var dx = e.changedTouches[0].clientX - inicioX;
      if (Math.abs(dx) > 40) moverPara(atual + (dx < 0 ? 1 : -1));
    });
    calcularLargura(); criarDots(); moverPara(0);
  }
})();

(function() {
  var FIM_LOTE_1 = new Date('2026-11-05T18:45:00-03:00').getTime();
  var contador = document.getElementById('contadorLote');
  var texto = document.getElementById('topbarTexto');
  if (!contador) return;
  function doisDigitos(n) { return (n < 10 ? '0' : '') + n; }
  function atualizar() {
    var resta = Math.floor((FIM_LOTE_1 - Date.now()) / 1000);
    if (resta <= 0) {
      texto.textContent = '2º LOTE ABERTO';
      contador.style.display = 'none';
      clearInterval(intervalo);
      return;
    }
    contador.textContent = doisDigitos(Math.floor(resta / 3600)) + ':' + doisDigitos(Math.floor(resta / 60) % 60) + ':' + doisDigitos(resta % 60);
  }
  var intervalo = setInterval(atualizar, 1000);
  atualizar();
})();
