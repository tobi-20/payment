export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function checkLuhn(n: string): boolean {
  //"1234567895747374266"

  let sum = 0;
  let isSecond = false;
  if (!/^\d+$/.test(n)) return false; // only digits allowed in string literal
  for (let i = n.length - 1; i >= 0; i--) {
    let digit = Number(n[i]);
    if (isSecond) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;

    isSecond = !isSecond;
  }
  return sum % 10 === 0;
}
