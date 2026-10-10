(() => {
  const STREAM_URL = 'https://sp0.redeaudio.com/8258/stream';
  const audio = document.getElementById('radioAudio');
  const button = document.getElementById('playButton');
  const icon = document.getElementById('playIcon');
  const label = document.getElementById('playLabel');
  const status = document.getElementById('playerStatus');

  audio.src = STREAM_URL;
  audio.preload = 'none';

  button.addEventListener('click', async () => {
    if (!audio.paused) { audio.pause(); return; }
    status.textContent = 'A ligar à emissão…';
    button.disabled = true;
    try { await audio.play(); }
    catch (err) {
      status.textContent = 'Não foi possível iniciar a emissão. Tenta abrir a emissão diretamente.';
      console.error('Falha ao reproduzir o streaming:', err);
    } finally { button.disabled = false; }
  });
  audio.addEventListener('playing', () => {
    status.textContent = 'Estás a ouvir a Rádio Sementes da Fé';
    icon.textContent = 'Ⅱ'; label.textContent = 'Pausar emissão';
    button.setAttribute('aria-label', 'Pausar emissão');
  });
  audio.addEventListener('pause', () => {
    status.textContent = 'Emissão em pausa'; icon.textContent = '▶';
    label.textContent = 'Ouvir em direto'; button.setAttribute('aria-label', 'Ouvir em direto');
  });
  audio.addEventListener('waiting', () => { status.textContent = 'A receber o sinal da rádio…'; });
  audio.addEventListener('error', () => {
    status.textContent = 'Não foi possível receber o áudio. Podes ouvir pelo endereço direto.';
    console.error('Erro de áudio:', audio.error);
  });

  document.getElementById('menuButton').addEventListener('click', () => {
    document.querySelector('.bottom-nav').scrollIntoView({ behavior: 'smooth', block: 'end' });
  });
  document.querySelectorAll('.nav-item').forEach(item => item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    item.classList.add('active');
  }));
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(err => console.warn('Service worker indisponível:', err)));
  }
})();