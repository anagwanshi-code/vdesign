import type { CheckoutCustomerDetails } from "@/types/checkout-customer";

export function normalizePhoneForRazorpay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  return digits;
}

export function formatShippingAddress(
  customer: CheckoutCustomerDetails,
): string {
  return [
    customer.street.trim(),
    customer.city.trim(),
    customer.state.trim(),
    customer.pinCode.trim(),
  ]
    .filter(Boolean)
    .join(", ");
}

export function customerDetailsToRazorpayNotes(
  customer: CheckoutCustomerDetails,
): Record<string, string> {
  const address = formatShippingAddress(customer);

  return {
    customerName: customer.fullName.trim(),
    customerEmail: customer.email.trim(),
    customerPhone: normalizePhoneForRazorpay(customer.phone),
    shippingAddress: address,
  };
}
