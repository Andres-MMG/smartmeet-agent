import React, { useEffect, useState } from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useUIStore } from '../../stores/uiStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { AppSettings } from '../../../shared/types';

export const Settings: React.FC = () => {
  const { settings, isLoading, loadSettings, updateSettings } = useSettingsStore();
  const { addNotification } = useUIStore();
  const [localSettings, setLocalSettings] = useState<AppSettings | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
      setHasChanges(false);
    }
  }, [settings]);

  const handleSettingChange = (section: keyof AppSettings, key: string, value: any) => {
    if (!localSettings) return;

    const newSettings = {
      ...localSettings,
      [section]: {
        ...localSettings[section],
        [key]: value,
      },
    };

    setLocalSettings(newSettings);
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    if (!localSettings) return;

    try {
      await updateSettings(localSettings);
      setHasChanges(false);
      addNotification({
        type: 'success',
        title: 'Settings Saved',
        message: 'Your settings have been saved successfully.',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Save Failed',
        message: 'Failed to save settings. Please try again.',
      });
    }
  };

  const handleResetSettings = () => {
    if (settings) {
      setLocalSettings(settings);
      setHasChanges(false);
    }
  };

  if (isLoading || !localSettings) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Application Settings</h2>
        {hasChanges && (
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={handleResetSettings}>
              Reset
            </Button>
            <Button onClick={handleSaveSettings}>Save Changes</Button>
          </div>
        )}
      </div>

      {/* General Settings */}
      <Card title="General Settings">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select
              value={localSettings.general.theme}
              onChange={e => handleSettingChange('general', 'theme', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={localSettings.general.language}
              onChange={e => handleSettingChange('general', 'language', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="es">Spanish</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={localSettings.general.autoStart}
              onChange={e => handleSettingChange('general', 'autoStart', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Start automatically on system boot
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={localSettings.general.minimizeToTray}
              onChange={e => handleSettingChange('general', 'minimizeToTray', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Minimize to system tray</label>
          </div>
        </div>
      </Card>

      {/* Recording Settings */}
      <Card title="Recording Settings">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Audio Quality</label>
            <select
              value={localSettings.recording.audioQuality}
              onChange={e => handleSettingChange('recording', 'audioQuality', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="low">Low (8kHz)</option>
              <option value="medium">Medium (16kHz)</option>
              <option value="high">High (44kHz)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Screenshot Interval (seconds)
            </label>
            <input
              type="number"
              min="10"
              max="300"
              value={localSettings.recording.screenshotInterval / 1000}
              onChange={e =>
                handleSettingChange(
                  'recording',
                  'screenshotInterval',
                  parseInt(e.target.value) * 1000
                )
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={localSettings.recording.enableAudioRecording}
              onChange={e =>
                handleSettingChange('recording', 'enableAudioRecording', e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Enable audio recording</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={localSettings.recording.enableScreenCapture}
              onChange={e =>
                handleSettingChange('recording', 'enableScreenCapture', e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Enable screen capture</label>
          </div>
        </div>
      </Card>

      {/* AI Settings */}
      <Card title="AI Settings">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">AI Provider</label>
            <select
              value={localSettings.ai.provider}
              onChange={e => handleSettingChange('ai', 'provider', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
            <input
              type="text"
              value={localSettings.ai.model}
              onChange={e => handleSettingChange('ai', 'model', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., gpt-4-turbo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Processing Language
            </label>
            <select
              value={localSettings.ai.language}
              onChange={e => handleSettingChange('ai', 'language', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="es">Spanish</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card title="Notification Settings">
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={localSettings.notifications.enabled}
              onChange={e => handleSettingChange('notifications', 'enabled', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Enable notifications</label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pre-meeting notification (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={localSettings.notifications.preMeetingMinutes}
              onChange={e =>
                handleSettingChange('notifications', 'preMeetingMinutes', parseInt(e.target.value))
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={localSettings.notifications.showSystemNotifications}
              onChange={e =>
                handleSettingChange('notifications', 'showSystemNotifications', e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Show system notifications</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={localSettings.notifications.emailNotifications}
              onChange={e =>
                handleSettingChange('notifications', 'emailNotifications', e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Email notifications</label>
          </div>
        </div>
      </Card>
    </div>
  );
};
