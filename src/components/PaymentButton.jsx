// PaymentButton.jsx
import React from 'react';
import { Button } from 'react-bootstrap';

function PaymentButton({ email, amount, currency, currencySymbol, donorName, donationType, onSuccess, onClose }) {
  
  const handlePaystackPayment = (e) => {
    e.preventDefault();

    const originalAmount = parseFloat(amount);
    let finalNairaAmount = originalAmount;

    // Define standard conversion exchange rates
    const EXCHANGE_RATES = {
      USD: 1500, // $1 = ₦1,500
      GBP: 1900, // £1 = ₦1,900
      NGN: 1
    };

    // If the currency isn't Naira, convert it to NGN for Paystack processing
    if (currency !== 'NGN') {
      const rate = EXCHANGE_RATES[currency] || 1;
      finalNairaAmount = originalAmount * rate;
    }

    // Paystack reads amounts in lower-subunit kobo/cents
    const paystackAmount = Math.round(finalNairaAmount * 100);
    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

    if (!publicKey || publicKey.includes('YOUR_ACTUAL_PAYSTACK_KEY')) {
      alert('Paystack Public Key is missing in your config settings!');
      return;
    }

    const handler = window.PaystackPop.setup({
      key: publicKey, 
      email: email, 
      amount: paystackAmount,
      currency: 'NGN', // ALWAYS pass 'NGN' to bypass the unsupported merchant error
      metadata: {
        custom_fields: [
          { display_name: "Donor Name", variable_name: "donor_name", value: donorName },
          { display_name: "Donation Type", variable_name: "donation_type", value: donationType },
          { display_name: "Original Gift", variable_name: "original_gift", value: `${currencySymbol}${originalAmount} (${currency})` }
        ]
      },
      callback: function (response) {
        // Return successful callback reference to our app engine
        onSuccess(response.reference);
      },
      onClose: function () {
        if (onClose) onClose();
      }
    });

    handler.openIframe();
  };

  return (
    <Button variant="success" type="button" className="w-100" onClick={handlePaystackPayment}>
      Pay ({currencySymbol}{Number(amount).toLocaleString()})
    </Button>
  );
}

export default PaymentButton;