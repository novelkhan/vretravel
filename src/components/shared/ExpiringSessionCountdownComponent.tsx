// ExpiringSessionCountdownComponent.tsx
import React, { useEffect, useState, useRef } from 'react';
import sharedService from '../../services/SharedService';
import accountService from '../../services/AccountService';

const ExpiringSessionCountdownComponent: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<number>(5);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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
    if (!modalRef.current) return;

    const modalElement = modalRef.current;
    const modal = new (window as any).bootstrap.Modal(modalElement, {
      backdrop: 'static',
      keyboard: false
    });

    const subscription = sharedService.modalOpened$.subscribe((time: number) => {
      startTimer(time);
      modal.show();
    });

    return () => {
      subscription.unsubscribe();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (modal && typeof modal.dispose === 'function') {
        modal.hide();
        // ফোকাস রিমুভ করা
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        setTimeout(() => {
          modal.dispose();
          const backdrops = document.querySelectorAll('.modal-backdrop');
          backdrops.forEach(backdrop => backdrop.remove());
          document.body.classList.remove('modal-open');
          document.body.style.overflow = 'auto';
          document.body.style.paddingRight = '0px';
          if (modalRef.current) {
            modalRef.current.removeAttribute('aria-hidden');
          }
        }, 500);
      }
    };
  }, []);

  const handleTimeout = () => {
    sharedService.displayingExpiringSessionModal = false;
    sharedService.isAutoLogout = true;
    logout();
  };

  const logout = () => {
    if (modalRef.current) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalRef.current);
      if (modal) {
        // ফোকাস রিমুভ করা
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        modal.hide();
        setTimeout(() => {
          modal.dispose();
          const backdrops = document.querySelectorAll('.modal-backdrop');
          backdrops.forEach(backdrop => backdrop.remove());
          document.body.classList.remove('modal-open');
          document.body.style.overflow = 'auto';
          document.body.style.paddingRight = '0px';
          if (modalRef.current) {
            modalRef.current.removeAttribute('aria-hidden');
          }
        }, 500);
      } else {
        // যদি modal ইন্সট্যান্স না থাকে, ম্যানুয়ালি বন্ধ করা
        modalRef.current.classList.remove('show');
        modalRef.current.style.display = 'none';
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
        document.body.classList.remove('modal-open');
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '0px';
        if (modalRef.current) {
          modalRef.current.removeAttribute('aria-hidden');
        }
      }
    }
    accountService.logout();
  };

  const resumeSession = async () => {
    sharedService.displayingExpiringSessionModal = false;
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (modalRef.current) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalRef.current);
      if (modal) {
        // ফোকাস রিমুভ করা
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        modal.hide();
        setTimeout(() => {
          modal.dispose();
          const backdrops = document.querySelectorAll('.modal-backdrop');
          backdrops.forEach(backdrop => backdrop.remove());
          document.body.classList.remove('modal-open');
          document.body.style.overflow = 'auto';
          document.body.style.paddingRight = '0px';
          if (modalRef.current) {
            modalRef.current.removeAttribute('aria-hidden');
          }
        }, 500);
      } else {
        // যদি modal ইন্সট্যান্স না থাকে, ম্যানুয়ালি বন্ধ করা
        modalRef.current.classList.remove('show');
        modalRef.current.style.display = 'none';
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
        document.body.classList.remove('modal-open');
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '0px';
        if (modalRef.current) {
          modalRef.current.removeAttribute('aria-hidden');
        }
      }
    }
    try {
      await accountService.refreshToken();
    } catch (error) {
      console.error('Failed to refresh token in resumeSession:', error);
      sharedService.showNotification(false, 'Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <div 
      className="modal fade" 
      ref={modalRef}
      tabIndex={-1}
      role="dialog"
      aria-labelledby="sessionModalLabel"
      aria-hidden="true"
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