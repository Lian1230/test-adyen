'use client';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import { AdyenCheckout, Dropin } from '@adyen/adyen-web';
import '@adyen/adyen-web/styles/adyen.css';
import { LoadingButton } from '@mui/lab';
import { TextField } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';

export default function Home() {
  const [amount, setAmount] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState<string>('USD');

  const createPayment = async () => {
    setLoading(true);
    const session = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currency, amount: amount * 100, returnUrl: `${location.origin}/payment-success` }),
    }).then((res) => res.json());
    console.log('session', session);

    const checkout = await AdyenCheckout({
      environment: 'test',
      clientKey: process.env.NEXT_PUBLIC_ADYEN_CLIENT_KEY,
      analytics: { enabled: false },
      session: {
        id: session.id,
        sessionData: session.sessionData,
      },
      onPaymentCompleted: (result, component) => {
        console.info(result, component);
      },
      onError: (error, component) => {
        console.error(error.name, error.message, error.stack, component);
      },
    });

    console.log(checkout.paymentMethodsResponse); //{ "paymentMethods": [ { "brands": [ "mc", "visa", "amex" ], "name": "Cards", "type": "scheme" }, { "name": "AliPay", "type": "alipay" } ], "storedPaymentMethods": [] }
    new Dropin(checkout, {
      // paymentMethodComponents: [Card, PayPal, GooglePay, ApplePay, Ideal];
      onReady: () => {},
      instantPaymentTypes: ['applepay', 'googlepay'],
      paymentMethodsConfiguration: {
        card: {
          onError: () => {},
        },
      },
    }).mount('#dropin-container');

    // checkout.create("alipay").mount("#adyen-container");
    setLoading(false);
  };

  return (
    <main className="flex flex-col gap-8 items-center justify-between p-10">
      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <FormControl variant="standard">
        <InputLabel id="currency-label">Currency</InputLabel>
        <Select
          labelId="currency-label"
          id="currency"
          value={currency}
          onChange={(event) => setCurrency(event.target.value as string)}
        >
          <MenuItem value="USD">USD</MenuItem>
          <MenuItem value="CNY">CNY</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Amount($)"
        type="number"
        value={amount}
        variant="standard"
        onChange={(event) => setAmount(event.target.value as any)}
      />

      <LoadingButton loading={loading} onClick={() => createPayment()} variant="contained">
        Pay
      </LoadingButton>

      <div id="dropin-container" className="min-w-[500px]"></div>
      <div id="adyen-container"></div>
    </main>
  );
}
