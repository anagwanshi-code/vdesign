import Razorpay from "razorpay";
import { isRazorpayConfigured } from "@/lib/razorpay/config";

export function createRazorpayClient(): Razorpay | null {
  if (!isRazorpayConfigured()) {
    return null;
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}
