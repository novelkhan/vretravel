// src/components/shared/NotificationComponent.tsx
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
    const subscription = sharedService.notification$.subscribe((newState) => {
      setNotification(newState);
      
      if (newState.isOpen && window.bootstrap) {
        const modalElement = document.getElementById('notificationModal');
        if (modalElement) {
          const modal = new window.bootstrap.Modal(modalElement, {
            backdrop: 'static',
            keyboard: false
          });
          modal.show();
        }
      }
    });

    const isAutoLogout = localStorage.getItem('autoLogout');
    if (isAutoLogout === 'true' && window.bootstrap) {
      sharedService.showNotification(
        false,
        'Logged Out',
        'You have been logged out due to inactivity'
      );
      localStorage.removeItem('autoLogout');
    }

    return () => {
      subscription.unsubscribe();
      if (window.bootstrap) {
        const modalElement = document.getElementById('notificationModal');
        if (modalElement) {
          const modal = window.bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
            // ফোকাস রিমুভ করা
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur();
            }
            // অ্যানিমেশন সম্পূর্ণ হওয়ার জন্য বেশি সময় দেওয়া
            setTimeout(() => {
              modal.dispose();
              const backdrops = document.querySelectorAll('.modal-backdrop');
              backdrops.forEach(backdrop => backdrop.remove());
              document.body.classList.remove('modal-open');
              document.body.style.overflow = 'auto';
              document.body.style.paddingRight = '0px';
            }, 500); // 500ms ডিলে
          }
        }
      }
    };
  }, []);

  const handleClose = () => {
    if (notification.callback) {
      notification.callback();
    }
    sharedService.closeNotification();
    
    if (window.bootstrap) {
      const modalElement = document.getElementById('notificationModal');
      if (modalElement) {
        const modal = window.bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          // ফোকাস রিমুভ করা
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
          modal.hide();
          // অ্যানিমেশন সম্পূর্ণ হওয়ার জন্য বেশি সময় দেওয়া
          setTimeout(() => {
            modal.dispose();
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => backdrop.remove());
            document.body.classList.remove('modal-open');
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = '0px';
            modalElement.removeAttribute('aria-hidden');
          }, 500);
        } else {
          // যদি modal ইন্সট্যান্স না থাকে, ম্যানুয়ালি বন্ধ করা
          modalElement.classList.remove('show');
          modalElement.style.display = 'none';
          const backdrops = document.querySelectorAll('.modal-backdrop');
          backdrops.forEach(backdrop => backdrop.remove());
          document.body.classList.remove('modal-open');
          document.body.style.overflow = 'auto';
          document.body.style.paddingRight = '0px';
          modalElement.removeAttribute('aria-hidden');
        }
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
      aria-hidden="true"
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