import React from 'react';

const SuccessModal = ({ message, onClose, onDownload, onSave }) => {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <h4 style={styles.modalTitle}>{message}</h4>
        <div style={styles.modalButtons}>
          <button onClick={onClose} style={styles.modalButton}>Close</button>
          <button onClick={onDownload} style={styles.modalButton}>Download Invoice</button>
          <button onClick={onSave} style={styles.modalButton}>Save Bill</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker overlay
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center', // Ensure modal is vertically centered
    zIndex: 1000, // Ensure modal is on top
    animation: 'fadeIn 0.3s ease-in-out',
  },
  modal: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    textAlign: 'center',
    width: '90%',
    maxWidth: '500px', // Set a max width for large screens
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    animation: 'zoomIn 0.3s ease-in-out',
    transition: 'width 0.3s ease',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
    letterSpacing: '1px',
  },
  modalButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  modalButton: {
    padding: '12px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '30px',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  modalButtonHover: {
    backgroundColor: '#0056b3',
    transform: 'translateY(-2px)',
  },
  // Responsive styles using media queries
  '@media (max-width: 768px)': {
    modal: {
      width: '80%',
      padding: '20px',
    },
    modalTitle: {
      fontSize: '18px',
    },
    modalButton: {
      padding: '10px 15px',
      fontSize: '14px',
    },
  },
  '@media (max-width: 480px)': {
    modal: {
      width: '90%',
      padding: '15px',
    },
    modalTitle: {
      fontSize: '16px',
    },
    modalButton: {
      padding: '8px 12px',
      fontSize: '12px',
    },
  },
};

export default SuccessModal;
