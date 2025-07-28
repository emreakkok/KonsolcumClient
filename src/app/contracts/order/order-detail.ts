import { OrderDetailProductDto } from "./order-detail-product-dto";

export class OrderDetailDto{
  orderId!: string;
  orderCode!: string;
  shippingAddress!: string;
  userName!: string;
  totalPrice!: number;
  createdDate!: Date;
  products!: OrderDetailProductDto[];
  isCompleted: boolean;
}
