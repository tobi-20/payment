import { checkLuhn } from '../utils/helpers';
const ErrInvalidCardNumber = 'Invalid card number';
const ErrInvalidCVV = 'Invalid CVV';
const ErrInvalidOrderId = 'Invalid Order id';
const ErrInvalidCustomerId = 'Invalid customer id';
const ErrInvalidIdempotencyKey = 'Invalid idempotency key';
const ErrInvalidMoney = 'Invalid amount';
const ErrInvalidExpiryMonth = 'Invalid expiry month';
const ErrInvalidExpiryYear = 'Invalid expiry year';
const ErrCardExpired = 'Card expired';

type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
type RawOrder = {
  orderId: string;
  customerId: string;
  amount: number;
  idempotencyKey: string;
  cardNumber: string;
  cvv: string;
  expiryMonth: number;
  expiryYear: number;
};
type CVVError = 'Invalid CVV';
class CVV {
  private constructor(public readonly value: string) {}

  static create(value: string): Result<CVV, CVVError> {
    if (!/^\d{3,4}$/.test(value))
      return {
        ok: false,
        error: ErrInvalidCVV,
      };
    return {
      ok: true,
      value: new CVV(value),
    };
  }
}

type CardNumberError = 'Invalid card number';

class CardNumber {
  private constructor(public readonly value: string) {}

  static create(value: string): Result<CardNumber, CardNumberError> {
    if (!checkLuhn(value))
      return {
        ok: false,
        error: ErrInvalidCardNumber,
      };
    return { ok: true, value: new CardNumber(value) };
  }
}

type orderIdError = 'Invalid Order id';
class OrderId {
  private constructor(public readonly value: string) {}

  static create(value: string): Result<OrderId, orderIdError> {
    if (!value.trim()) return { ok: false, error: ErrInvalidOrderId };
    return {
      ok: true,
      value: new OrderId(value),
    };
  }
}
type CustomerIdError = 'Invalid customer id';
class CustomerId {
  private constructor(public readonly value: string) {}

  static create(value: string): Result<CustomerId, CustomerIdError> {
    if (!value.trim())
      return {
        ok: false,
        error: ErrInvalidCustomerId,
      };
    return {
      ok: true,
      value: new CustomerId(value),
    };
  }
}

type IdempotencyKeyError = 'Invalid idempotency key';
class IdempotencyKey {
  private constructor(public readonly value: string) {}

  static create(value: string): Result<IdempotencyKey, IdempotencyKeyError> {
    if (!value.trim())
      return {
        ok: false,
        error: ErrInvalidIdempotencyKey,
      };
    return {
      ok: true,
      value: new IdempotencyKey(value),
    };
  }
}
type MoneyError = 'Invalid amount';
class Money {
  private constructor(
    public readonly value: number,
    public readonly currency: 'USD',
  ) {}

  static create(value: number): Result<Money, MoneyError> {
    if (!Number.isFinite(value) || value <= 0) {
      return {
        ok: false,
        error: ErrInvalidMoney,
      };
    }

    return {
      ok: true,
      value: new Money(value, 'USD'),
    };
  }
}
type ExpiryDateError =
  | 'Invalid expiry month'
  | 'Invalid expiry year'
  | 'Card expired'
  | ('Invalid expiry month' & 'Invalid expiry year')
  | ('Card expired' & 'Invalid expiry month')
  | ('Card expired' & 'Invalid expiry year')
  | ('Card expired' & 'Invalid expiry month' & 'Invalid expiry year');
class ExpiryDate {
  private constructor(
    public readonly month: number,
    public readonly year: number,
  ) {}

  static create(
    month: number,
    year: number,
  ): Result<ExpiryDate, ExpiryDateError> {
    if (!Number.isInteger(month) || month < 1 || month > 12)
      return { ok: false, error: ErrInvalidExpiryMonth };

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (!Number.isInteger(year))
      return { ok: false, error: ErrInvalidExpiryYear };

    if (year < currentYear) return { ok: false, error: ErrCardExpired };

    if (year === currentYear && month < currentMonth)
      return { ok: false, error: ErrCardExpired };

    return { ok: true, value: new ExpiryDate(month, year) };
  }
}
type PaymentMethodError =
  | 'Invalid CVV'
  | 'Invalid card number'
  | ('Invalid expiry month' | 'Invalid expiry year' | 'Card expired');
class PaymentMethod {
  private constructor(
    public readonly cardNumber: CardNumber,
    public readonly cvv: CVV,
    public readonly expiry: ExpiryDate,
  ) {}

  static create(input: {
    cardNumber: string;
    cvv: string;
    expiryMonth: number;
    expiryYear: number;
  }): Result<PaymentMethod, PaymentMethodError> {
    const cardNumber = CardNumber.create(input.cardNumber);
    if (!cardNumber.ok) return cardNumber;
    const cvv = CVV.create(input.cardNumber);
    if (!cvv.ok) return cvv;
    const expiryDate = ExpiryDate.create(input.expiryMonth, input.expiryYear);
    if (!expiryDate.ok) return expiryDate;
    return {
      ok: true,
      value: new PaymentMethod(cardNumber.value, cvv.value, expiryDate.value),
    };
  }
}

type OrderError =
  | PaymentMethodError
  | 'Invalid Order id'
  | 'Invalid customer id'
  | 'Invalid amount'
  | 'Invalid idempotency key';
export class Order {
  private constructor(
    public readonly orderId: OrderId,
    public readonly customerId: CustomerId,
    public readonly amount: Money,
    public readonly payment: PaymentMethod,
    public readonly idempotencyKey: IdempotencyKey,
  ) {}

  static create(input: RawOrder): Result<Order, OrderError> {
    const orderId = OrderId.create(input.orderId);
    if (!orderId.ok) return orderId;

    const customerId = CustomerId.create(input.customerId);
    if (!customerId.ok) return customerId;

    const amount = Money.create(input.amount);
    if (!amount.ok) return amount;

    const payment = PaymentMethod.create({
      cardNumber: input.cardNumber,
      cvv: input.cvv,
      expiryMonth: input.expiryMonth,
      expiryYear: input.expiryYear,
    });
    if (!payment.ok) return payment;

    const idempotencyKey = IdempotencyKey.create(input.idempotencyKey);
    if (!idempotencyKey.ok) return idempotencyKey;

    return {
      ok: true,
      value: new Order(
        orderId.value,
        customerId.value,
        amount.value,
        payment.value,
        idempotencyKey.value,
      ),
    };
  }
}
