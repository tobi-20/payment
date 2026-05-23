import {
  BankAuthorizeUpdateParams,
  BankCaptureParams,
  BankRefundParams,
  BankVoidParams,
  createPaymentsParams,
  IdempotencyKeyRow,
  Payment,
  SaveIdempotencyParams,
} from './types';
import pool from '../db';

export async function createPayments(
  params: createPaymentsParams,
): Promise<Payment> {
  const sql = `INSERT INTO payments (order_id, customer_id, amount) VALUES ($1, $2, $3) RETURNING id, status, date_created, order_id, customer_id, amount`;
  const result = await pool.query(sql, [
    params.orderId,
    params.customerId,
    params.amount,
  ]);
  return result.rows[0];
}

export async function UpdatePaymentAuthorized(
  params: BankAuthorizeUpdateParams,
): Promise<Payment> {
  const sql = `UPDATE payments SET bank_authorize_id=$1, authorized_at=now(), status='authorized', authorized_expires_at= $2 WHERE id=$3 RETURNING id, status, date_created, order_id, customer_id, amount, bank_authorize_id, authorized_at`;
  const result = await pool.query(sql, [
    params.bankAuthorizationId,
    params.authorizeExpiresAt,
    params.id,
  ]);
  return result.rows[0];
}
export async function UpdatePaymentVoided(
  params: BankVoidParams,
): Promise<Payment> {
  const sql = `UPDATE payments SET bank_void_id=$1, status='voided', voided_at=now() WHERE id=$2 RETURNING id, status, date_created, order_id, customer_id, amount, bank_void_id`;
  const result = await pool.query(sql, [params.bankVoidId, params.id]);
  return result.rows[0];
}
export async function UpdatePaymentCaptured(
  params: BankCaptureParams,
): Promise<Payment> {
  const sql = `UPDATE payments SET bank_capture_id=$1, status='captured', captured_at=now() WHERE id=$2 RETURNING id, status, date_created, order_id, customer_id, amount, bank_capture_id`;
  const result = await pool.query(sql, [params.bankCaptureId, params.id]);
  return result.rows[0];
}
export async function UpdatePaymentRefunded(
  params: BankRefundParams,
): Promise<Payment> {
  const sql = `UPDATE payments SET bank_refund_id=$1, status='refunded', refunded_at=now() WHERE id=$2 RETURNING id, status, date_created, order_id, customer_id, amount, bank_refund_id`;
  const result = await pool.query(sql, [params.bankRefundId, params.id]);
  return result.rows[0];
}

export async function GetPaymentByOrderId(orderId: string): Promise<Payment> {
  const sql = `SELECT * FROM payments WHERE order_id=$1 `;
  const result = await pool.query(sql, [orderId]);
  return result.rows[0];
}

export async function GetPaymentByCustomerId(
  customerId: string,
): Promise<Promise<Payment>[]> {
  const sql = `SELECT * FROM payments WHERE customer_id=$1 `;
  const result = await pool.query(sql, [customerId]);
  return result.rows;
}

export async function SaveIdempotencyKey(
  params: SaveIdempotencyParams,
): Promise<IdempotencyKeyRow> {
  const sql = `INSERT INTO idempotency_keys (keys, operation, response, payment_id) VALUES ($1, $2, $3, $4) RETURNING keys, date_created, operation, payment_id, updated_at, response, date_expired`;
  const result = await pool.query(sql, [
    params.key,
    params.operation,
    params.response,
    params.paymentId,
  ]);

  return result.rows[0];
}
