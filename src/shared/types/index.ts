// IPC Communication Types
export interface IPCMessage<T = any> {
  id: string;
  type: string;
  payload: T;
  timestamp: number;
}

export interface IPCResponse<T = any> {
  id: string;
  success: boolean;
  data?: T;
  error?: string;
}

// Meeting Related Types
export interface MeetingEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  participants: string[];
  location?: string;
  description?: string;
  isVideoConference: boolean;
  meetingUrl?: string;
}

export interface MeetingSession {
  id: string;
  event: MeetingEvent;
  status: 'idle' | 'recording' | 'processing' | 'completed';
  startedAt?: Date;
  endedAt?: Date;
  audioFile?: string;
  screenshots: string[];
  transcript?: string;
  summary?: MeetingSummary;
}

export interface MeetingSummary {
  keyPoints: string[];
  decisions: string[];
  actions: ActionItem[];
  nextSteps: string[];
  participants: string[];
  duration: number;
}

export interface ActionItem {
  task: string;
  assignee: string;
  dueDate?: Date;
  status: 'pending' | 'in-progress' | 'completed';
}

// System Types
export interface AppSettings {
  general: GeneralSettings;
  recording: RecordingSettings;
  ai: AISettings;
  notifications: NotificationSettings;
}

export interface GeneralSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  autoStart: boolean;
  minimizeToTray: boolean;
}

export interface RecordingSettings {
  audioQuality: 'low' | 'medium' | 'high';
  screenshotInterval: number;
  enableAudioRecording: boolean;
  enableScreenCapture: boolean;
}

export interface AISettings {
  provider: 'openai' | 'anthropic';
  model: string;
  apiKey?: string;
  language: string;
  summaryTemplate: string;
}

export interface NotificationSettings {
  enabled: boolean;
  preMeetingMinutes: number;
  showSystemNotifications: boolean;
  emailNotifications: boolean;
}

// UI State Types
export interface UIState {
  currentView: 'dashboard' | 'meetings' | 'settings' | 'review';
  isLoading: boolean;
  notifications: Notification[];
  modals: {
    settings: boolean;
    meetingDetails: boolean;
  };
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}
