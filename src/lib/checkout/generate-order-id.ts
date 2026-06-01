export function generateOrderId(): string {
  const suffix = Date.now().toString(36).toUpperCase().slice(-8);
  const random = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `ORD-${suffix}${random}`;
}
