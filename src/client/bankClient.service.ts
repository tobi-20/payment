import { AppError } from '../errors/errors';
import { AuthorizeParams, AuthorizePaymentReturn } from './types';

export async function authorizePayment(
  params: AuthorizeParams,
): Promise<AuthorizePaymentReturn> {
  const response = await fetch(`http://localhost:8787/api/v1/authorizations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': params.idempotencyKey,
    },
    body: JSON.stringify({
      amount: params.amount,
      card_number: params.cardNumber,
      cvv: params.cvv,
      expiry_month: parseInt(params.expiryMonth),
      expiry_year: parseInt(params.expiryYear),
    }),
  });
  let result;
  try {
    result = await response.json();
  } catch {
    throw new AppError('Invalid server response', 502);
  }

  //failure case
  if (!response.ok) {
    throw new AppError(result?.message ?? '', response.status);
  }
  return result;
}
