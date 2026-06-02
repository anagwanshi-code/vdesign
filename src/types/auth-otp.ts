export type SendOtpRequestBody = {
  email: string;
};

export type SendOtpSuccessResponse = {
  success: true;
  message: string;
};

export type VerifyOtpRequestBody = {
  email: string;
  otp: string;
};

export type VerifyOtpProfile = {
  customerName: string;
  phone: string;
  shippingAddress: string;
  street?: string;
  city?: string;
  state?: string;
  pinCode?: string;
};

export type VerifyOtpSuccessResponse = {
  success: true;
  profile: VerifyOtpProfile | null;
};

export type AuthOtpErrorResponse = {
  error: string;
};
