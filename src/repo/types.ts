import { Money } from '../application/mapper/payment.mapper';

export type createPaymentsParams = {
  orderId: string;
  customerId: string;
  amount: Money;
};
export type BankAuthorizeUpdateParams = {
  id: string;
  bankAuthorizationId: string;
  authorizeExpiresAt: string;
};
export type BankVoidParams = {
  id: number;
  bankVoidId: string;
};
export type BankCaptureParams = {
  id: number;
  bankCaptureId: string;
};
export type BankRefundParams = {
  id: number;
  bankRefundId: string;
};

export type Payment = {
  id: string;
  status: string;
  dateCreated: Date;
  orderId: string;
  customerId: string;
  amount: number;
  bankAuthorizeId: string;
  authorizedAt: Date;
  bankCaptureId: string;
  capturedAt: Date;
  bankVoidId: string;
  voidedAt: Date;
  bankRefundId: string;
  refundedAt: Date;
};

export type SaveIdempotencyParams = {
  key: string;
  operation: string;
  response?: string;
  paymentId: string;
};

export type IdempotencyKeyRow = {
  key: string;
  date_created: string;
  operation: string;
  payment_id: string;
  updated_at: string;
  response?: string;
  date_expired?: string;
};
