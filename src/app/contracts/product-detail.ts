export class ProductDetail {
    id: string = '';
    name: string = '';
    description: string = '';
    price: number = 0;
    stockQuantity: number = 0;
    isActive: boolean = true;
    isFeatured: boolean = false;
    categoryId: string = '';
    categoryName: string = '';
    createdDate: Date = new Date();
    updatedDate?: Date;
    showcaseImagePath?: string;
    images: ProductImage[] = [];
    success: boolean = false;
    message: string = '';
}

export class ProductImage {
    id: string = '';
    fileName: string = '';
    path: string = '';
    showcase: boolean = false;
    createdDate: Date = new Date();
    updatedDate?: Date;
}
