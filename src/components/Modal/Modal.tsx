import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css'; 

type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </>,
    document.getElementById('modal-root') as HTMLElement
  );
};

export default Modal;
