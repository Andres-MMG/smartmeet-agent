import * as fs from 'fs/promises';
import * as path from 'path';
import { app } from 'electron';
import { AppSettings } from '../../shared/types';

export class SettingsService {
  private settingsPath: string;
  private settings: AppSettings | null = null;

  constructor() {
    const userDataPath = app.getPath('userData');
    this.settingsPath = path.join(userDataPath, 'settings.json');
  }

  public async getSettings(): Promise<AppSettings> {
    if (this.settings) {
      return this.settings;
    }

    try {
      const data = await fs.readFile(this.settingsPath, 'utf-8');
      this.settings = JSON.parse(data);
      return this.settings!;
    } catch (error) {
      // If file doesn't exist or is corrupted, return default settings
      console.log('Settings file not found, creating default settings');
      this.settings = this.getDefaultSettings();
      await this.saveSettings();
      return this.settings;
    }
  }

  public async updateSettings(newSettings: Partial<AppSettings>): Promise<AppSettings> {
    const currentSettings = await this.getSettings();

    // Deep merge settings
    this.settings = {
      ...currentSettings,
      general: { ...currentSettings.general, ...newSettings.general },
      recording: { ...currentSettings.recording, ...newSettings.recording },
      ai: { ...currentSettings.ai, ...newSettings.ai },
      notifications: { ...currentSettings.notifications, ...newSettings.notifications },
    };

    await this.saveSettings();
    return this.settings;
  }

  private async saveSettings(): Promise<void> {
    if (!this.settings) {
      throw new Error('No settings to save');
    }

    try {
      // Ensure directory exists
      const dir = path.dirname(this.settingsPath);
      await fs.mkdir(dir, { recursive: true });

      // Write settings
      await fs.writeFile(this.settingsPath, JSON.stringify(this.settings, null, 2));
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    }
  }

  private getDefaultSettings(): AppSettings {
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
  }
}
