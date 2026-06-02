export type OrderDispatchRequestBody = {
  sanityDocumentId: string;
  awbNumber: string;
  courierName: string;
  customerEmail: string;
  customerName: string;
  orderId: string;
};

export type OrderDispatchSuccessResponse = {
  success: true;
  message: string;
  sanityDocumentId: string;
  orderStatus: "Dispatched";
};

export type OrderDispatchErrorResponse = {
  error: string;
};
