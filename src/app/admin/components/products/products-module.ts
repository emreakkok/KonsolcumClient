import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Products } from './products';
import { RouterModule } from '@angular/router';
import { Create } from './create/create';
import { List } from './list/list';


// Angular Material Modules
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card'; 
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { DialogModule } from '../../../dialogs/dialog-module';
import { FileUploadModule } from '../../../services/common/file-upload/file-upload-module';
import { ProductDeleteDirective } from '../../../directives/admin/delete-product';
@NgModule({
  declarations: [
    Products,
    Create,
    List,
    ProductDeleteDirective 
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(
      [
        { path: "", component: Products }
      ]
    ),
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatSidenavModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,      
    MatSlideToggleModule, 
    MatButtonModule,
    MatCardModule,MatTooltipModule, MatSortModule, DialogModule , FileUploadModule,
    
  ]
})
export class ProductsModule { }
