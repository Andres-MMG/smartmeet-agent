import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { IPCMessage, IPCResponse } from '../../shared/types';
import { IPC_CHANNELS } from '../../shared/constants';

export class IPCService {
  private handlers: Map<string, (payload: any) => Promise<any>> = new Map();

  constructor() {
    this.setupBaseHandlers();
  }

  public setupHandlers(): void {
    // Generic IPC handler
    ipcMain.handle('ipc-request', async (event: IpcMainInvokeEvent, message: IPCMessage) => {
      try {
        const handler = this.handlers.get(message.type);
        if (!handler) {
          throw new Error(`No handler found for IPC message type: ${message.type}`);
        }

        const result = await handler(message.payload);

        const response: IPCResponse = {
          id: message.id,
          success: true,
          data: result,
        };

        return response;
      } catch (error) {
        const response: IPCResponse = {
          id: message.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };

        return response;
      }
    });
  }

  private setupBaseHandlers(): void {
    // Register base handlers
    this.registerHandler(IPC_CHANNELS.APP_READY, async () => {
      console.log('App ready IPC received');
      return { status: 'ready', timestamp: Date.now() };
    });

    this.registerHandler(IPC_CHANNELS.GET_SETTINGS, async () => {
      // Default settings for MVP
      return {
        general: {
          theme: 'system',
          language: 'es',
          autoStart: false,
          minimizeToTray: true,
        },
        recording: {
          audioQuality: 'medium',
          screenshotInterval: 30000,
          enableAudioRecording: true,
          enableScreenCapture: true,
        },
        ai: {
          provider: 'openai',
          model: 'gpt-4-turbo',
          language: 'es',
          summaryTemplate: 'standard',
        },
        notifications: {
          enabled: true,
          preMeetingMinutes: 5,
          showSystemNotifications: true,
          emailNotifications: false,
        },
      };
    });

    this.registerHandler(IPC_CHANNELS.GET_MEETINGS, async () => {
      // Mock meetings data for MVP
      return [
        {
          id: '1',
          title: 'Daily Standup',
          startTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
          endTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
          participants: ['john@example.com', 'jane@example.com'],
          isVideoConference: true,
          meetingUrl: 'https://zoom.us/j/123456789',
        },
        {
          id: '2',
          title: 'Project Review',
          startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
          endTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
          participants: ['alice@example.com', 'bob@example.com', 'charlie@example.com'],
          isVideoConference: true,
          meetingUrl: 'https://meet.google.com/abc-def-ghi',
        },
      ];
    });
  }

  public registerHandler(type: string, handler: (payload: any) => Promise<any>): void {
    this.handlers.set(type, handler);
    console.log(`IPC handler registered for: ${type}`);
  }

  public removeHandler(type: string): void {
    this.handlers.delete(type);
    console.log(`IPC handler removed for: ${type}`);
  }
}
