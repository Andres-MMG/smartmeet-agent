import React, { useEffect } from 'react';
import { useMeetingStore } from '../../stores/meetingStore';
import { useUIStore } from '../../stores/uiStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export const Dashboard: React.FC = () => {
  const { meetings, isLoading, loadMeetings, startRecording, currentSession } = useMeetingStore();
  const { addNotification } = useUIStore();

  useEffect(() => {
    loadMeetings();
  }, [loadMeetings]);

  const handleStartRecording = async (meetingId: string) => {
    try {
      await startRecording(meetingId);
      addNotification({
        type: 'success',
        title: 'Recording Started',
        message: 'Meeting recording has been started successfully.',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Recording Failed',
        message: 'Failed to start meeting recording.',
      });
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    }).format(date);
  };

  const getTimeUntilMeeting = (startTime: Date) => {
    const now = new Date();
    const diff = startTime.getTime() - now.getTime();
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 0) return 'In progress';
    if (minutes < 60) return `In ${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `In ${hours}h ${remainingMinutes}m`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading meetings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Session Status */}
      {currentSession && (
        <Card title="Current Recording Session" className="border-blue-200 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-900">{currentSession.event.title}</h4>
              <p className="text-blue-700">Status: {currentSession.status}</p>
              <p className="text-blue-600 text-sm">
                Started: {currentSession.startedAt?.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-600 font-medium">Recording</span>
            </div>
          </div>
        </Card>
      )}

      {/* Upcoming Meetings */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Upcoming Meetings</h2>
        {meetings.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V7a2 2 0 012-2h4a2 2 0 012 2v0M8 7h8m-9 4a5 5 0 1010 0H7z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No meetings</h3>
              <p className="mt-1 text-sm text-gray-500">
                No upcoming meetings found. Connect your calendar to see meetings.
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {meetings.map(meeting => (
              <Card key={meeting.id}>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                    <p className="text-sm text-gray-600">{formatTime(meeting.startTime)}</p>
                    <p className="text-xs text-blue-600">
                      {getTimeUntilMeeting(meeting.startTime)}
                    </p>
                  </div>

                  {meeting.participants.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500">Participants:</p>
                      <p className="text-sm text-gray-700">
                        {meeting.participants.slice(0, 2).join(', ')}
                      </p>
                      {meeting.participants.length > 2 && (
                        <p className="text-xs text-gray-500">
                          +{meeting.participants.length - 2} more
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleStartRecording(meeting.id)}
                      disabled={!!currentSession}
                      className="flex-1"
                    >
                      {currentSession?.event.id === meeting.id ? 'Recording...' : 'Start Recording'}
                    </Button>
                    {meeting.meetingUrl && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => window.open(meeting.meetingUrl, '_blank')}
                      >
                        Join
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{meetings.length}</p>
            <p className="text-sm text-gray-600">Upcoming Meetings</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">0</p>
            <p className="text-sm text-gray-600">Completed Sessions</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">0</p>
            <p className="text-sm text-gray-600">Generated Summaries</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
