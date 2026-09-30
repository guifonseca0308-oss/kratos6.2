const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const PCSX2_DOWNLOADS = 'https://pcsx2.net/downloads/';
const validGames = new Set(['gow1', 'gow2']);
let mainWindow;

function settingsPath() {
  return path.join(app.getPath('userData'), 'launcher-settings.json');
}

function readSettings() {
  try {
    return JSON.parse(fs.readFileSync(settingsPath(), 'utf8'));
  } catch {
    return { emulatorPath: '', games: {} };
  }
}

function writeSettings(settings) {
  fs.mkdirSync(path.dirname(settingsPath()), { recursive: true });
  fs.writeFileSync(settingsPath(), JSON.stringify(settings, null, 2));
}

function findInstalledEmulator(settings) {
  const candidates = [
    settings.emulatorPath,
    path.join(process.env.ProgramFiles || '', 'PCSX2', 'pcsx2-qt.exe'),
    path.join(process.env['ProgramFiles(x86)'] || '', 'PCSX2', 'pcsx2-qt.exe'),
    path.join(process.env.LOCALAPPDATA || '', 'Programs', 'PCSX2', 'pcsx2-qt.exe'),
    path.join(process.env.LOCALAPPDATA || '', 'PCSX2', 'pcsx2-qt.exe'),
    path.join(process.env.USERPROFILE || '', 'PCSX2', 'pcsx2-qt.exe')
  ];

  return candidates.find(candidate => candidate && fs.existsSync(candidate)) || '';
}

async function chooseEmulator(settings) {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Localize o executável do PCSX2',
    properties: ['openFile'],
    filters: [{ name: 'PCSX2', extensions: ['exe'] }]
  });

  if (result.canceled || !result.filePaths[0]) {
    await shell.openExternal(PCSX2_DOWNLOADS);
    return '';
  }

  settings.emulatorPath = result.filePaths[0];
  writeSettings(settings);
  return settings.emulatorPath;
}

async function chooseGameFile(gameId, settings) {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: gameId === 'gow1' ? 'Selecione sua cópia de God of War' : 'Selecione sua cópia de God of War II',
    properties: ['openFile'],
    filters: [{ name: 'Jogos de PlayStation 2', extensions: ['iso', 'chd', 'cso', 'cue', 'elf'] }]
  });

  if (result.canceled || !result.filePaths[0]) return '';

  settings.games[gameId] = result.filePaths[0];
  writeSettings(settings);
  return settings.games[gameId];
}

function launchGame(emulatorPath, gamePath) {
  return new Promise(resolve => {
    const emulator = spawn(emulatorPath, [gamePath], {
      detached: true,
      stdio: 'ignore',
      windowsHide: false
    });

    emulator.once('error', error => {
      resolve({ ok: false, message: `Não foi possível abrir o PCSX2: ${error.message}` });
    });
    emulator.once('spawn', () => {
      emulator.unref();
      resolve({ ok: true, message: 'Jogo aberto no PCSX2.' });
    });
  });
}

ipcMain.handle('play-game', async (_event, gameId) => {
  if (!validGames.has(gameId)) {
    return { ok: false, message: 'Jogo inválido.' };
  }

  const settings = readSettings();
  let emulatorPath = findInstalledEmulator(settings);

  if (!emulatorPath) {
    emulatorPath = await chooseEmulator(settings);
    if (!emulatorPath) {
      return {
        ok: false,
        message: 'Baixe e instale o PCSX2 pelo site oficial; depois clique em JOGAR e selecione o executável.'
      };
    }
  } else if (settings.emulatorPath !== emulatorPath) {
    settings.emulatorPath = emulatorPath;
    writeSettings(settings);
  }

  let gamePath = settings.games[gameId];
  if (!gamePath || !fs.existsSync(gamePath)) {
    gamePath = await chooseGameFile(gameId, settings);
    if (!gamePath) {
      return { ok: false, message: 'Selecione o arquivo do jogo para continuar.' };
    }
  }

  return launchGame(emulatorPath, gamePath);
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 900,
    minWidth: 360,
    minHeight: 560,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'emulador-ps2.html'));
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});