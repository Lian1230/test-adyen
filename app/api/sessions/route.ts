import { CheckoutAPI, Client } from "@adyen/api-library";
import { v4 as uuidv4 } from "uuid";

enum ChannelEnum {
  IOs = "iOS",
  Android = "Android",
  Web = "Web",
}

enum RecurringProcessingModelEnum {
  CardOnFile = "CardOnFile",
  Subscription = "Subscription",
  UnscheduledCardOnFile = "UnscheduledCardOnFile",
}

enum ShopperInteractionEnum {
  Ecommerce = "Ecommerce",
  ContAuth = "ContAuth",
  Moto = "Moto",
  Pos = "POS",
}

const client = new Client({
  apiKey: process.env.ADYEN_API_KEY!,
  environment: "TEST",
});

export const POST = async (req: Request) => {
  const { amount } = await req.json();
  const checkoutAPI = new CheckoutAPI(client);
  const id = uuidv4();
  const response = await checkoutAPI.PaymentsApi.sessions({
    // const response = await checkoutAPI.sessions({
    merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT!,
    amount: {
      value: amount,
      currency: "USD",
    },
    channel: ChannelEnum.Web,
    returnUrl: "http://localhost:3001/payment-success",
    shopperReference: "test-shopper",
    shopperEmail: "longfeng.lian@unity3d.com",
    shopperInteraction: ShopperInteractionEnum.Ecommerce,
    recurringProcessingModel: RecurringProcessingModelEnum.CardOnFile,
    storePaymentMethod: true,
    reference: id,
    countryCode: "US",
    applicationInfo: {
      merchantApplication: {
        name: "Ecommerce",
        version: "1",
      },
      externalPlatform: {
        name: "commercetools",
        integrator: "ILT",
      },
    },
    riskData: {
      customFields: {
        tenant: "online",
        productTypeOnInvoice: "prepaid",
      },
    },
  });
  return new Response(JSON.stringify(response), {
    headers: { "content-type": "application/json" },
  });
};
