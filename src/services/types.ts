import {
  CardNumber,
  CustomerId,
  CVV,
  ExpiryMonth,
  ExpiryYear,
  Money,
  OrderId,
} from '../application/mapper/payment.mapper';

export type MakePaymentParams = {
  amount: Money;
  cvv: CVV;
  cardNumber: CardNumber;
  expiryYear: ExpiryYear;
  expiryMonth: ExpiryMonth;
  orderId: OrderId;
  customerId: CustomerId;
  idempotencyKey?: string;
};
