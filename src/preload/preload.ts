import { contextBridge, ipcRenderer } from 'electron';
import { IPCMessage, IPCResponse, AppSettings, MeetingEvent } from '../shared/types';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
const electronAPI = {
  // Generic IPC communication
  invoke: async <T = any>(channel: string, message: IPCMessage): Promise<IPCResponse<T>> => {
    return await ipcRenderer.invoke(channel, message);
  },

  // Simplified API methods
  getVersion: async (): Promise<string> => {
    return await ipcRenderer.invoke('app:get-version');
  },

  getSettings: async (): Promise<AppSettings> => {
    return await ipcRenderer.invoke('app:get-settings');
  },

  updateSettings: async (settings: Partial<AppSettings>): Promise<AppSettings> => {
    return await ipcRenderer.invoke('app:update-settings', settings);
  },

  getMeetings: async (): Promise<MeetingEvent[]> => {
    const message: IPCMessage = {
      id: Date.now().toString(),
      type: 'meetings:get',
      payload: {},
      timestamp: Date.now(),
    };
    const response = await ipcRenderer.invoke('ipc-request', message);
    return response.success ? response.data : [];
  },

  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window:maximize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),

  // Event listeners
  onNotification: (callback: (data: any) => void) => {
    ipcRenderer.on('notification', (event, data) => callback(data));
  },

  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  },
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', electronAPI);
  } catch (error) {
    console.error('Failed to expose electron API:', error);
  }
} else {
  // @ts-ignore (define in global)
  window.electronAPI = electronAPI;
}

export type ElectronAPI = typeof electronAPI;
