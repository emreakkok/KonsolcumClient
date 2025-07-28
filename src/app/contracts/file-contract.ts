export class FileContract {
  id: string;
  fileName: string;
  path: string;
  createdDate: Date;
  updatedDate?: Date;
  categoryId?: string;
  productId?: string;
  showcase?: boolean; 
}
