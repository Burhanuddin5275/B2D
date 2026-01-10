import React, { useEffect, useState } from 'react';
import { colors } from '@/theme/colors';
import StatusModal from '../success';
import { API_URL } from '@/url/Api_Url';

interface OrderOtpModalProps {
  orderId: string | number;
  token: string;
  visible: boolean;
  onClose: () => void;
}

const OrderOtpModal: React.FC<OrderOtpModalProps> = ({ orderId, token, visible, onClose }) => {
  const [otpMessage, setOtpMessage] = useState('');
   const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!visible || !token) return;

    const fetchOtp = async () => {
      try {
        const response = await fetch(
          `${API_URL}customer-api/get-order-otp/${orderId}`,
          { 
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `token ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data?.data?.otp) {
            setShowSuccess(true);
          setOtpMessage(`${data.data.otp}`);
        }
      } catch (err) {
        console.error('Error fetching OTP:', err);
      }
    };

    fetchOtp();
  }, [orderId, token, visible]);

  // Only show modal if OTP exists
  if (!otpMessage) return null;

  return (
    <StatusModal
      visible={showSuccess}
      type="info" 
      title="Delivery OTP"
      message={otpMessage}
      onClose={() => setShowSuccess(false)}
      showButton={false}
      autoDismiss={true}
      dismissAfter={8000}
    />
  );
};

export default OrderOtpModal;
