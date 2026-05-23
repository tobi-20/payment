import { randomUUID } from 'crypto';
import {
  createPayments,
  SaveIdempotencyKey,
  UpdatePaymentAuthorized,
} from '../repo/repo';
import {
  BankAuthorizeUpdateParams,
  createPaymentsParams,
  SaveIdempotencyParams,
} from '../repo/types';
import { MakePaymentParams } from './types';
import { authorizePayment } from '../client/bankClient.service';
import { AuthorizeParams } from '../client/types';
import { withRetry } from '../utils/utils';

import { AppError } from '../errors/errors';

export async function makePayments(args: MakePaymentParams) {
  const paymentParams: createPaymentsParams = {
    orderId: args.orderId,
    customerId: args.customerId,
    amount: args.amount,
  };
  const paymentRow = await createPayments(paymentParams);
  const key = randomUUID();

  const idempotencyParams: SaveIdempotencyParams = {
    key: key,
    operation: 'authorize',
    paymentId: paymentRow.id,
  };
  const idempotencyRow = await SaveIdempotencyKey(idempotencyParams);
  const authorizationParams: AuthorizeParams = {
    amount: args.amount,
    idempotencyKey: idempotencyRow.key,
    cardNumber: args.cardNumber,
    cvv: args.cvv,
    expiryMonth: args.expiryMonth,
    expiryYear: args.expiryYear,
  };

  const result = await withRetry(
    () => authorizePayment(authorizationParams),
    (error: any) => error instanceof AppError && error.statusCode >= 500,
    3,
  );

  const bankUpdateAuthorize: BankAuthorizeUpdateParams = {
    id: paymentRow.id,
    bankAuthorizationId: result.authorization_id,
    authorizeExpiresAt: result.expires_at,
  };
  const res = await UpdatePaymentAuthorized(bankUpdateAuthorize);
  return res;
}
