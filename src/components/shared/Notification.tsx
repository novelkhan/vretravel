import React from 'react';

const Notification = ({ isSuccess, title, message, onClose }) => {
  return (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className={`modal-header ${isSuccess ? 'bg-success' : 'bg-danger'}`}>
            <h4 className="modal-title">{title}</h4>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default" onClick={onClose}>Ok</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;