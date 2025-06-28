import React, { useEffect } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './components/features/Dashboard';
import { Settings } from './components/features/Settings';
import { useUIStore } from './stores/uiStore';
import { Card } from './components/ui/Card';

const App: React.FC = () => {
  const { currentView, notifications, removeNotification } = useUIStore();

  useEffect(() => {
    // Initialize the app
    console.log('SmartMeet Agent initialized');
  }, []);

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Dashboard';
      case 'meetings':
        return 'Meetings';
      case 'settings':
        return 'Settings';
      case 'review':
        return 'Review';
      default:
        return 'SmartMeet Agent';
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'meetings':
        return (
          <Card title="Meetings" subtitle="Meeting management coming soon">
            <p className="text-gray-600">This feature will be implemented in future sprints.</p>
          </Card>
        );
      case 'settings':
        return <Settings />;
      case 'review':
        return (
          <Card title="Review" subtitle="Meeting review and summaries coming soon">
            <p className="text-gray-600">This feature will be implemented in future sprints.</p>
          </Card>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen">
      <MainLayout title={getPageTitle()}>{renderCurrentView()}</MainLayout>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.slice(0, 3).map(notification => (
            <div
              key={notification.id}
              className={`max-w-sm p-4 rounded-lg shadow-lg border cursor-pointer transition-all ${
                notification.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : notification.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : notification.type === 'warning'
                  ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}
              onClick={() => removeNotification(notification.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium">{notification.title}</h4>
                  <p className="text-sm mt-1 opacity-90">{notification.message}</p>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    removeNotification(notification.id);
                  }}
                  className="ml-2 text-current opacity-50 hover:opacity-100"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
