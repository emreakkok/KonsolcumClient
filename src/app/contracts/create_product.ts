export class Create_Product {

  name: string = '';
  description: string = '';
  price: number = 0;
  stockQuantity: number = 0;
  isActive: boolean = true;     // Ürün aktif mi?
  isFeatured: boolean = true;  // Öne çıkan ürün mü?
  categoryId: string = '';     
   // Hangi kategoriye ait (Guid string olarak)
}
