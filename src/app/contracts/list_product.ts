export class List_Product {
    id: string = '';
    name: string = '';
    description: string = '';
    price: number = 0;
    stockQuantity: number = 0;
    isActive: boolean = true;
    isFeatured: boolean = false;
    categoryId: string = '';
    categoryName?: string = '';
    createdDate: Date = new Date();
    updatedDate?: Date;
    showcaseImagePath?: string;
}
