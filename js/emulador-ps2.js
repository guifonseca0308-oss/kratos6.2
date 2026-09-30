document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('game-file');
  const filePanel = document.getElementById('file-panel');
  const fileStatus = document.getElementById('file-status');
  const fileTitle = document.getElementById('file-title');
  const fullscreenButton = document.getElementById('fullscreen-button');
  let selectedGame = '';

  async function playFromDesktop(button) {
    button.disabled = true;
    filePanel.hidden = false;
    fileTitle.textContent = selectedGame === 'gow1' ? 'God of War' : 'God of War II';
    fileStatus.textContent = 'Verificando PCSX2 e arquivo do jogo...';
    filePanel.scrollIntoView({ behavior: 'smooth', block: 'center' });

    try {
      const result = await window.kratosDesktop.playGame(selectedGame);
      fileStatus.textContent = result.message;
    } catch {
      fileStatus.textContent = 'Não foi possível acessar o launcher desktop.';
    } finally {
      button.disabled = false;
    }
  }

  document.querySelectorAll('[data-play]').forEach(button => {
    button.addEventListener('click', () => {
      selectedGame = button.dataset.play;
      document.querySelectorAll('[data-game-card]').forEach(card => {
        card.classList.toggle('is-selected', card.dataset.gameCard === selectedGame);
      });

      if (window.kratosDesktop) {
        void playFromDesktop(button);
        return;
      }

      fileTitle.textContent = selectedGame === 'gow1' ? 'God of War · selecione o arquivo' : 'God of War II · selecione o arquivo';
      fileStatus.textContent = 'Selecione o arquivo ISO, CHD, CUE ou outro formato aceito pelo PCSX2.';
      filePanel.hidden = false;
      filePanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      fileInput.click();
    });
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    fileStatus.textContent = `Arquivo selecionado: ${file.name}. Abra o PCSX2 e use System > Start File para iniciar.`;
  });

  fullscreenButton.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      filePanel.hidden = false;
      fileTitle.textContent = 'Tela cheia indisponível';
      fileStatus.textContent = 'Seu navegador não permitiu ativar a tela cheia nesta página.';
    }
  });

  document.addEventListener('fullscreenchange', () => {
    const isFullscreen = Boolean(document.fullscreenElement);
    fullscreenButton.setAttribute('aria-label', isFullscreen ? 'Sair da tela cheia' : 'Ativar tela cheia');
    fullscreenButton.title = isFullscreen ? 'Sair da tela cheia' : 'Ativar tela cheia';
    fullscreenButton.lastElementChild.textContent = isFullscreen ? 'SAIR DA TELA CHEIA' : 'TELA CHEIA';
  });
});