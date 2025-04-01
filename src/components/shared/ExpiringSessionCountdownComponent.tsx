import React, { useEffect, useState } from 'react';
import sharedService from '../../services/SharedService';
import { interval, Subscription } from 'rxjs';

// formatTime ফাংশনটি কম্পোনেন্ট বডির আগে ডিক্লেয়ার করা হয়েছে
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${pad(minutes)}:${pad(remainingSeconds)}`;
};

const pad = (value: number) => (value < 10 ? `0${value}` : value);

const ExpiringSessionCountdownComponent = () => {
  const [targetTime, setTargetTime] = useState(5);
  const [remainingTime, setRemainingTime] = useState(targetTime);
  const [displayTime, setDisplayTime] = useState(formatTime(targetTime));
  let countdownSubscription: Subscription | undefined;

  useEffect(() => {
    const subscription = (time: number) => {
      setTargetTime(time);
      resetCountdown();
      startCountdown();
    };

    sharedService.onModalOpened(subscription);

    return () => stopCountdown();
  }, []);

  // Reset Countdown
  const resetCountdown = () => {
    stopCountdown();
    setRemainingTime(targetTime);
    setDisplayTime(formatTime(targetTime));
  };

  // Start Countdown
  const startCountdown = () => {
    stopCountdown();
    countdownSubscription = interval(1000).subscribe(() => {
      setRemainingTime((prev) => {
        if (prev > 0) {
          const newTime = prev - 1;
          setDisplayTime(formatTime(newTime));
          return newTime;
        } else {
          stopCountdown();
          sharedService.showNotification(
            false,
            'Logged Out',
            'You have been logged out due to inactivity'
          );
          logout();
          return 0;
        }
      });
    });
  };

  // Stop Countdown
  const stopCountdown = () => {
    countdownSubscription?.unsubscribe();
    countdownSubscription = undefined;
  };

  // Logout Function
  const logout = () => {
    closeModal();
    console.log('User logged out');
    // TODO: Add actual logout logic here if needed
  };

  // Resume Session
  const resumeSession = () => {
    stopCountdown();
    resetCountdown();
    closeModal();
    console.log('Session resumed');
    // TODO: Add actual session refresh logic here if needed
  };

  // Close Modal
  const closeModal = () => {
    const modalElement = document.getElementById('sessionModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  };

  return (
    <div id="sessionModal" className="modal-overlay" style={{ display: 'none' }}>
      <div
        className="modal-container"
        style={{
          borderTop: '5px solid orange',
          background: '#fff',
          padding: '1rem',
          borderRadius: '8px',
          width: '400px',
        }}
      >
        <div
          className="modal-header"
          style={{
            backgroundColor: 'red',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px',
          }}
        >
          <h5 style={{ margin: 0 }}>Session Timeout Warning</h5>
        </div>
        <div className="modal-body" style={{ padding: '1rem' }}>
          <p style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            Your session is about to time out, do you want to continue your session?{' '}
            <strong>{displayTime}</strong> time left.
          </p>
        </div>
        <div
          className="modal-footer"
          style={{
            textAlign: 'right',
            padding: '10px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
          }}
        >
          <button
            onClick={logout}
            style={{
              backgroundColor: 'red',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
          <button
            onClick={resumeSession}
            style={{
              backgroundColor: 'green',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpiringSessionCountdownComponent;