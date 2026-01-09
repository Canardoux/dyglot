// electron/main.mjs
/*
import { app, BrowserWindow, protocol } from 'electron';
import path from 'node:path';

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true } }
]);

function registerAppProtocol() {
  protocol.registerFileProtocol('app', (request, callback) => {
    try {
      // ex: app://-/ , app://-/_app/immutable/...
      let url = request.url.replace('app://-/', ''); // '' ou '_app/...'
      url = url.split('?')[0].split('#')[0]; // safety

      // si on demande la racine, on sert index.html
      if (url === '' || url === '/') url = 'index.html';

      const buildDir = path.join(app.getAppPath(), 'build');
      const filePath = path.join(buildDir, url);

      callback({ path: filePath });
    } catch {
      callback({ error: -6 });
    }
  });
}

async function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: true,
    webPreferences: {
      // IMPORTANT: on débug d’abord. On resserrera ensuite.
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
    }
  });


  const isDev = !app.isPackaged;

  if (isDev) win.webContents.openDevTools({ mode: 'detach' });


  // 2) Logs ultra utiles
  win.webContents.on('console-message', (_e, level, message, line, sourceId) => {
    console.log('RENDERER console:', { level, message, line, sourceId });
  });
  win.webContents.on('render-process-gone', (_e, details) => {
    console.error('RENDERER GONE:', details);
  });
  win.webContents.on('did-fail-load', (_e, code, desc, url) => {
    console.error('did-fail-load:', { code, desc, url });
  });

  // 3) Charger via app://
  await win.loadURL('app://-/');
}

app.commandLine.appendSwitch('enable-logging');
app.commandLine.appendSwitch('v', '1');

app.whenReady().then(() => {
  registerAppProtocol();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
*/

/*

import { app, BrowserWindow, protocol } from 'electron';
import path from 'node:path';

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true
    }
  }
]);

function registerAppProtocol() {
  protocol.registerFileProtocol('app', (request, callback) => {
    try {
      let url = request.url.replace('app://-/', '');
      url = url.split('?')[0].split('#')[0];
      if (url === '' || url === '/') url = 'index.html';

      const filePath = path.join(app.getAppPath(), 'build', url);
      callback({ path: filePath });
    } catch {
      callback({ error: -6 });
    }
  });
}

async function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false
    }
  });

win.webContents.openDevTools({ mode: 'detach' });

win.webContents.on('did-fail-load', (_e, code, desc, url) => {
  console.error('did-fail-load:', { code, desc, url });
});

win.webContents.on('console-message', (_e, level, message, line, sourceId) => {
  console.log('renderer console:', { level, message, line, sourceId });
});

  await win.loadURL('app://-/');
}

app.whenReady().then(() => {
  registerAppProtocol();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
*/

// electron/main.mjs
import { app, BrowserWindow, protocol } from 'electron';
import path from 'node:path';

const DEBUG = process.env.ELECTRON_DEBUG === '1';

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true } }
]);

function registerAppProtocol() {
  protocol.registerFileProtocol('app', (request, callback) => {
    try {
      let url = request.url.replace('app://-/', '');
      url = url.split('?')[0].split('#')[0];
      if (url === '' || url === '/') url = 'index.html';

      const buildDir = path.join(app.getAppPath(), 'build');
      const filePath = path.join(buildDir, url);
      callback({ path: filePath });
    } catch {
      callback({ error: -6 }); // FILE_NOT_FOUND
    }
  });
}

async function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: true,
    webPreferences: {
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  //if (DEBUG) {
    win.webContents.openDevTools({ mode: 'detach' });
    win.webContents.on('did-fail-load', (_e, code, desc, url) => console.error('did-fail-load:', { code, desc, url }));
    win.webContents.on('render-process-gone', (_e, details) => console.error('renderer gone:', details));
    win.webContents.on('console-message', (_e, level, message, line, sourceId) =>
      console.log('renderer:', { level, message, line, sourceId })
    );
  //}

  await win.loadURL('app://-/');
}

app.whenReady().then(() => {
  registerAppProtocol();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});