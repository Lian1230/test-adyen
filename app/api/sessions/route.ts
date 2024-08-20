import { CheckoutAPI, Client } from '@adyen/api-library';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

enum ChannelEnum {
  IOs = 'iOS',
  Android = 'Android',
  Web = 'Web',
}

enum RecurringProcessingModelEnum {
  CardOnFile = 'CardOnFile',
  Subscription = 'Subscription',
  UnscheduledCardOnFile = 'UnscheduledCardOnFile',
}

enum ShopperInteractionEnum {
  Ecommerce = 'Ecommerce',
  ContAuth = 'ContAuth',
  Moto = 'Moto',
  Pos = 'POS',
}

// Adyen API Key required base64 encoded to handle the escape characters:
const ADYEN_API_KEY = Buffer.from(process.env.ADYEN_API_KEY!, 'base64').toString('utf-8');

console.log({
  ADYEN_MERCHANT_ACCOUNT: process.env.ADYEN_MERCHANT_ACCOUNT,
  ADYEN_API_KEY,
});

const client = new Client({
  apiKey: ADYEN_API_KEY,
  environment: 'TEST',
});

type Body = {
  currency: string;
  amount: number;
  returnUrl: string;
};

export const POST = async (req: Request) => {
  const { currency, amount, returnUrl } = (await req.json()) as Body;
  if (!currency || !amount || !returnUrl) {
    return new Response('currency, amount and returnUrl are required', {
      status: 400,
    });
  }

  try {
    const checkoutAPI = new CheckoutAPI(client);
    const id = uuidv4();
    const response = await checkoutAPI.PaymentsApi.sessions({
      amount: {
        value: amount,
        currency,
      },
      channel: ChannelEnum.Web,
      reference: id,
      returnUrl,
      merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT!,
      shopperEmail: 'longfeng.lian@unity3d.com',
      shopperReference: 'test-recurrent-shopper',
      shopperInteraction: ShopperInteractionEnum.Ecommerce,
      recurringProcessingModel: RecurringProcessingModelEnum.Subscription,
      storePaymentMethod: true,
      // storePaymentMethodMode: StorePaymentMethodModeEnum.Enabled,

      countryCode: 'US',
      applicationInfo: {
        merchantApplication: {
          name: 'Ecommerce',
          version: '1',
        },
        externalPlatform: {
          name: 'commercetools',
          integrator: 'ILT',
        },
      },
      riskData: {
        customFields: {
          tenant: 'online',
          productTypeOnInvoice: 'prepaid',
        },
      },
    });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
