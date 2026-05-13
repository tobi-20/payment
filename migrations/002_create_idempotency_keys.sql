CREATE TYPE ops AS ENUM(
 'authorize', 'void', 'capture', 'refund'
);

CREATE TABLE IF NOT EXISTS idempotency_keys(
  keys TEXT NOT NULL PRIMARY KEY ,
  date_created TIMESTAMPTZ NOT NULL DEFAULT now(),
  operation ops,
  payment_id BIGINT REFERENCES payments(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  response TEXT,
  date_expired TIMESTAMPTZ
  );

 