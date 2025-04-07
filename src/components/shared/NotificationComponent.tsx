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
  const modalRef = React.useRef<any>(null);

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
          // প্রথমে কোনো existing মডাল ইনস্ট্যান্স ডিসপোজ করুন
          const existingModal = window.bootstrap.Modal.getInstance(modalElement);
          if (existingModal) {
            existingModal.dispose();
          }
          
          // নতুন মডাল তৈরি করুন
          modalRef.current = new window.bootstrap.Modal(modalElement, {
            backdrop: 'static',
            keyboard: false
          });
          modalRef.current.show();
        }
      }
    });

    checkAutoLogout();

    return () => {
      subscription.unsubscribe();
      // কম্পোনেন্ট আনমাউন্ট হলে মডাল ডিসপোজ করুন
      if (modalRef.current) {
        modalRef.current.dispose();
      }
    };
  }, []);

  const handleClose = () => {
    if (notification.callback) {
      notification.callback();
    }
    sharedService.closeNotification();
    
    if (modalRef.current) {
      modalRef.current.hide();
      modalRef.current.dispose();
      modalRef.current = null;
    }

    // জোরপূর্বক ক্লিনআপ (যদি কোনো কিছু থেকে যায়)
    const cleanUpModal = () => {
      const modalElement = document.getElementById('notificationModal');
      if (modalElement) {
        modalElement.style.display = 'none';
        modalElement.removeAttribute('aria-modal');
        modalElement.removeAttribute('role');
        modalElement.setAttribute('aria-hidden', 'true');
      }

      const backdrops = document.getElementsByClassName('modal-backdrop');
      for (let i = 0; i < backdrops.length; i++) {
        backdrops[i].remove();
      }

      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };

    cleanUpModal();
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