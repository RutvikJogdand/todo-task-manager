import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css'; 

type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  title: string;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ children, title, isOpen, onClose }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div className='modal-overlay' onClick={onClose} />
      <div className='modal-content'>
        <h2>{title}</h2>
        <button className='modal-close-button' onClick={onClose}>
          {/* Close Icon X written as &times for better standardization and accessibility across all browsers */}
          &times;
        </button>
        {children}
      </div>
    </>,
    document.getElementById('modal-root') as HTMLElement
  );
};

export default Modal;
