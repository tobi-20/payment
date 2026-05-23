import { delay } from './helpers';

export async function withRetry(
  fn: () => any,
  isRetryable: (error: any) => boolean,
  maxRetry: number,
) {
  let lastError;
  for (let i = 0; i <= maxRetry; i++) {
    const baseDelay = 2 ** i * 1000;
    const jitter = baseDelay * 0.2 * Math.random();

    try {
      const result = await fn();
      return result;
    } catch (error) {
      lastError = error;
      if (!isRetryable(error)) {
        throw error;
      }
      await delay(baseDelay + jitter);
    }
  }
  throw lastError;
}
//(error: any) => error.error === 'internal_error'
