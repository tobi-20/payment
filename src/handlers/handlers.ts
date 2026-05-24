import { NextFunction, Request, Response } from 'express';

import { Order } from '../domain/order.domain';

export function createPaymentHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let result;
  try {
    result = Order.create(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
