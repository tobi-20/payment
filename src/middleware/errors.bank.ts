import { AppError } from '../errors/errors';

export function classifyBankError(error: string, message: string): AppError {
  switch (error) {
    case 'insufficient_funds':
      return new AppError(message, 403);

    case 'invalid_card':
    case 'card_expired':
    case 'invalid_cvv':
      return new AppError(message, 400);

    case 'authorization_not_found':
    case 'capture_not_found':
      return new AppError(message, 404);

    case 'internal_error':
      return new AppError(message, 500);

    default:
      return new AppError('Unknown bank error', 500);
  }
}
