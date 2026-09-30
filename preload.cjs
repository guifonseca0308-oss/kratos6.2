const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('kratosDesktop', {
  playGame: gameId => ipcRenderer.invoke('play-game', gameId)
});