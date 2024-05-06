import { CheckoutAPI, Client } from "@adyen/api-library";
import { v4 as uuidv4 } from "uuid";

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
  apiKey:
    "AQEshmfxKo7HYhJGw0m/n3Q5qf3Ve6xsLJBJV3BY0kIkSokHt3yWdfR3J7sA76oQwV1bDb7kfNy1WIxIIkxgBw==-XFKIDB/DpYSoNqPcKZjMBosKyv1SF/aU6BcNvcBthDo=-MV+K#%S@=6cA}@vM",
  environment: "TEST",
});

export const POST = async (req: Request) => {
  const { amount } = await req.json();
  const checkoutAPI = new CheckoutAPI(client);
  const id = uuidv4();
  const response = await checkoutAPI.PaymentsApi.sessions({
    merchantAccount: "SGAAccountECOM",
    amount: {
      value: amount,
      currency: "CNY",
    },
    returnUrl: "http://localhost:3000/payment-success",
    shopperInteraction: ShopperInteractionEnum.Ecommerce,
    recurringProcessingModel: RecurringProcessingModelEnum.CardOnFile,
    storePaymentMethod: true,
    reference: id,
    countryCode: "NL",
  });
  return new Response(JSON.stringify(response), {
    headers: { "content-type": "application/json" },
  });
};
