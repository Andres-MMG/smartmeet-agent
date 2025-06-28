// Jest setup file
import '@testing-library/jest-dom';

// Mock Electron APIs for testing
const electronMock = {
  invoke: jest.fn(),
  getVersion: jest.fn().mockResolvedValue('1.0.0'),
  getSettings: jest.fn().mockResolvedValue({}),
  updateSettings: jest.fn().mockResolvedValue({}),
  getMeetings: jest.fn().mockResolvedValue([]),
  minimizeWindow: jest.fn(),
  maximizeWindow: jest.fn(),
  closeWindow: jest.fn(),
  onNotification: jest.fn(),
  removeAllListeners: jest.fn()
};

// Mock global window.electronAPI
global.window = Object.create(window);
Object.defineProperty(window, 'electronAPI', {
  value: electronMock,
  writable: true
});

// Mock Zustand persist
jest.mock('zustand/middleware', () => ({
  persist: jest.fn((fn) => fn),
}));