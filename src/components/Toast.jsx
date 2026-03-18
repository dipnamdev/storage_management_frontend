import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle size={20} />;
      case 'error': return <XCircle size={20} />;
      case 'warning': return <AlertTriangle size={20} />;
      default: return <Info size={20} />;
    }
  };

  const getTitle = () => {
    if (toast.title) return toast.title;
    switch (toast.type) {
      case 'success': return 'Success';
      case 'error': return 'Error';
      case 'warning': return 'Warning';
      default: return 'Notification';
    }
  };

  return (
    <div className={`toast toast-${toast.type} ${toast.isExiting ? 'toast-exit' : ''}`}>
      <div className="toast-icon">
        {getIcon()}
      </div>
      <div className="toast-content">
        <span className="toast-title">{getTitle()}</span>
        <p className="toast-message">{toast.message}</p>
      </div>
      <button className="toast-close" onClick={() => onClose(toast.id)}>
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;
