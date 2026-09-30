// Espera o DOM carregar completamente
document.addEventListener('DOMContentLoaded', () => {
  // 0. Rastreamento do Mouse para as Brasas (Seguir o movimento)
  let mouseXPct = 50; 
  window.addEventListener('mousemove', (e) => {
    mouseXPct = (e.clientX / window.innerWidth) * 100;
    document.documentElement.style.setProperty('--mouse-x', mouseXPct + '%');
  });

  // Remove menu manual se ele existir para evitar duplicidade e conflito de IDs
  const existingNav = document.querySelector('nav');
  if (existingNav) existingNav.remove();

  // 1. Injetar o Menu dinamicamente
  const navContainer = document.createElement('nav');
  navContainer.innerHTML = `
    <a class="nav-logo" href="index.html">KRATOS</a>
    <input type="checkbox" id="nav-toggle" class="nav-toggle">
    <label for="nav-toggle" class="nav-toggle-label"><span></span></label>
    <ul class="nav-links">
      <li><a href="index.html">Início</a></li>
      <li><a href="gameplay.html">Gameplay</a></li>
      <li><a href="quiz.html">Quiz</a></li>
      <li><a href="memoria.html">Memória &amp; Cartas</a></li>
      <li><a href="comparador.html">Comparador &amp; Desafios</a></li>
      <li><a href="roleta.html">Roleta de God of War</a></li>
      <li><a href="bestiario.html">Bestiário</a></li>
      <li><a href="arvore-genealogica.html">Árvore Genealógica</a></li>
      <li><a href="historias.html">Histórias</a></li>
      <li><a href="platinar.html">Platinar</a></li>
      <li><a href="armas.html">Armas</a></li>
      <li><a href="estatisticas.html">Estatísticas</a></li>
      <li><a href="criadores.html">Criadores</a></li>
      <li><a href="simulador.html">Simulador</a></li>
      <li><a href="loja.html" class="nav-loja-highlight">LOJA</a></li>
    </ul>
    <span class="nav-omega">Ω</span>
  `;
  document.body.prepend(navContainer);

  // 2. Selecionar elementos após a injeção
  const navToggle = navContainer.querySelector('.nav-toggle');
  const navLinks = navContainer.querySelectorAll('.nav-links a');
  const nav = navContainer;

  // Controle de música fixo no canto inferior direito
  const musicas = [
    'assets/audio/01.God Of War II - Main Titles.mp3',
    'assets/audio/02. Memories of Mother.mp3',
    'assets/audio/01. God of War.mp3',
    'assets/audio/02.The Glory Of Sparta.mp3'
  ];

  const musicWidget = document.createElement('div');
  musicWidget.className = 'music-widget';
  musicWidget.innerHTML = `
    <audio id="player" preload="auto"></audio>
    <div class="music-actions">
      <button type="button" class="music-pause" aria-label="Pausar música">⏸</button>
      <button type="button" class="music-pause rage-mode-button" data-rage-toggle aria-label="Ativar Fúria Máxima" aria-pressed="false" title="Ativar Fúria Máxima">Ω</button>
      <button type="button" class="music-hamburger" aria-label="Abrir menu de música e níveis de Fúria" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
    <div class="music-menu">
      <p class="rage-level-heading">ESCOLHA A INTENSIDADE</p>
      <button type="button" class="rage-level-option" data-rage-level="one"><strong>FÚRIA 1</strong><span>Brasas e vermelho · 8 s</span></button>
      <button type="button" class="rage-level-option" data-rage-level="two"><strong>FÚRIA 2</strong><span>Fogo, fumaça e tremores · 12 s</span></button>
      <button type="button" class="rage-level-option" data-rage-level="maximum"><strong>FÚRIA MÁXIMA</strong><span>Tela total, música e efeitos · 16 s</span></button>
      <button type="button" class="rage-toggle music-btn" data-track="0">MÚSICA 1</button>
      <button type="button" class="rage-toggle music-btn" data-track="1">MÚSICA 2</button>
      <button type="button" class="rage-toggle music-btn" data-track="2">MÚSICA 3</button>
      <button type="button" class="rage-toggle music-btn" data-track="3">MÚSICA 4</button>
    </div>
  `;
  document.body.appendChild(musicWidget);

  const progressionStorageKey = 'godOfWarProgressionV1';
  const progressionMedals = [
    { id: 'first-visit', name: 'Primeiro Passo', detail: 'Visitou os reinos pela primeira vez.' },
    { id: 'three-day-streak', name: 'Três Dias de Guerra', detail: 'Manteve uma sequência de três dias.' },
    { id: 'seven-day-streak', name: 'Constância de um Deus', detail: 'Manteve uma sequência de sete dias.' },
    { id: 'first-quiz', name: 'Olhos de Mimir', detail: 'Acertou uma pergunta do quiz.' },
    { id: 'daily-champion', name: 'Provação Diária', detail: 'Concluiu um desafio diário.' },
    { id: 'memory-keeper', name: 'Guardião das Memórias', detail: 'Encontrou um par no jogo da memória.' },
    { id: 'wheel-of-fate', name: 'Roda do Destino', detail: 'Girou a roleta dos reinos.' },
    { id: 'battle-tested', name: 'Forjado em Batalha', detail: 'Concluiu uma simulação de combate.' },
    { id: 'rune-seeker', name: 'Caçador de Runas', detail: 'Descobriu uma runa escondida.' },
    { id: 'all-runes', name: 'Tradutor dos Reinos', detail: 'Descobriu todas as runas do site.' },
    { id: 'first-rage', name: 'Fúria Desperta', detail: 'Ativou o Modo Fúria.' },
    { id: 'omega-secret', name: 'Segredo do Ômega', detail: 'Revelou o segredo do símbolo Ω.' }
  ];
  const progressionRelics = [
    { id: 'mimir-relic', name: 'Amuleto de Mimir', detail: 'Recompensa por acertar no quiz.' },
    { id: 'memory-relic', name: 'Pedra das Memórias', detail: 'Recompensa por encontrar um par.' },
    { id: 'daily-relic', name: 'Runa do Destino', detail: 'Recompensa de desafio diário.' },
    { id: 'fate-relic', name: 'Moeda dos Reinos', detail: 'Recompensa por girar a roleta.' },
    { id: 'battle-relic', name: 'Marca Espartana', detail: 'Recompensa por concluir uma batalha.' },
    { id: 'secret-relic', name: 'Fragmento Rúnico', detail: 'Recompensa por descobrir segredos.' },
    { id: 'olympus-relic', name: 'Selo do Olimpo', detail: 'Desbloqueado ao alcançar 250 XP.' }
  ];
  const progressionUnlocks = [
    { id: 'title-semi', name: 'Título: Semideus', threshold: 100 },
    { id: 'olympus-relic', name: 'Relíquia: Selo do Olimpo', threshold: 250 },
    { id: 'title-god', name: 'Título: Deus da Guerra', threshold: 500 }
  ];
  const defaultProgression = { xp: 0, streak: 0, lastVisit: '', medals: [], relics: [], rewards: [], stats: {} };
  const readProgression = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(progressionStorageKey) || 'null');
      if (!saved || typeof saved !== 'object') return { ...defaultProgression };
      return {
        ...defaultProgression,
        ...saved,
        xp: Math.max(0, Number(saved.xp) || 0),
        streak: Math.max(0, Number(saved.streak) || 0),
        medals: Array.isArray(saved.medals) ? saved.medals : [],
        relics: Array.isArray(saved.relics) ? saved.relics : [],
        rewards: Array.isArray(saved.rewards) ? saved.rewards : [],
        stats: saved.stats && typeof saved.stats === 'object' ? saved.stats : {}
      };
    } catch { return { ...defaultProgression }; }
  };
  let progression = readProgression();
  const progressionWidget = document.createElement('aside');
  progressionWidget.className = 'progression-widget';
  progressionWidget.innerHTML = `
    <button class="progression-trigger" id="progression-trigger" type="button" aria-expanded="false" aria-controls="progression-panel">
      <span class="progression-mark" aria-hidden="true">Ω</span>
      <span class="progression-trigger-copy"><strong id="progression-trigger-level">NÍVEL 1</strong><span id="progression-trigger-title">Guerreiro</span></span>
      <span class="progression-trigger-xp" id="progression-trigger-xp">0 XP</span>
    </button>
    <section class="progression-panel" id="progression-panel" aria-label="Progresso da jornada" hidden>
      <header class="progression-panel-header"><div><p>CRÔNICAS DA JORNADA</p><h2>Progresso</h2></div><button class="progression-close" id="progression-close" type="button" aria-label="Fechar progresso">×</button></header>
      <div class="progression-rank"><div><span id="progression-title">Guerreiro</span><strong id="progression-level">Nível 1</strong></div><strong id="progression-xp-total">0 XP</strong></div>
      <div class="progression-track" role="progressbar" aria-label="Progresso para o próximo nível" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span id="progression-track-fill"></span></div>
      <p class="progression-next" id="progression-next">0/100 XP para o próximo nível</p>
      <div class="progression-streak"><span>SEQUÊNCIA DE VISITAS</span><strong><b id="progression-streak">0</b> <span id="progression-streak-label">dias</span></strong></div>
      <section class="progression-section"><h3>Medalhas <span id="progression-medal-count">0</span></h3><div class="progression-items" id="progression-medals"></div></section>
      <section class="progression-section"><h3>Relíquias <span id="progression-relic-count">0/7</span></h3><div class="progression-items" id="progression-relics"></div></section>
      <section class="progression-section"><h3>Desbloqueáveis</h3><div class="progression-items" id="progression-unlocks"></div></section>
    </section>
    <p class="progression-toast" id="progression-toast" role="status" aria-live="polite"></p>
  `;
  document.body.appendChild(progressionWidget);

  const progressionDateKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const progressionTitle = xp => xp >= 500 ? 'Deus da Guerra' : xp >= 100 ? 'Semideus' : 'Guerreiro';
  const saveProgression = () => {
    try { localStorage.setItem(progressionStorageKey, JSON.stringify(progression)); } catch {}
  };

  function renderProgression() {
    const level = Math.floor(progression.xp / 100) + 1;
    const withinLevel = progression.xp % 100;
    const title = progressionTitle(progression.xp);
    document.getElementById('progression-trigger-level').textContent = `NÍVEL ${level}`;
    document.getElementById('progression-trigger-title').textContent = title;
    document.getElementById('progression-trigger-xp').textContent = `${progression.xp} XP`;
    document.getElementById('progression-title').textContent = title;
    document.getElementById('progression-level').textContent = `Nível ${level}`;
    document.getElementById('progression-xp-total').textContent = `${progression.xp} XP`;
    document.getElementById('progression-track-fill').style.width = `${withinLevel}%`;
    document.querySelector('.progression-track').setAttribute('aria-valuenow', String(withinLevel));
    document.getElementById('progression-next').textContent = `${withinLevel}/100 XP para o próximo nível`;
    document.getElementById('progression-streak').textContent = progression.streak;
    document.getElementById('progression-streak-label').textContent = progression.streak === 1 ? 'dia' : 'dias';
    document.getElementById('progression-medal-count').textContent = progression.medals.length;
    document.getElementById('progression-relic-count').textContent = `${progression.relics.length}/7`;
    [
      ['progression-medals', progressionMedals, progression.medals],
      ['progression-relics', progressionRelics, progression.relics]
    ].forEach(([containerId, catalog, unlocked]) => {
      const container = document.getElementById(containerId);
      container.replaceChildren();
      catalog.forEach(item => {
        const card = document.createElement('div');
        const isUnlocked = unlocked.includes(item.id);
        card.className = `progression-item${isUnlocked ? ' is-unlocked' : ''}`;
        const symbol = document.createElement('span');
        symbol.className = 'progression-item-mark';
        symbol.textContent = isUnlocked ? '✦' : '·';
        const copy = document.createElement('span');
        const name = document.createElement('strong');
        name.textContent = isUnlocked ? item.name : 'Ainda oculta';
        const detail = document.createElement('small');
        detail.textContent = isUnlocked ? item.detail : 'Continue sua jornada para descobrir';
        copy.append(name, detail);
        card.append(symbol, copy);
        container.append(card);
      });
    });
    const unlockContainer = document.getElementById('progression-unlocks');
    unlockContainer.replaceChildren();
    progressionUnlocks.forEach(unlock => {
      const unlocked = progression.xp >= unlock.threshold;
      const item = document.createElement('div');
      item.className = `progression-item${unlocked ? ' is-unlocked' : ''}`;
      const symbol = document.createElement('span');
      symbol.className = 'progression-item-mark';
      symbol.textContent = unlocked ? '✓' : '🔒';
      const copy = document.createElement('span');
      const name = document.createElement('strong');
      name.textContent = unlock.name;
      const detail = document.createElement('small');
      detail.textContent = unlocked ? 'Desbloqueado' : `Disponível em ${unlock.threshold} XP`;
      copy.append(name, detail);
      item.append(symbol, copy);
      unlockContainer.append(item);
    });
  }

  let progressionToastTimer;
  function showProgressionToast(message) {
    const toast = document.getElementById('progression-toast');
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(progressionToastTimer);
    progressionToastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
  }

  function awardProgression(reward) {
    if (!reward || !reward.id || progression.rewards.includes(reward.id)) return false;
    progression.rewards.push(reward.id);
    progression.xp += Math.max(0, Number(reward.xp) || 0);
    if (reward.stat) progression.stats[reward.stat] = (progression.stats[reward.stat] || 0) + 1;
    if (reward.medal && !progression.medals.includes(reward.medal)) progression.medals.push(reward.medal);
    if (reward.relic && !progression.relics.includes(reward.relic)) progression.relics.push(reward.relic);
    if (progression.xp >= 250 && !progression.relics.includes('olympus-relic')) progression.relics.push('olympus-relic');
    saveProgression();
    renderProgression();
    showProgressionToast(`+${Math.max(0, Number(reward.xp) || 0)} XP${reward.medal ? ' · Medalha conquistada' : ''}`);
    return true;
  }

  window.awardGodOfWarProgress = awardProgression;

  function recordDailyVisit() {
    const today = progressionDateKey();
    if (progression.lastVisit === today) return;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    progression.streak = progression.lastVisit === progressionDateKey(yesterday) ? progression.streak + 1 : 1;
    progression.lastVisit = today;
    progression.xp += 5;
    if (!progression.medals.includes('first-visit')) progression.medals.push('first-visit');
    if (progression.streak >= 3 && !progression.medals.includes('three-day-streak')) {
      progression.medals.push('three-day-streak');
      progression.xp += 10;
    }
    if (progression.streak >= 7 && !progression.medals.includes('seven-day-streak')) {
      progression.medals.push('seven-day-streak');
      progression.xp += 25;
      if (!progression.relics.includes('secret-relic')) progression.relics.push('secret-relic');
    }
    if (progression.xp >= 250 && !progression.relics.includes('olympus-relic')) progression.relics.push('olympus-relic');
    saveProgression();
    renderProgression();
  }

  const progressionTrigger = document.getElementById('progression-trigger');
  const progressionPanel = document.getElementById('progression-panel');
  function toggleProgressionPanel(open = progressionPanel.hidden) {
    progressionPanel.hidden = !open;
    progressionTrigger.setAttribute('aria-expanded', String(open));
  }
  progressionTrigger.addEventListener('click', () => toggleProgressionPanel());
  document.getElementById('progression-close').addEventListener('click', () => toggleProgressionPanel(false));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') toggleProgressionPanel(false);
  });
  document.addEventListener('click', event => {
    if (!progressionWidget.contains(event.target)) toggleProgressionPanel(false);
  });
  recordDailyVisit();
  renderProgression();

  const player = document.getElementById('player');
  const musicToggle = musicWidget.querySelector('.music-hamburger');
  const pauseButton = musicWidget.querySelector('.music-pause');
  const musicMenu = musicWidget.querySelector('.music-menu');
  let rageAudioSnapshot = null;
  let rageAudioFade;
  let rageMusicWasPaused = false;

  const tocar = (numero) => {
    if (!player) return;
    player.src = musicas[numero];
    player.load();
    player.play().catch(() => {});
  };

  musicToggle.addEventListener('click', () => {
    const isOpen = musicWidget.classList.toggle('open');
    musicToggle.setAttribute('aria-expanded', isOpen);
  });

  pauseButton.addEventListener('click', () => {
    if (!player) return;
    if (player.paused) {
      player.play().catch(() => {});
      pauseButton.textContent = '⏸';
    } else {
      player.pause();
      pauseButton.textContent = '▶';
    }
    if (rageAudioSnapshot) rageMusicWasPaused = player.paused;
  });

  musicMenu.querySelectorAll('.music-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      tocar(Number(btn.dataset.track));
      musicWidget.classList.remove('open');
      musicToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Marcar link ativo
  const getPageName = () => {
    let path = window.location.pathname.split("/").pop().split("#")[0] || "index.html";
    if (path === "copia-do-kratos_36-----") path = "index.html";
    return path.includes('.') ? path : `${path}.html`;
  };
  const currentPath = getPageName();
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === "index.html" && href === "index.html")) {
      link.classList.add('active');
    }
  });

  // Função para controlar a trava de rolagem do fundo
  let scrollPosition = 0;
  const toggleBodyScroll = () => {
    if (navToggle.checked) {
      scrollPosition = window.pageYOffset;
      document.body.classList.add('no-scroll');
      document.body.style.top = `-${scrollPosition}px`;
      const menuList = nav.querySelector('.nav-links');
      if (menuList) menuList.scrollTop = 0;
    } else {
      document.body.classList.remove('no-scroll');
      document.body.style.top = '';
      window.scrollTo(0, scrollPosition);
    }
  };

  navToggle.addEventListener('change', toggleBodyScroll);

  // Adiciona um evento de clique em cada link do menu
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.checked = false; // Desmarca o checkbox, fechando o menu
      toggleBodyScroll(); // Destrava o scroll ao clicar em um link
    });
  });

  // Altera o fundo do nav ao rolar a página
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  });

  // Lógica para os botões da página Platinar
  const checklistBtn = document.querySelector('.tool-card:nth-child(1) button');
  const calcBtn = document.querySelector('.tool-card:nth-child(2) button');
  const mapBtn = document.querySelector('.tool-card:nth-child(3) button');
  const guideBtn = document.querySelector('.tool-card:nth-child(4) button');
  
  const checklistModal = document.getElementById('checklist-modal');
  const calcModal = document.getElementById('calc-modal');
  const closeButtons = document.querySelectorAll('.close-modal');
  
  const select = document.getElementById('upgrade-select');
  const resultDiv = document.getElementById('calc-result');

  if (checklistBtn) {
    checklistBtn.addEventListener('click', () => {
      checklistModal.style.display = 'flex';
    });
  }

  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      calcModal.style.display = 'flex';
    });
  }

  if (mapBtn) {
    mapBtn.addEventListener('click', () => {
      window.open('https://mapgenie.io/god-of-war-ragnarok', '_blank');
    });
  }

  if (guideBtn) {
    guideBtn.addEventListener('click', () => {
      window.location.href = 'gameplay.html#bosses';
    });
  }

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (calcModal) calcModal.style.display = 'none';
      if (checklistModal) checklistModal.style.display = 'none';
    });
  });

  if (select) {
    const costs = {
      "2": { mats: "1 Chama Congelada", hack: "1.250" },
      "3": { mats: "1 Chama Congelada", hack: "3.500" },
      "4": { mats: "1 Chama Congelada", hack: "8.000" },
      "5": { mats: "1 Chama Congelada", hack: "18.000" },
      "6": { mats: "1 Névoa Arrefecedora de Niflheim", hack: "50.000" }
    };

    select.addEventListener('change', (e) => {
      const val = e.target.value;
      if (costs[val]) {
        resultDiv.style.display = 'block';
        document.getElementById('res-mats').innerText = `Material: ${costs[val].mats}`;
        document.getElementById('res-hack').innerText = `Custo: ${costs[val].hack} Hacksilver`;
      } else {
        resultDiv.style.display = 'none';
      }
    });
  }

  // Lógica de Persistência do Checklist
  const checklistInputs = document.querySelectorAll('#checklist-container input');
  if (checklistInputs.length > 0) {
    // Carregar dados salvos
    checklistInputs.forEach(input => {
      const id = input.getAttribute('data-id');
      const savedState = localStorage.getItem(id);
      if (savedState === 'true') input.checked = true;

      // Salvar ao clicar
      input.addEventListener('change', () => {
        localStorage.setItem(id, input.checked);
      });
    });
  }

  // ─────────── SEGREDOS E EASTER EGGS ───────────
  
  const runeMessages = {
    "index.html": "ᚴᚱᛅᛏᚬᛋ ᛚᛁᚠᛅᛋ", // Kratos vive
    "gameplay.html": "ᛅᚱᛏᛁ ᚬᚠ ᚢᛅᚱ", // Arte da Guerra
    "bestiario.html": "ᚠᛚᛅᚴᛁᛚᚢ ᚬᚠ ᚱᛁᛅᛚᛘᛋ", // Flagelo dos Reinos
    "arvore-genealogica.html": "ᛚᛁᚾᛁᛅᚴᛁ ᚬᚠ ᛒᛚᚢᛞ", // Linhagem de Sangue
    "historias.html": "ᛋᛅᚴᛅ ᚬᚠ ᚴᚬᛞᛋ", // Saga dos Deuses
    "platinar.html": "ᛒᛁ ᛒᛁᛏᛁᚱ", // Seja Melhor
    "armas.html": "ᛅᚱᛘᛋ ᚬᚠ ᚢᛅᚱ", // Armas de Guerra
    "estatisticas.html": "ᚱᛁᚴᚬᚱᛞᛋ ᚬᚠ ᚢᛅᚱ", // Registros de Guerra
    "loja.html": "ᚴᚢᛚᛞ ᚬᚠ ᚬᛚᛁᛘᛒᚢᛋ", // Ouro do Olimpo
    "criadores.html": "ᛋᚴᛅᛚᛞᛋ ᚬᚠ ᛘᛁᛞᚴᛅᚱᛞ", // Escaldos de Midgard
    "simulador.html": "ᚠᛁᚴᚼᛏ ᚬᚠ ᚴᚬᛞᛋ", // Luta dos Deuses
    "quiz.html": "ᚹᛁᛋᛞᚬᛘ ᚬᚠ ᚴᚬᛞᛋ", // Sabedoria dos Deuses
    "memoria.html": "ᛘᛁᛘᚬᚱᛁ ᚬᚠ ᚢᛅᚱ", // Memória de Guerra
    "comparador.html": "ᛋᛏᚱᛖᚾᚴᛏᚼ ᚬᚠ ᚼᛁᚱᚬᛋ", // Força dos Heróis
    "roleta.html": "ᚠᛅᛏᛖ ᚬᚠ ᚱᛖᛅᛚᛘᛋ" // Destino dos Reinos
  };

  // Rastreador de Segredos
  let foundSecrets = {
    rage: false,
    omega: false,
    runesFound: [] // Lista de páginas onde a runa foi clicada
  };
  let rageTimeout;
  let rageCountdown;
  let rageCleanup;
  let rageTremors;
  let rageCursorThrottle = 0;
  let rageEnding = false;
  let rageExpiresAt = 0;
  let rageLayer;
  let activeRageLevel = 'maximum';
  let activeGodMode = false;
  const rageLevels = {
    one: { label: 'Fúria 1', duration: 8000, className: 'rage-level-one' },
    two: { label: 'Fúria 2', duration: 12000, className: 'rage-level-two' },
    maximum: { label: 'Fúria Máxima', duration: 16000, className: 'rage-level-maximum' }
  };

  const saveSecrets = () => {
    localStorage.setItem('kratos_secrets', JSON.stringify(foundSecrets));
  };

  // Função para criar uma mensagem temática com auto-fechamento
  const showRunicMessage = (title, message) => {
    const overlay = document.createElement('div');
    overlay.className = 'runic-alert-overlay';
    overlay.innerHTML = `
      <div class="runic-alert-content">
        <div class="runic-alert-title">${title}</div>
        <div class="runic-alert-text">${message}</div>
        <button class="rage-toggle" style="padding: 8px 20px; font-size: 12px;">FECHAR</button>
      </div>
    `;
    
    const closeMsg = () => {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 300);
    };

    overlay.querySelector('button').addEventListener('click', closeMsg);
    document.body.appendChild(overlay);

    // Fecha a mensagem automaticamente após 3 segundos (3000ms)
    setTimeout(closeMsg, 3000);
  };

  // Função para criar uma confirmação temática (Sim/Não) em vez do confirm() padrão
  const showRunicConfirm = (title, message, onConfirm) => {
    const overlay = document.createElement('div');
    overlay.className = 'runic-alert-overlay';
    overlay.innerHTML = `
      <div class="runic-alert-content">
        <div class="runic-alert-title">${title}</div>
        <div class="runic-alert-text">${message}</div>
        <div style="display: flex; gap: 15px; justify-content: center;">
          <button class="rage-toggle btn-confirm" style="padding: 8px 25px; font-size: 12px;">SIM</button>
          <button class="rage-toggle btn-cancel" style="padding: 8px 25px; font-size: 12px; border-color: var(--muted); color: var(--muted);">NÃO</button>
        </div>
      </div>
    `;
    
    const closeMsg = () => {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 300);
    };

    overlay.querySelector('.btn-confirm').addEventListener('click', () => { onConfirm(); closeMsg(); });
    overlay.querySelector('.btn-cancel').addEventListener('click', closeMsg);

    document.body.appendChild(overlay);
  };

  const checkAllSecrets = () => {
    const runeElement = document.querySelector('.hidden-rune');
    const counterElement = document.querySelector('.rune-counter');
    
    // Se as runas de todas as páginas foram encontradas
    const totalRunes = Object.keys(runeMessages).length;
    const currentRunes = foundSecrets.runesFound.length;
    const allRunesFound = currentRunes === totalRunes;

    // Atualiza o contador visual
    if (counterElement) {
      counterElement.innerText = `${currentRunes}/${totalRunes}`;
    }

    // Efeito de suspense quando falta apenas uma runa (8/9)
    if (runeElement) {
      if (currentRunes === totalRunes - 1) {
        runeElement.classList.add('rune-suspense');
      } else {
        runeElement.classList.remove('rune-suspense');
      }
    }

    if (runeElement && (allRunesFound || (foundSecrets.rage && foundSecrets.omega))) {
      runeElement.classList.add('all-found');
    }

    if (allRunesFound && !localStorage.getItem('runes_completed_alert')) {
      showRunicMessage("ᚦᚢ ᚼᛅᚠᚠ ᚠᚬᚢᚾᛞ ᛅᛚᛚ ᚱᚢᚾᛁᛋ", "Você decifrou todas as escritas dos reinos. O conhecimento do Fantasma de Esparta agora é seu por direito.");
      localStorage.setItem('runes_completed_alert', 'true');
    }
  };

  // Carregar segredos salvos e aplicar estados visuais
  const loadSecrets = () => {
    const saved = localStorage.getItem('kratos_secrets');
    if (saved) {
      foundSecrets = JSON.parse(saved);
      if (!foundSecrets.runesFound) foundSecrets.runesFound = [];
      
      const footerOmega = document.querySelector('.footer-omega');
      if (foundSecrets.omega && footerOmega) {
        footerOmega.style.color = "var(--gold)";
      }
      
      checkAllSecrets();
    }
  };

  const updateRageButtons = () => {
    const active = document.body.classList.contains('rage-active') && !rageEnding;
    const secondsLeft = Math.max(0, Math.ceil((rageExpiresAt - Date.now()) / 1000));
    document.querySelectorAll('#btnRage, [data-rage-toggle]').forEach(button => {
      const levelLabel = activeGodMode ? 'Modo Deus da Guerra' : rageLevels[activeRageLevel].label;
      const label = active ? `Desativar ${levelLabel}, ${secondsLeft} segundos restantes` : `Ativar ${rageLevels[activeRageLevel].label}`;
      button.setAttribute('aria-pressed', String(active));
      button.setAttribute('aria-label', label);
      button.title = label;
      if (button.id === 'btnRage') button.textContent = active ? `Ω FÚRIA ATIVA · ${secondsLeft}s` : 'Ω ATIVAR FÚRIA';
    });
    document.querySelectorAll('[data-rage-level]').forEach(button => {
      button.disabled = active || rageEnding;
      button.setAttribute('aria-pressed', String(activeRageLevel === button.dataset.rageLevel));
    });
  };

  const createRageLayer = () => {
    rageLayer = document.createElement('div');
    rageLayer.className = `rage-fx ${rageLevels[activeRageLevel].className}${activeGodMode ? ' rage-god-mode' : ''}`;
    rageLayer.setAttribute('aria-hidden', 'true');
    const wash = document.createElement('div');
    wash.className = 'rage-red-wash';
    const fire = document.createElement('div');
    fire.className = 'rage-fire';
    const smoke = document.createElement('div');
    smoke.className = 'rage-smoke';
    rageLayer.append(wash, smoke, fire);
    for (let index = 0; index < 42; index += 1) {
      const particle = document.createElement('span');
      particle.className = 'rage-particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.setProperty('--particle-size', `${3 + Math.random() * 7}px`);
      particle.style.setProperty('--particle-duration', `${3 + Math.random() * 5}s`);
      particle.style.setProperty('--particle-delay', `${Math.random() * -8}s`);
      particle.style.setProperty('--particle-drift', `${Math.round((Math.random() - .5) * 180)}px`);
      rageLayer.appendChild(particle);
    }
    document.body.appendChild(rageLayer);
  };

  const showRageNotice = (message, controlled = false) => {
    document.querySelector('.rage-announcement')?.remove();
    const notice = document.createElement('div');
    notice.className = `rage-announcement${controlled ? ' is-controlled' : ''}`;
    notice.setAttribute('role', 'status');
    notice.setAttribute('aria-live', 'polite');
    notice.textContent = message;
    document.body.appendChild(notice);
    setTimeout(() => {
      notice.classList.add('is-leaving');
      setTimeout(() => notice.remove(), 600);
    }, controlled ? 2100 : 2200);
  };

  const playRageSound = () => {
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) return;
    try {
      const context = new AudioContextConstructor();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(118, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(42, context.currentTime + .42);
      gain.gain.setValueAtTime(.18, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .45);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + .46);
      oscillator.addEventListener('ended', () => context.close(), { once: true });
    } catch {}
  };

  const startRageMusic = () => {
    if (!player || rageAudioSnapshot) return;
    rageAudioSnapshot = {
      source: player.currentSrc || player.src,
      time: player.currentTime || 0,
      paused: player.paused,
      volume: player.volume
    };
    rageMusicWasPaused = false;
    player.volume = Math.max(rageAudioSnapshot.volume, .78);
    tocar(3);
  };

  const restoreRageMusic = () => {
    clearInterval(rageAudioFade);
    if (!rageAudioSnapshot || !player) return;
    const previousAudio = rageAudioSnapshot;
    const fadeStart = player.volume;
    const fadeStartedAt = Date.now();
    rageAudioFade = setInterval(() => {
      const progress = Math.min((Date.now() - fadeStartedAt) / 1800, 1);
      player.volume = fadeStart * (1 - progress);
      if (progress < 1) return;
      clearInterval(rageAudioFade);
      player.pause();
      if (!previousAudio.source) {
        player.removeAttribute('src');
        player.load();
        player.volume = previousAudio.volume;
        rageAudioSnapshot = null;
        return;
      }
      player.src = previousAudio.source;
      player.load();
      player.addEventListener('loadedmetadata', () => {
        player.currentTime = Math.min(previousAudio.time, player.duration || previousAudio.time);
        player.volume = previousAudio.volume;
        if (!previousAudio.paused && !rageMusicWasPaused) player.play().catch(() => {});
        rageAudioSnapshot = null;
      }, { once: true });
    }, 100);
  };

  const triggerRageEffect = () => {
    const flash = document.createElement('div');
    flash.className = 'rage-flash';
    document.body.appendChild(flash);
    for (let index = 0; index < 24; index += 1) {
      const spark = document.createElement('span');
      spark.className = 'rage-particle';
      spark.style.left = `${mouseXPct + (Math.random() - .5) * 24}%`;
      spark.style.setProperty('--particle-size', `${4 + Math.random() * 7}px`);
      spark.style.setProperty('--particle-duration', `${.8 + Math.random() * .8}s`);
      spark.style.setProperty('--particle-delay', '0s');
      spark.style.setProperty('--particle-drift', `${Math.round((Math.random() - .5) * 260)}px`);
      rageLayer.appendChild(spark);
      setTimeout(() => spark.remove(), 1800);
    }
    document.body.classList.add('rage-impact');
    setTimeout(() => {
      document.body.classList.remove('rage-impact');
      flash.remove();
    }, 500);
  };

  function deactivateRage() {
    if (!document.body.classList.contains('rage-active') || rageEnding) return;
    clearTimeout(rageTimeout);
    clearInterval(rageCountdown);
    clearInterval(rageTremors);
    rageEnding = true;
    document.body.classList.add('rage-diminishing');
    try { sessionStorage.removeItem('kratos_rage_until'); } catch {}
    try { sessionStorage.removeItem('kratos_rage_level'); } catch {}
    try { sessionStorage.removeItem('kratos_god_mode'); } catch {}
    updateRageButtons();
    restoreRageMusic();
    showRageNotice('A FÚRIA FOI CONTROLADA', true);
    rageCleanup = setTimeout(() => {
      document.body.classList.remove('rage-active', 'rage-ending', 'rage-diminishing', 'rage-level-one', 'rage-level-two', 'rage-level-maximum', 'rage-god-mode');
      rageLayer?.remove();
      rageLayer = null;
      rageExpiresAt = 0;
      activeGodMode = false;
      rageEnding = false;
      updateRageButtons();
    }, 2100);
  }

  function activateRage(level = 'maximum', options = {}) {
    clearTimeout(rageCleanup);
    clearTimeout(rageTimeout);
    clearInterval(rageCountdown);
    clearInterval(rageTremors);
    clearInterval(rageAudioFade);
    rageLayer?.remove();
    document.body.classList.remove('rage-diminishing', 'rage-level-one', 'rage-level-two', 'rage-level-maximum', 'rage-god-mode');
    if (rageEnding) rageAudioSnapshot = null;
    rageEnding = false;
    if (rageAudioSnapshot && player) player.volume = Math.max(rageAudioSnapshot.volume, .78);
    activeRageLevel = rageLevels[level] ? level : 'maximum';
    activeGodMode = Boolean(options.godMode);
    const duration = options.duration || (activeGodMode ? 30000 : rageLevels[activeRageLevel].duration);
    rageExpiresAt = Date.now() + duration;
    document.body.classList.add('rage-active');
    document.body.classList.add(rageLevels[activeRageLevel].className);
    if (activeGodMode) document.body.classList.add('rage-god-mode');
    createRageLayer();
    updateRageButtons();
    try { sessionStorage.setItem('kratos_rage_until', String(rageExpiresAt)); } catch {}
    try { sessionStorage.setItem('kratos_rage_level', activeRageLevel); } catch {}
    try { sessionStorage.setItem('kratos_god_mode', String(activeGodMode)); } catch {}
    rageTimeout = setTimeout(deactivateRage, duration);
    rageCountdown = setInterval(updateRageButtons, 1000);
    if (activeRageLevel !== 'one') {
      rageTremors = setInterval(() => {
        if (rageEnding) return;
        document.body.classList.add('rage-impact');
        setTimeout(() => document.body.classList.remove('rage-impact'), 350);
      }, 2800);
    }
    if (activeRageLevel === 'maximum') startRageMusic();
    if (options.showImpact !== false) {
      playRageSound();
      triggerRageEffect();
      showRageNotice(activeGodMode ? 'MODO DEUS DA GUERRA' : 'FÚRIA ESPARTANA ATIVADA');
    }
  }

  function toggleRage() {
    foundSecrets.rage = true;
    saveSecrets();
    checkAllSecrets();
    window.awardGodOfWarProgress?.({ id: 'first-rage', xp: 10, medal: 'first-rage' });
    if (document.body.classList.contains('rage-active')) deactivateRage();
    else activateRage(activeRageLevel);
  }

  document.querySelectorAll('#btnRage, [data-rage-toggle]').forEach(button => {
    button.addEventListener('click', toggleRage);
  });
  musicMenu.querySelectorAll('[data-rage-level]').forEach(button => {
    button.addEventListener('click', () => {
      activeRageLevel = button.dataset.rageLevel;
      foundSecrets.rage = true;
      saveSecrets();
      checkAllSecrets();
      activateRage(activeRageLevel);
      musicWidget.classList.remove('open');
      musicToggle.setAttribute('aria-expanded', 'false');
    });
  });
  window.addEventListener('mousemove', event => {
    if (!document.body.classList.contains('rage-level-maximum') || rageEnding || Date.now() - rageCursorThrottle < 75) return;
    rageCursorThrottle = Date.now();
    const spark = document.createElement('span');
    spark.className = 'rage-cursor-spark';
    spark.style.left = `${event.clientX}px`;
    spark.style.top = `${event.clientY}px`;
    rageLayer?.appendChild(spark);
    setTimeout(() => spark.remove(), 650);
  });

  // 1. Mensagem Oculta no Console
  console.log("%cᚴᚱᛅᛏᚬᛋ %c- A jornada para a platina começou. Cuidado com o que você desperta.", "color: #8B0000; font-size: 20px; font-weight: bold;", "color: #B8860B; font-size: 14px;");

  // 2. Códigos secretos da Fúria
  let inputSequence = "";
  document.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLElement && e.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (!/^[a-z]$/i.test(e.key)) return;
    inputSequence += e.key.toUpperCase();
    inputSequence = inputSequence.slice(-8);
    if (inputSequence.endsWith('KRATOS')) {
      foundSecrets.rage = true;
      saveSecrets();
      checkAllSecrets();
      window.awardGodOfWarProgress?.({ id: 'first-rage', xp: 10, medal: 'first-rage' });
      activateRage('maximum', { godMode: true, duration: 30000 });
      inputSequence = '';
    } else if (inputSequence.endsWith('GOD')) {
      foundSecrets.rage = true;
      saveSecrets();
      checkAllSecrets();
      window.awardGodOfWarProgress?.({ id: 'first-rage', xp: 10, medal: 'first-rage' });
      activateRage(activeRageLevel);
      inputSequence = '';
    }
  });

  // Lógica para o botão de Reset (Limpar Progresso)
  const btnReset = document.getElementById('btnReset');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      showRunicConfirm("RECOMEÇAR JORNADA", "Tem certeza que deseja apagar todos os segredos e progresso da jornada?", () => {
        showRunicMessage("JORNADA ENCERRADA", "Suas cinzas serão espalhadas pelo vento...");
        document.body.classList.add('fade-out'); // Ativa o efeito de escurecer do CSS

        setTimeout(() => {
          localStorage.clear(); // Limpa TUDO (segredos e checklist)
          window.location.reload(); // Recarrega para aplicar o estado inicial
        }, 1000); // Aguarda 1 segundo (tempo da transição CSS)
      });
    });
  }

  // 3. O Segredo do Ômega (5 Cliques)
  const footerOmega = document.querySelector('.footer-omega');
  if (footerOmega) {
    let omegaClicks = 0;
    footerOmega.addEventListener('click', () => {
      omegaClicks++;
      if (omegaClicks === 5) {
        foundSecrets.omega = true;
        saveSecrets();
        checkAllSecrets();
        window.awardGodOfWarProgress?.({ id: 'omega-secret', xp: 15, medal: 'omega-secret', relic: 'secret-relic', stat: 'omegaSecrets' });
        footerOmega.style.color = "var(--gold)";
        showRunicMessage("ᛒᚬᛏ", "Apenas os dignos conhecem o caminho.");
        omegaClicks = 0;
      }
    });
  }

  // 4. Injeção de Runas Ocultas (Aparece no hover no canto inferior direito)

  const runeTranslations = {
    "index.html": "Kratos vive. O ciclo continua.",
    "gameplay.html": "A arte da guerra é a sobrevivência.",
    "bestiario.html": "O flagelo dos reinos não conhece piedade.",
    "arvore-genealogica.html": "A linhagem de sangue é uma maldição divina.",
    "historias.html": "A saga dos deuses está escrita em sangue.",
    "platinar.html": "Seja melhor. Supere seus limites.",
    "armas.html": "As armas de guerra são o fardo do guerreiro.",
    "estatisticas.html": "Registros de guerra... o rastro da destruição.",
    "loja.html": "O ouro do Olimpo não compra a paz.",
    "criadores.html": "Escaldos contam histórias que os deuses temem.",
    "simulador.html": "A vitória é escrita por quem sobrevive.",
    "quiz.html": "A sabedoria é a arma que nenhum deus pode tomar.",
    "memoria.html": "As lembranças de uma guerra nunca desaparecem.",
    "comparador.html": "A força revela apenas parte do verdadeiro guerreiro.",
    "roleta.html": "Até os deuses temem o acaso dos Nove Reinos."
  };

  const runeContainer = document.createElement('div');
  runeContainer.className = 'rune-container';

  const runeCounter = document.createElement('span');
  runeCounter.className = 'rune-counter';
  
  const rune = document.createElement('div');
  rune.className = 'hidden-rune';
  rune.innerText = runeMessages[currentPath] || "ᚴᚱᛅᛏᚬᛋ";
  
  // Ao clicar na runa, mostra a tradução oculta
  rune.addEventListener('click', () => {
    const msg = runeTranslations[currentPath] || "Apenas os dignos conhecem o caminho.";
    showRunicMessage("ᚴᚱᛅᛏᚬᛋ", `"${msg}"`);
    
    // Adiciona ao progresso se for a primeira vez nesta página
    if (!foundSecrets.runesFound.includes(currentPath)) {
      foundSecrets.runesFound.push(currentPath);
      saveSecrets();
      checkAllSecrets();
      window.awardGodOfWarProgress?.({ id: `rune:${currentPath}`, xp: 5, medal: 'rune-seeker', relic: 'secret-relic', stat: 'runesFound' });
      if (foundSecrets.runesFound.length === Object.keys(runeMessages).length) {
        window.awardGodOfWarProgress?.({ id: 'all-runes', xp: 50, medal: 'all-runes', relic: 'secret-relic', stat: 'allRunes' });
      }
    }
  });

  runeContainer.appendChild(runeCounter);
  runeContainer.appendChild(rune);
  document.body.appendChild(runeContainer);

  // Inicializa os segredos ao carregar
  loadSecrets();
  let savedRageExpiry = 0;
  let savedRageLevel = 'maximum';
  let savedGodMode = false;
  try { savedRageExpiry = Number(sessionStorage.getItem('kratos_rage_until')); } catch {}
  try { savedRageLevel = sessionStorage.getItem('kratos_rage_level') || 'maximum'; } catch {}
  try { savedGodMode = sessionStorage.getItem('kratos_god_mode') === 'true'; } catch {}
  if (savedRageExpiry > Date.now()) activateRage(savedRageLevel, { duration: savedRageExpiry - Date.now(), godMode: savedGodMode, showImpact: false });
  else {
    try { sessionStorage.removeItem('kratos_rage_until'); } catch {}
    updateRageButtons();
  }
});