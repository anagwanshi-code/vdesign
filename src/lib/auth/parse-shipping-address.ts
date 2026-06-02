/**
 * Parses combined shipping strings saved on orders (street, city, state, PIN).
 */
export function parseShippingAddressForCheckout(address: string): {
  street: string;
  city: string;
  state: string;
  pinCode: string;
} | null {
  const trimmed = address.trim();
  if (!trimmed) {
    return null;
  }

  const parts = trimmed.split(",").map((part) => part.trim()).filter(Boolean);

  if (parts.length < 4) {
    return { street: trimmed, city: "", state: "", pinCode: "" };
  }

  const pinCode = parts[parts.length - 1];
  const state = parts[parts.length - 2];
  const city = parts[parts.length - 3];
  const street = parts.slice(0, -3).join(", ");

  if (!/^\d{6}$/.test(pinCode)) {
    return { street: trimmed, city: "", state: "", pinCode: "" };
  }

  return { street, city, state, pinCode };
}
