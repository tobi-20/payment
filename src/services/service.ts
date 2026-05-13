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
import { authorizePayment } from '../client/bankClient.handler';
import { AuthorizeParams } from '../client/types';

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
    idempotencyKey: key,
    cardNumber: args.cardNumber,
    cvv: args.cvv,
    expiryMonth: args.expiryMonth,
    expiryYear: args.expiryYear,
  };

  const result = await authorizePayment(authorizationParams);

  if ('error' in result) {
    return { error: '', message: '' };
  } else {
    const bankUpdateAuthorize: BankAuthorizeUpdateParams = {
      id: paymentRow.id,
      bankAuthorizationId: result.authorization_id,
      authorizeExpiresAt: result.expires_at,
    };
    await UpdatePaymentAuthorized(bankUpdateAuthorize);
  }
}
