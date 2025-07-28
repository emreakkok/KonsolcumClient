export interface MyOrder {
  id: string;
  orderCode: string;
  username: string;
  shippingAddress: string;
  totalPrice: number;
  createdDate: Date;
  isCompleted: boolean;
}

export interface MyOrdersResponse {
  orders: MyOrder[];
  totalOrderCount: number;
  userName: string;
}
