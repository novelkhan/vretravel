import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ExpiringSessionCountdown = ({ onClose }) => {
  const [remainingTime, setRemainingTime] = useState(120);
  const { logout, refreshToken } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (remainingTime <= 0) {
      logout();
      onClose();
    }
  }, [remainingTime, logout, onClose]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-danger">
            <h4 className="modal-title">Session Timeout Warning</h4>
          </div>
          <div className="modal-body">
            <p style={{ fontSize: '1.5rem' }}>
              Your session is about to time out, do you want to continue your session?
              {formatTime(remainingTime)} time left
            </p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-danger" onClick={logout}>Logout</button>
            <button className="btn btn-success" onClick={refreshToken}>Stay Logged In</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpiringSessionCountdown;