import React, { useEffect, useState, useCallback } from 'react';
import sharedService from '../../services/SharedService';
import accountService from '../../services/AccountService';

interface ExpiringSessionState {
  isOpen: boolean;
}

const ExpiringSessionCountdownComponent: React.FC = () => {
  const [state, setState] = useState<ExpiringSessionState>({ isOpen: false });
  const [remainingTime, setRemainingTime] = useState(120);
  const [displayTime, setDisplayTime] = useState('02:00');
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const startCountdown = useCallback(() => {
    console.log('Starting countdown...');
    try {
      setRemainingTime(120);
      setDisplayTime(formatTime(120));

      const id = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 0) {
            console.log('Countdown finished, logging out...');
            clearInterval(id);
            setIntervalId(null);
            sharedService.showNotification(false, 'Logged Out', 'You have been logged out due to inactivity');
            logout();
            return 0;
          }
          const newTime = prev - 1;
          setDisplayTime(formatTime(newTime));
          return newTime;
        });
      }, 1000);

      setIntervalId(id);
    } catch (error) {
      console.error('Error in startCountdown:', error);
    }
  }, []);

  const stopCountdown = useCallback(() => {
    console.log('Stopping countdown...');
    try {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    } catch (error) {
      console.error('Error in stopCountdown:', error);
    }
  }, [intervalId]);

  const formatTime = (seconds: number): string => {
    try {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${pad(minutes)}:${pad(remainingSeconds)}`;
    } catch (error) {
      console.error('Error in formatTime:', error);
      return '00:00';
    }
  };

  const pad = (value: number): string => {
    try {
      return value < 10 ? `0${value}` : value.toString();
    } catch (error) {
      console.error('Error in pad:', error);
      return '00';
    }
  };

  const logout = () => {
    console.log('Logout button clicked, logging out...');
    try {
      stopCountdown();
      sharedService.closeExpiringSessionCountdown();
      accountService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
      sharedService.showNotification(false, 'Error', 'Failed to log out. Please try again.');
    }
  };

  const resumeSession = async () => {
    console.log('Stay Logged In button clicked, resuming session...');
    try {
      stopCountdown();
      sharedService.closeExpiringSessionCountdown();
      const success = await accountService.refreshToken();
      if (!success) {
        console.warn('Token refresh failed, but user will not be logged out automatically.');
        sharedService.showNotification(false, 'Session Error', 'Failed to refresh session. Please try logging in again.');
      } else {
        console.log('Session resumed successfully.');
        sharedService.showNotification(true, 'Success', 'Session has been extended.');
        // নতুন টাইমআউট শুরু করা
        accountService.checkUserIdleTimeout();
      }
    } catch (error) {
      console.error('Error during resumeSession:', error);
      sharedService.showNotification(false, 'Error', 'An unexpected error occurred. Please try again.');
    }
  };

  useEffect(() => {
    console.log('Subscribing to expiringSession$...');
    try {
      const subscription = sharedService.expiringSession$.subscribe((newState) => {
        console.log('New state received:', newState);
        setState(newState);
      });

      return () => {
        console.log('Unsubscribing from expiringSession$...');
        subscription.unsubscribe();
        stopCountdown();
      };
    } catch (error) {
      console.error('Error in subscription useEffect:', error);
    }
  }, [stopCountdown]);

  useEffect(() => {
    console.log('Modal useEffect triggered with state.isOpen:', state.isOpen);
    try {
      if (state.isOpen) {
        const modalElement = document.getElementById('expiringSessionModal');
        console.log('Modal element found:', modalElement);
        console.log('window.bootstrap:', (window as any).bootstrap);
        console.log('window.bootstrap.Modal:', (window as any).bootstrap?.Modal);
        if (modalElement && (window as any).bootstrap?.Modal) {
          console.log('Opening modal...');
          const modal = new (window as any).bootstrap.Modal(modalElement, {
            backdrop: 'static',
            keyboard: false,
          });
          modal.show();
          startCountdown();

          return () => {
            console.log('Hiding modal on cleanup...');
            modal.hide();
            stopCountdown();
          };
        } else {
          console.error('Bootstrap Modal is not available. Ensure Bootstrap JS is loaded.');
          if (!modalElement) {
            console.error('Modal element not found. Ensure the modal HTML is rendered correctly.');
          }
        }
      } else {
        console.log('Closing modal...');
        stopCountdown();
        const modalElement = document.getElementById('expiringSessionModal');
        if (modalElement && (window as any).bootstrap?.Modal) {
          const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
          modal?.hide();
        }
      }
    } catch (error) {
      console.error('Error in modal useEffect:', error);
    }
  }, [state.isOpen, startCountdown, stopCountdown]);

  if (!state.isOpen) {
    console.log('Modal is not open, returning null...');
    return null;
  }

  console.log('Rendering modal with displayTime:', displayTime);
  return (
    <div className="modal fade" id="expiringSessionModal" tabIndex={-1} aria-labelledby="expiringSessionModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h4 className="modal-title">Session Timeout Warning</h4>
          </div>
          <div className="modal-body">
            <p style={{ fontSize: '1.5rem' }}>
              Your session is about to time out, do you want to continue your session? {displayTime} time left
            </p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-danger" onClick={logout}>
              Logout
            </button>
            <button className="btn btn-success" onClick={resumeSession}>
              Stay Logged In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpiringSessionCountdownComponent;