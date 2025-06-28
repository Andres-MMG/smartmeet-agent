import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { IPCService } from './services/ipc.service';
import { SettingsService } from './services/settings.service';
import { APP_CONFIG } from '../shared/constants';

class SmartMeetApp {
  private mainWindow: BrowserWindow | null = null;
  private ipcService: IPCService;
  private settingsService: SettingsService;

  constructor() {
    this.ipcService = new IPCService();
    this.settingsService = new SettingsService();
    this.initializeApp();
  }

  private async initializeApp(): Promise<void> {
    // Handle app ready
    app.whenReady().then(() => {
      this.createMainWindow();
      this.setupIPCHandlers();

      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createMainWindow();
        }
      });
    });

    // Handle app lifecycle
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
  }

  private createMainWindow(): void {
    this.mainWindow = new BrowserWindow({
      width: APP_CONFIG.WINDOW.DEFAULT_WIDTH,
      height: APP_CONFIG.WINDOW.DEFAULT_HEIGHT,
      minWidth: APP_CONFIG.WINDOW.MIN_WIDTH,
      minHeight: APP_CONFIG.WINDOW.MIN_HEIGHT,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '../../preload/preload/preload.js'),
        webSecurity: true,
      },
      titleBarStyle: 'default',
      show: false, // Don't show until ready
    });

    // Load the renderer
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
      this.mainWindow.loadURL('http://localhost:5173');
      this.mainWindow.webContents.openDevTools();
    } else {
      this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    }

    // Show window when ready
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
    });

    // Handle window closed
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  private setupIPCHandlers(): void {
    this.ipcService.setupHandlers();

    // App-specific handlers
    ipcMain.handle('app:get-version', () => {
      return APP_CONFIG.VERSION;
    });

    ipcMain.handle('app:get-settings', async () => {
      return await this.settingsService.getSettings();
    });

    ipcMain.handle('app:update-settings', async (event, settings) => {
      return await this.settingsService.updateSettings(settings);
    });
  }

  public getMainWindow(): BrowserWindow | null {
    return this.mainWindow;
  }
}

// Create and export app instance
const smartMeetApp = new SmartMeetApp();
export default smartMeetApp;
