import { useState, useEffect, useCallback } from "react";

const PaymentPopup = ({ paymentUrl, onApproval, onClose }) => {
  const openPopup = useCallback(() => {
    const popup = window.open(
      paymentUrl,
      "KakaoPayment",
      "width=500,height=600"
    );

    const checkPopup = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(checkPopup);
        onClose();
      } else {
        try {
          const currentUrl = popup.location.href;
          if (currentUrl.includes("pg_token")) {
            clearInterval(checkPopup);
            popup.close();
            onApproval(currentUrl);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }, 500);

    return () => clearInterval(checkPopup);
  }, [paymentUrl, onApproval, onClose]);

  useEffect(() => {
    if (paymentUrl) {
      openPopup();
    }
  }, [paymentUrl, openPopup]);

  return null;
};
export default PaymentPopup;
