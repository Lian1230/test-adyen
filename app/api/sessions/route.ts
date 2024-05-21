import { CheckoutAPI, Client } from '@adyen/api-library';
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

enum StorePaymentMethodModeEnum {
  AskForConsent = 'askForConsent',
  Disabled = 'disabled',
  Enabled = 'enabled',
}

const client = new Client({
  apiKey: process.env.ADYEN_API_KEY!,
  environment: 'TEST',
});

export const POST = async (req: Request) => {
  const { amount, returnUrl } = await req.json();
  if (!amount || !returnUrl) {
    return new Response('amount and returnUrl are required', {
      status: 400,
    });
  }

  const checkoutAPI = new CheckoutAPI(client);
  const id = uuidv4();
  const response = await checkoutAPI.PaymentsApi.sessions({
    // const response = await checkoutAPI.sessions({
    merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT!,
    amount: {
      value: amount,
      currency: 'USD',
    },
    channel: ChannelEnum.Web,
    returnUrl,
    shopperEmail: 'longfeng.lian@unity3d.com',

    // recurringProcessingModel: RecurringProcessingModelEnum.CardOnFile,
    recurringProcessingModel: RecurringProcessingModelEnum.CardOnFile,
    //Indicates the sales channel through which the shopper gives their card details,
    //for online transactions, this is Ecommerce.
    //For subsequent payments, indicates whether the shopper is a returning customer (ContAuth).
    shopperInteraction: ShopperInteractionEnum.Ecommerce,
    storePaymentMethod: true,
    shopperReference: 'test-recurrent-shopper',
    // storePaymentMethodMode: StorePaymentMethodModeEnum.Enabled,

    reference: id,
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
  return new Response(JSON.stringify(response), {
    headers: { 'content-type': 'application/json' },
  });
};
