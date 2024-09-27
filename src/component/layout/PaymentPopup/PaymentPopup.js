import { useState, useEffect, useCallback } from "react";
import useResponsiveUrl from "../MUI-comp/useResponsiveUrl";

const PaymentPopup = ({ paymentUrls, onApproval, onClose, showPaymentPopup }) => {
  const responsiveUrl = useResponsiveUrl(paymentUrls);
  const openPopup = useCallback(() => {
    if (!showPaymentPopup) return null;

   
    const popupWidth = 500;
    const popupHeight = 700;
    const left = (window.screen.width / 2) - (popupWidth / 2);
    const top = (window.screen.height / 2) - (popupHeight / 2);
    
    const popup = window.open(
      responsiveUrl,
      'KakaoPayment',
      `width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
    );
    
    if (popup) {
      popup.focus();
    }

    return popup;
    
  }, [responsiveUrl, showPaymentPopup]);
  useEffect(() => {
   const popup = openPopup();
   if(!popup) return;

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
  }, [openPopup, onApproval, onClose]);

  return null;
};

  
export default PaymentPopup;
