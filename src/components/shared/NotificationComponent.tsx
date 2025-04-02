// src/components/NotificationComponent.ts
import React, { useEffect, useState } from 'react';
import sharedService from '../../services/SharedService';

interface NotificationState {
  isOpen: boolean;
  isSuccess: boolean;
  title: string;
  message: string;
  callback?: () => void;
}

const NotificationComponent: React.FC = () => {
  const [state, setState] = useState<NotificationState>({
    isOpen: false,
    isSuccess: true,
    title: '',
    message: '',
    callback: undefined,
  });

  useEffect(() => {
    const subscription = sharedService.notification$.subscribe((newState) => {
      setState(newState);

      const modalElement = document.getElementById('notificationModal');
      if (modalElement) {
        const modal = (window as any).bootstrap.Modal.getOrCreateInstance(modalElement); // Reuse করা instance
        if (newState.isOpen) {
          modal.show();
        } else {
          modal.hide();
          document.body.classList.remove('modal-open'); // Backdrop ঠিক করার জন্য
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) backdrop.remove(); // Backdrop manually remove
        }
      }
    });

    return () => {
      subscription.unsubscribe();
      // Cleanup করার সময় backdrop remove
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
    };
  }, []);

  const handleClose = () => {
    sharedService.closeNotification();
    if (state.callback) state.callback(); // Callback execute করা
  };

  if (!state.isOpen) return null;

  return (
    <div className="modal fade" id="notificationModal" tabIndex={-1} aria-labelledby="notificationModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className={`modal-header ${state.isSuccess ? 'bg-success' : 'bg-danger'} text-white`}>
            <h4 className="modal-title">{state.title}</h4>
            <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">{state.message}</div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationComponent;