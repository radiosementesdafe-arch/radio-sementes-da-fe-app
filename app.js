
(() => {
  const STREAM_URL = 'https://sp0.redeaudio.com/8258/stream';

  const audio = document.getElementById('radioAudio');
  const button = document.getElementById('playButton');
  const icon = document.getElementById('playIcon');
  const label = document.getElementById('playLabel');
  const status = document.getElementById('playerStatus');

  if (!audio || !button || !icon || !label || !status) {
    console.error('Elementos do leitor de rádio não encontrados.');
    return;
  }

  audio.src = STREAM_URL;
  audio.preload = 'none';

  let isLoading = false;
  let playAttempt = 0;

  function setPlayerState(state) {
    button.classList.remove('is-playing', 'is-loading', 'is-error');

    if (state === 'playing') {
      isLoading = false;
      button.classList.add('is-playing');
      icon.textContent = 'Ⅱ';
      label.textContent = 'Pausar emissão';
      button.setAttribute('aria-label', 'Pausar emissão');
      button.setAttribute('aria-pressed', 'true');
      status.textContent = 'Estás a ouvir a Rádio Sementes da Fé';
    } else if (state === 'loading') {
      isLoading = true;
      button.classList.add('is-loading');
      icon.textContent = '…';
      label.textContent = 'A ligar à rádio…';
      button.setAttribute('aria-label', 'Cancelar ligação à rádio');
      button.setAttribute('aria-pressed', 'false');
      status.textContent = 'Estamos a ligar à emissão. Só um momento…';
    } else if (state === 'error') {
      isLoading = false;
      button.classList.add('is-error');
      icon.textContent = '▶';
      label.textContent = 'Tentar novamente';
      button.setAttribute('aria-label', 'Tentar ouvir novamente');
      button.setAttribute('aria-pressed', 'false');
      status.textContent = 'Não foi possível ligar. Verifica a ligação e tenta novamente.';
    } else {
      isLoading = false;
      icon.textContent = '▶';
      label.textContent = 'Ouvir em direto';
      button.setAttribute('aria-label', 'Ouvir em direto');
      button.setAttribute('aria-pressed', 'false');
      status.textContent = 'Carrega no botão para ouvir a rádio';
    }
  }

  button.addEventListener('click', () => {
    if (!audio.paused || isLoading) {
      playAttempt += 1;
      audio.pause();
      setPlayerState('paused');
      return;
    }

    setPlayerState('loading');
    const thisAttempt = ++playAttempt;

    try {
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.catch((err) => {
          if (thisAttempt !== playAttempt) return;
          setPlayerState('error');
          console.error('Falha ao reproduzir o streaming:', err);
        });
      }
    } catch (err) {
      setPlayerState('error');
      console.error('Falha ao iniciar o streaming:', err);
    }
  });

  audio.addEventListener('playing', () => setPlayerState('playing'));
  audio.addEventListener('pause', () => {
    if (!isLoading || audio.paused) setPlayerState('paused');
  });
  audio.addEventListener('waiting', () => {
    if (isLoading || !audio.paused) {
      status.textContent = 'A receber o sinal da rádio…';
    }
  });
  audio.addEventListener('stalled', () => {
    status.textContent = 'A ligação está demorada. A tentar receber a emissão…';
  });
  audio.addEventListener('error', () => {
    playAttempt += 1;
    setPlayerState('error');
    console.error('Erro de áudio:', audio.error);
  });

  const menuButton = document.getElementById('menuButton');
  if (menuButton) {
    menuButton.addEventListener('click', () => {
      const bottomNav = document.querySelector('.bottom-nav');
      if (bottomNav) {
        bottomNav.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    });
  }

  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
    });
  });

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(err => {
        console.warn('Service worker indisponível:', err);
      });
    });
  }

  setPlayerState('paused');
})();
