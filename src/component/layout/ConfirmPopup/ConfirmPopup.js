import { useState, useEffect } from "react";
import "./ConfirmPopup.css";
const ConfirmPopup = ({ message, duration = 2000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div className="confirm-popup">
      <p>{message}</p>
    </div>
  );
};
export default ConfirmPopup;
