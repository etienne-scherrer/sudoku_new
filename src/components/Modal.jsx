// components/Modal.js
import React from 'react';
import './Modal.css'; // Ensure you create a corresponding CSS file for styling

function Modal({ isOpen, children, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {children}
                <button onClick={onClose} className="close-button">Close</button>
            </div>
        </div>
    );
}

export default Modal;
