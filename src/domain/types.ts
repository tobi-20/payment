import { checkLuhn } from '../utils/helpers';
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

class CVV {
  private constructor(public readonly value: string) {}

  static create(value: string): CVV {
    if (!/^\d{3,4}$/.test(value)) {
      throw new Error('Invalid CVV');
    }
    return new CVV(value);
  }
}

class CardNumber {
  private constructor(public readonly value: string) {}

  static create(value: string): CardNumber {
    if (!checkLuhn(value)) {
      throw new Error('Invalid card number');
    }
    return new CardNumber(value);
  }
}
class OrderId {
  private constructor(public readonly value: string) {}

  static create(value: string): OrderId {
    if (!value.trim()) throw new Error('Invalid OrderId');
    return new OrderId(value);
  }
}

class CustomerId {
  private constructor(public readonly value: string) {}

  static create(value: string): CustomerId {
    if (!value.trim()) throw new Error('Invalid CustomerId');
    return new CustomerId(value);
  }
}

class IdempotencyKey {
  private constructor(public readonly value: string) {}

  static create(value: string): IdempotencyKey {
    if (!value.trim()) throw new Error('Invalid IdempotencyKey');
    return new IdempotencyKey(value);
  }
}
class Money {
  private constructor(
    public readonly value: number,
    public readonly currency: 'USD',
  ) {}

  static create(value: number): Money {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error('Invalid money amount');
    }

    return new Money(value, 'USD');
  }
}
class ExpiryDate {
  private constructor(
    public readonly month: number,
    public readonly year: number,
  ) {}

  static create(month: number, year: number): ExpiryDate {
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      throw new Error('Invalid expiry month');
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (!Number.isInteger(year)) {
      throw new Error('Invalid expiry year');
    }

    if (year < currentYear) {
      throw new Error('Card expired');
    }

    if (year === currentYear && month < currentMonth) {
      throw new Error('Card expired');
    }

    return new ExpiryDate(month, year);
  }
}

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
  }): PaymentMethod {
    return new PaymentMethod(
      CardNumber.create(input.cardNumber),
      CVV.create(input.cvv),
      ExpiryDate.create(input.expiryMonth, input.expiryYear),
    );
  }
}

export class Order {
  private constructor(
    public readonly orderId: OrderId,
    public readonly customerId: CustomerId,
    public readonly amount: Money,
    public readonly payment: PaymentMethod,
    public readonly idempotencyKey: IdempotencyKey,
  ) {}

  static create(input: RawOrder): Order {
    return new Order(
      OrderId.create(input.orderId),
      CustomerId.create(input.customerId),
      Money.create(input.amount),
      PaymentMethod.create({
        cardNumber: input.cardNumber,
        cvv: input.cvv,
        expiryMonth: input.expiryMonth,
        expiryYear: input.expiryYear,
      }),
      IdempotencyKey.create(input.idempotencyKey),
    );
  }
}
