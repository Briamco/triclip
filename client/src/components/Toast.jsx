import { useState, useEffect, useCallback } from 'react';
import { FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';
import './Toast.css';

const iconMap = {
  success: FiCheckCircle,
  error: FiAlertCircle,
  warning: FiAlertTriangle,
  info: FiInfo,
};

function ToastItem({ toast, onRemove }) {
  const [exiting, setExiting] = useState(false);
  const Icon = iconMap[toast.type] || FiInfo;

  const handleDismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  }, [toast.id, onRemove]);

  useEffect(() => {
    const timer = setTimeout(handleDismiss, 4000);
    return () => clearTimeout(timer);
  }, [handleDismiss]);

  return (
    <div className={`toast toast-${toast.type} ${exiting ? 'toast-exit' : ''}`}>
      <Icon className="toast-icon" />
      <div className="toast-content">
        <p className="toast-message">{toast.message}</p>
      </div>
      <button className="toast-close" onClick={handleDismiss}>
        <FiX />
      </button>
      <div className="toast-progress"></div>
    </div>
  );
}

export default function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}
