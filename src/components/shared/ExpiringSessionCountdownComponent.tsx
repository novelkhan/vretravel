import React, { useEffect, useState, useRef } from 'react';
import sharedService from '../../services/SharedService';
import accountService from '../../services/AccountService';

const ExpiringSessionCountdownComponent: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<number>(5);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = (duration: number) => {
    setTimeLeft(duration);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          handleTimeout();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    const modalElement = document.getElementById('sessionModal');
    
    const subscription = sharedService.modalOpened$.subscribe((time: number) => {
      startTimer(time);
      if (modalElement && window.bootstrap) {
        const modal = new window.bootstrap.Modal(modalElement, {
          backdrop: 'static',
          keyboard: false
        });
        modal.show();
      }
    });

    return () => {
      subscription.unsubscribe();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleTimeout = () => {
    sharedService.displayingExpiringSessionModal = false;
    sharedService.isAutoLogout = true;
    logout();
  };

  const logout = () => {
    const modalElement = document.getElementById('sessionModal');
    if (modalElement && window.bootstrap) {
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modalElement.addEventListener(
          'hidden.bs.modal',
          () => {
            modal.dispose();
            // ব্যাকড্রপ এবং বডি ক্লিনআপ
            const backdrops = document.getElementsByClassName('modal-backdrop');
            while (backdrops.length > 0) {
              backdrops[0].remove();
            }
            const body = document.body;
            body.classList.remove('modal-open');
            body.style.overflow = '';
            body.style.paddingRight = '';
            body.style.marginRight = '';
            accountService.logout();
          },
          { once: true }
        );
        modal.hide();
      } else {
        accountService.logout();
      }
    } else {
      accountService.logout();
    }
  };
  
  const resumeSession = async () => {
    sharedService.displayingExpiringSessionModal = false;
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  
    const modalElement = document.getElementById('sessionModal');
    if (modalElement && window.bootstrap) {
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modalElement.addEventListener(
          'hidden.bs.modal',
          () => {
            modal.dispose();
            // ব্যাকড্রপ এবং বডি ক্লিনআপ
            const backdrops = document.getElementsByClassName('modal-backdrop');
            while (backdrops.length > 0) {
              backdrops[0].remove();
            }
            const body = document.body;
            body.classList.remove('modal-open');
            body.style.overflow = '';
            body.style.paddingRight = '';
            body.style.marginRight = '';
          },
          { once: true }
        );
        modal.hide();
      }
    }
  
    await accountService.refreshToken();
  };

  return (
    <div 
      className="modal fade" 
      id="sessionModal"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="sessionModalLabel"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title" id="sessionModalLabel">Session Timeout Warning</h5>
          </div>
          <div className="modal-body">
            <p style={{ fontSize: '1.5rem' }}>
              Your session is about to time out, do you want to continue your session?
              <br />
              <strong>{formatTime(timeLeft)}</strong> time left
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