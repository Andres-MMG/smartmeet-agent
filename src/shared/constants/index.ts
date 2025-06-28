// IPC Channel Constants
export const IPC_CHANNELS = {
  // App Lifecycle
  APP_READY: 'app:ready',
  APP_QUIT: 'app:quit',

  // Settings
  GET_SETTINGS: 'settings:get',
  UPDATE_SETTINGS: 'settings:update',

  // Meetings
  GET_MEETINGS: 'meetings:get',
  START_RECORDING: 'meetings:start-recording',
  STOP_RECORDING: 'meetings:stop-recording',
  GET_MEETING_STATUS: 'meetings:status',

  // Notifications
  SHOW_NOTIFICATION: 'notifications:show',
  NOTIFICATION_CLICKED: 'notifications:clicked',

  // Window Management
  MINIMIZE_WINDOW: 'window:minimize',
  MAXIMIZE_WINDOW: 'window:maximize',
  CLOSE_WINDOW: 'window:close',
} as const;

export type IPCChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS];

// API Endpoints
export const API_ENDPOINTS = {
  GOOGLE_CALENDAR: 'https://www.googleapis.com/calendar/v3',
  MICROSOFT_GRAPH: 'https://graph.microsoft.com/v1.0',
  OPENAI_API: 'https://api.openai.com/v1',
  ANTHROPIC_API: 'https://api.anthropic.com/v1',
} as const;

// Application Constants
export const APP_CONFIG = {
  NAME: 'SmartMeet Agent',
  VERSION: '1.0.0',
  WINDOW: {
    MIN_WIDTH: 800,
    MIN_HEIGHT: 600,
    DEFAULT_WIDTH: 1200,
    DEFAULT_HEIGHT: 800,
  },
  RECORDING: {
    DEFAULT_AUDIO_QUALITY: 16000, // 16kHz
    SCREENSHOT_INTERVAL: 30000, // 30 seconds
    MAX_RECORDING_TIME: 7200000, // 2 hours in ms
  },
} as const;
