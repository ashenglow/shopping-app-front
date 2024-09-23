import { useState, useEffect, useCallback } from "react";

const PaymentPopup = ({ paymentUrl, onApproval, onClose, showPaymentPopup }) => {
  useEffect(() => {
    if (!showPaymentPopup) return;

    const popupWidth = 500;
    const popupHeight = 700;
    const left = (window.screen.width / 2) - (popupWidth / 2);
    const top = (window.screen.height / 2) - (popupHeight / 2);
    
    const popup = window.open(
      paymentUrl,
      'KakaoPayment',
      `width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
    );
    
    if (popup) {
      popup.focus();
    }

    const checkPopup = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(checkPopup);
        onClose();
      } else {
        try {
          const currentUrl = popup.location.href;
          if (currentUrl.includes('/payment/approve')) {
            clearInterval(checkPopup);
            popup.close();
            onApproval(currentUrl);
          }
        } catch (e) {
          // Ignore errors caused by cross-origin restrictions
        }
      }
    }, 200);

    return () => {
      clearInterval(checkPopup);
      if (popup && !popup.closed) {
        popup.close();
      }
    };
  }, [paymentUrl, onApproval, onClose, showPaymentPopup]);

  return null;
};

  
export default PaymentPopup;
