
(() => {
  const STREAM_URL = 'https://sp0.redeaudio.com/8258/stream';

  const audio = document.getElementById('radioAudio');
  const button = document.getElementById('playButton');
  const icon = document.getElementById('playIcon');
  const label = document.getElementById('playLabel');
  const status = document.getElementById('playerStatus');

  audio.src = STREAM_URL;
  audio.preload = 'none';

  function setPlayerState(state) {
    button.classList.remove('is-playing', 'is-loading', 'is-error');

    if (state === 'playing') {
      button.classList.add('is-playing');
      icon.textContent = 'Ⅱ';
      label.textContent = 'Pausar emissão';
      button.setAttribute('aria-label', 'Pausar emissão');
      button.setAttribute('aria-pressed', 'true');
      status.textContent = 'Estás a ouvir a Rádio Sementes da Fé';
    } else if (state === 'loading') {
      button.classList.add('is-loading');
      icon.textContent = '…';
      label.textContent = 'A ligar à rádio…';
      button.setAttribute('aria-label', 'A ligar à rádio');
      button.setAttribute('aria-pressed', 'false');
      status.textContent = 'Estamos a ligar à emissão. Só um momento…';
    } else if (state === 'error') {
      button.classList.add('is-error');
      icon.textContent = '▶';
      label.textContent = 'Tentar novamente';
      button.setAttribute('aria-label', 'Tentar ouvir novamente');
      button.setAttribute('aria-pressed', 'false');
      status.textContent = 'Não foi possível ligar. Tenta novamente.';
    } else {
      icon.textContent = '▶';
      label.textContent = 'OUVIR EM DIRETO';
      button.setAttribute('aria-label', 'Ouvir em direto');
      button.setAttribute('aria-pressed', 'false');
      status.textContent = 'Carrega no botão para ouvir a rádio';
    }
  }

  button.addEventListener('click', async () => {
    if (!audio.paused) {
      audio.pause();
      return;
    }

    setPlayerState('loading');
    button.disabled = true;

    try {
      await audio.play();
    } catch (err) {
      setPlayerState('error');
      console.error('Falha ao reproduzir o streaming:', err);
    } finally {
      button.disabled = false;
    }
  });

  audio.addEventListener('playing', () => {
    setPlayerState('playing');
  });

  audio.addEventListener('pause', () => {
    setPlayerState('paused');
  });

  audio.addEventListener('waiting', () => {
    status.textContent = 'A receber o sinal da rádio…';
  });

  audio.addEventListener('error', () => {
    setPlayerState('error');
    console.error('Erro de áudio:', audio.error);
  });

  document.getElementById('menuButton').addEventListener('click', () => {
    document.querySelector('.bottom-nav').scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    });
  });

  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(nav => {
        nav.classList.remove('active');
      });

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
