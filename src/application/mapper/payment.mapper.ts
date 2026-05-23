import { MakePaymentParams } from '../../services/types';
import { checkLuhn } from '../../utils/helpers';

export type CardNumber = string & { readonly __brand: 'CardNumber' };
export type CVV = string & { readonly __brand: 'CVV' };
export type ExpiryYear = string & { readonly __brand: 'ExpiryYear' };
export type ExpiryMonth = string & { readonly __brand: 'ExpiryMonth' };
export type OrderId = string & { readonly __brand: 'OrderId' };
export type CustomerId = string & { readonly __brand: 'CustomerId' };
export type Money = {
  value: number;
  currency: 'USD';
};

export type MakePaymentRequest = {
  amount: number;
  cvv: string;
  cardNumber: string;
  expiryYear: string;
  expiryMonth: string;
  orderId: string;
  customerId: string;
  idempotencyKey?: string;
};

export function toMakePaymentParams(
  dto: MakePaymentRequest,
): MakePaymentParams {
  return {
    amount: createMoney(dto.amount),
    cardNumber: createCardNumber(dto.cardNumber),
    cvv: createCVV(dto.cvv),
    expiryYear: createExpiryYear(dto.expiryYear),
    expiryMonth: createExpiryMonth(dto.expiryMonth),
    orderId: createOrderId(dto.orderId),
    customerId: createCustomerId(dto.customerId),
  };
}

export function createMoney(value: number): Money {
  if (!Number.isFinite(value)) {
    throw new Error('Invalid money amount');
  }

  if (value <= 0) {
    throw new Error('Money amount must be positive');
  }
  return {
    value: value,
    currency: 'USD',
  };
}

export function createCardNumber(value: string): CardNumber {
  if (value.length < 12 || value.length > 19) {
    throw new Error('Invalid card number');
  }
  if (!checkLuhn) {
    throw new Error('Invalid card number');
  }
  return value as CardNumber;
}
export function createCVV(value: string): CVV {
  if (value.length !== 3) {
    throw new Error('Invalid cvv');
  }
  return value as CVV;
}
export function createExpiryYear(value: string): ExpiryYear {
  if (value.length !== 2) {
    throw new Error('Invalid ExpiryYear');
  }

  return value as ExpiryYear;
}
export function createExpiryMonth(value: string): ExpiryMonth {
  if (value.length !== 2) {
    throw new Error('Invalid ExpiryMonth');
  }
  return value as ExpiryMonth;
}
export function createOrderId(value: string): OrderId {
  if (value.trim() === '') {
    throw new Error('Invalid OrderId');
  }
  return value as OrderId;
}
export function createCustomerId(value: string): CustomerId {
  if (typeof value !== 'string') {
    throw new Error('Invalid CustomerId');
  }
  return value as CustomerId;
}
