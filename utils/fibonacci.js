export function generateFibonacci(limit) {
  const fib = [1, 1];
  while (fib.length < limit) {
    const next = fib[fib.length - 1] + fib[fib.length - 2];
    fib.push(next);
  }
  return fib;
}
