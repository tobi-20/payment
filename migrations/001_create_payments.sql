CREATE TYPE payment_status AS ENUM(
'pending', 'authorized', 'voided', 'captured', 'refunded'
);

CREATE TABLE IF NOT EXISTS payments(
  id BIGSERIAL NOT NULL PRIMARY KEY,
  date_created TIMESTAMPTZ NOT NULL DEFAULT now(),
  order_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  date_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  amount BIGINT NOT NULL,
  bank_authorize_id TEXT,
  bank_void_id TEXT,
  bank_capture_id TEXT,
  bank_refund_id TEXT,
  status payment_status DEFAULT 'pending'
);


