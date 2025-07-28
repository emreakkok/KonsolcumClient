export class OrderDetailProductDto {
    basketItemId!: string;
  productName!: string;
  quantity!: number;
  unitPrice!: number;
  totalPrice!: number;
  showcaseImagePath?: string | null;
  description!: string;
}
