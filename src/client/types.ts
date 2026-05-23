import { Money } from '../application/mapper/payment.mapper';

export type AuthorizeParams = {
  idempotencyKey: string;
  amount: Money;
  cardNumber: string;
  cvv: string;
  expiryMonth: string;
  expiryYear: string;
};

export type AuthorizePaymentReturn = {
  amount: number;
  authorization_id: string;
  created_at: string;
  currency: string;
  expires_at: string;
  status: string;
};
