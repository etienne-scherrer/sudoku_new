import React from 'react';
import './Modal.css';

function Modal({ isOpen, children, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {children}
        <div className="modal-actions">
          <button onClick={onClose} className="btn btn-solve">Close</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
