'use client';
import { AdyenCheckout } from '@adyen/adyen-web';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const redirectResult = searchParams.get('redirectResult')!;
  console.log({ sessionId, redirectResult });

  async function confirmPayment() {
    const checkout = await AdyenCheckout({
      environment: 'test',
      clientKey: process.env.NEXT_PUBLIC_ADYEN_CLIENT_KEY,
      analytics: { enabled: false },
      session: {
        id: sessionId!,
        // sessionData: session.sessionData,
      },
      // @ts-ignore
      onPaymentCompleted: (result, component) => {
        console.info(result, component);
      },
      // @ts-ignore
      onError: (error, component) => {
        console.error(error.name, error.message, error.stack, component);
      },
    });

    checkout.submitDetails({ details: { redirectResult } });
  }

  useEffect(() => {
    if (!sessionId) return;
    confirmPayment();
  }, [sessionId]);

  return (
    <div>
      <h1>Payment Success</h1>
    </div>
  );
}
