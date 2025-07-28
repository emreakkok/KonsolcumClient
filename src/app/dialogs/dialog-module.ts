import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteDialog } from './delete-dialog/delete-dialog';
import { FileUploadDialog } from './file-upload-dialog/file-upload-dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { SelectCategoryImageDialog } from './select-category-image-dialog/select-category-image-dialog';
import { FileUploadModule } from "../services/common/file-upload/file-upload-module";
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { SelectProductImageDialog } from './select-product-image-dialog/select-product-image-dialog';
import { MatRadioModule } from '@angular/material/radio';
import { BasketItemRemoveDialog } from './basket-item-remove-dialog/basket-item-remove-dialog';
import { ShoppingCompleteDialog } from './shopping-complete-dialog/shopping-complete-dialog';
import { OrderDetailDialog } from './order-detail-dialog/order-detail-dialog';
import { CompleteOrderDialog } from './complete-order-dialog/complete-order-dialog';
import { AuthorizeMenuDialog } from './authorize-menu-dialog/authorize-menu-dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { AuthorizeUserDialog } from './authorize-user-dialog/authorize-user-dialog';
import { UpdateCategoryDialog } from './update-category-dialog/update-category-dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { UpdateProductDialog } from './update-product-dialog/update-product-dialog';
import { MatSelectModule } from '@angular/material/select';
@NgModule({
  declarations: [
    DeleteDialog,
    SelectCategoryImageDialog,
    SelectProductImageDialog,
    BasketItemRemoveDialog,
    ShoppingCompleteDialog,
    OrderDetailDialog,
    CompleteOrderDialog,
    AuthorizeMenuDialog,
    AuthorizeUserDialog,
    UpdateCategoryDialog,
    UpdateProductDialog
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    FileUploadModule,
    MatCardModule,
    MatRadioModule,
    MatBadgeModule,
    MatListModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
    
]
})
export class DialogModule { }
