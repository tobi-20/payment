export type MakePaymentParams = {
  amount: number;
  cvv: string;
  cardNumber: string;
  expiryYear: string;
  expiryMonth: string;
  orderId: string;
  customerId: string;
  idempotencyKey?: string;
};
