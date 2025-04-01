import React, { useEffect, useState } from 'react';
import sharedService from '../../services/SharedService';

const NotificationComponent = () => {
  const [isSuccess, setIsSuccess] = useState(true);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [callback, setCallback] = useState<(() => void) | undefined>(undefined);

  useEffect(() => {
    const subscription = (data: { isSuccess: boolean; title: string; message: string; callback?: () => void }) => {
      setIsSuccess(data.isSuccess);
      setTitle(data.title);
      setMessage(data.message);
      setCallback(() => data.callback);
    };

    sharedService.onNotification(subscription);

    return () => {
      // Cleanup subscription
      sharedService.onNotification(() => {});
    };
  }, []);

  const closeModal = () => {
    const modalElement = document.getElementById('notificationModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
    if (callback) {
      callback();
    }
  };

  return (
    <div
      id="notificationModal"
      className="modal-overlay"
      style={{ display: 'none' }}
    >
      <div
        className="modal-container"
        style={{
          borderTop: `5px solid ${isSuccess ? 'green' : 'red'}`,
          background: '#fff',
          padding: '1rem',
          borderRadius: '8px',
          width: '400px'
        }}
      >
        <div className="modal-header">
          <h5 style={{ margin: 0 }}>{title}</h5>
          <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: '16px' }}>
            ✖
          </button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer" style={{ textAlign: 'right' }}>
          <button onClick={closeModal} style={{ padding: '8px 16px', background: '#ccc', border: 'none', cursor: 'pointer' }}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationComponent;