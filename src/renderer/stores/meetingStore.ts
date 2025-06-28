import { create } from 'zustand';
import { MeetingEvent, MeetingSession } from '../../shared/types';

interface MeetingState {
  meetings: MeetingEvent[];
  currentSession: MeetingSession | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadMeetings: () => Promise<void>;
  startRecording: (meetingId: string) => Promise<void>;
  stopRecording: () => Promise<void>;
  setCurrentSession: (session: MeetingSession | null) => void;
  setError: (error: string | null) => void;
}

export const useMeetingStore = create<MeetingState>((set, get) => ({
  meetings: [],
  currentSession: null,
  isLoading: false,
  error: null,

  loadMeetings: async () => {
    set({ isLoading: true, error: null });
    try {
      const meetings = await window.electronAPI.getMeetings();
      set({ meetings, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load meetings';
      set({ error: errorMessage, isLoading: false });
    }
  },

  startRecording: async (meetingId: string) => {
    const { meetings } = get();
    const meeting = meetings.find(m => m.id === meetingId);
    if (!meeting) {
      set({ error: 'Meeting not found' });
      return;
    }

    const session: MeetingSession = {
      id: `session-${meetingId}-${Date.now()}`,
      event: meeting,
      status: 'recording',
      startedAt: new Date(),
      screenshots: [],
    };

    set({ currentSession: session });

    // TODO: Implement actual recording logic
    console.log('Started recording for meeting:', meeting.title);
  },

  stopRecording: async () => {
    const { currentSession } = get();
    if (!currentSession) {
      set({ error: 'No active recording session' });
      return;
    }

    const updatedSession: MeetingSession = {
      ...currentSession,
      status: 'completed',
      endedAt: new Date(),
    };

    set({ currentSession: updatedSession });

    // TODO: Implement actual stop recording logic
    console.log('Stopped recording for session:', currentSession.id);
  },

  setCurrentSession: (session: MeetingSession | null) => {
    set({ currentSession: session });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
