import sharedService from '../../services/SharedService';
import accountService from '../../services/AccountService';
// src/components/ExpiringSessionCountdownComponent.ts
import React, { useEffect, useState, useRef } from 'react';
import { interval } from 'rxjs';
import { Subscription } from 'rxjs';

const ExpiringSessionCountdownComponent: React.FC = () => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${pad(minutes)}:${pad(remainingSeconds)}`;
  };

  const pad = (value: number): string => {
    return value < 10 ? `0${value}` : value.toString();
  };

  const [targetTime, setTargetTime] = useState<number>(5);
  const [remainingTime, setRemainingTime] = useState<number>(targetTime);
  const [displayTime, setDisplayTime] = useState<string>(formatTime(targetTime));
  const countdownSubscription = useRef<Subscription | undefined>(undefined);

  useEffect(() => {
    const modalSubscription = sharedService.modalOpened$.subscribe((newTargetTime: number) => {
      setTargetTime(newTargetTime);
      resetCountdown();
      startCountdown();
    });

    return () => {
      modalSubscription.unsubscribe();
      stopCountdown();
    };
  }, []);

  const resetCountdown = () => {
    stopCountdown();
    setRemainingTime(targetTime);
    setDisplayTime(formatTime(targetTime));
  };

  const startCountdown = () => {
    stopCountdown();
    countdownSubscription.current = interval(1000).subscribe(() => {
      setRemainingTime((prev) => {
        if (prev > 0) {
          const newTime = prev - 1;
          setDisplayTime(formatTime(newTime));
          return newTime;
        } else {
          stopCountdown();
          sharedService.showNotification(false, 'Logged Out', 'You have been logged out due to inactivity');
          logout();
          return 0;
        }
      });
    });
  };

  const stopCountdown = () => {
    if (countdownSubscription.current) {
      countdownSubscription.current.unsubscribe();
      countdownSubscription.current = undefined;
    }
  };

  const logout = () => {
    closeModal();
    accountService.logout(); // AccountService থেকে কল করা হচ্ছে
  };

  const closeModal = () => {
    sharedService.displayingExpiringSessionModal = false;
    const modalElement = document.getElementById('sessionModal');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    }
  };

  const resumeSession = () => {
    stopCountdown();
    resetCountdown();
    closeModal();
    accountService.refreshToken(); // AccountService থেকে কল করা হচ্ছে
  };

  if (!sharedService.displayingExpiringSessionModal) return null;

  return (
    <div className="modal fade" id="sessionModal" tabIndex={-1} aria-labelledby="sessionModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">Session Timeout Warning</h5>
            <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
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