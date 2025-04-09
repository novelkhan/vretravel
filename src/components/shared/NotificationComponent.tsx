import React, { useEffect, useState } from 'react';
import sharedService from '../../services/SharedService';

declare global {
  interface Window {
    bootstrap?: {
      Modal: {
        new (element: HTMLElement, options?: object): {
          show: () => void;
          hide: () => void;
          dispose: () => void;
        };
        getInstance: (element: HTMLElement) => any;
      };
    };
  }
}

interface NotificationState {
  isOpen: boolean;
  isSuccess: boolean;
  title: string;
  message: string;
  callback?: () => void;
}

const NotificationComponent: React.FC = () => {
  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false,
    isSuccess: true,
    title: '',
    message: ''
  });

  useEffect(() => {
    const checkAutoLogout = () => {
      const isAutoLogout = localStorage.getItem('autoLogout') === 'true';
      if (isAutoLogout) {
        sharedService.showNotification(
          false,
          'Logged Out',
          'You have been logged out due to inactivity'
        );
        localStorage.removeItem('autoLogout');
      }
    };

    const subscription = sharedService.notification$.subscribe((newState) => {
      setNotification(newState);
      
      if (newState.isOpen && window.bootstrap) {
        const modalElement = document.getElementById('notificationModal');
        if (modalElement) {
          const existingModal = window.bootstrap.Modal.getInstance(modalElement);
          if (existingModal) {
            existingModal.hide();
          }
          
          const modal = new window.bootstrap.Modal(modalElement, {
            backdrop: 'static',
            keyboard: false
          });
          modal.show();
        }
      }
    });

    checkAutoLogout();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleClose = () => {
    if (notification.callback) {
      notification.callback();
    }
    sharedService.closeNotification();
    
    const modalElement = document.getElementById('notificationModal');
    if (modalElement && window.bootstrap) {
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
        // ম্যানুয়ালি ব্যাকড্রপ ক্লিনআপ
        const backdrops = document.getElementsByClassName('modal-backdrop');
        for (let i = 0; i < backdrops.length; i++) {
          backdrops[i].remove();
        }
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }
    }
  };

  return (
    <div 
      className="modal fade" 
      id="notificationModal"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="notificationModalLabel"
      aria-hidden={!notification.isOpen}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className={`modal-header ${notification.isSuccess ? 'bg-success' : 'bg-danger'} text-white`}>
            <h5 className="modal-title" id="notificationModalLabel">
              {notification.title}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={handleClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {notification.message}
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={handleClose}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationComponent;