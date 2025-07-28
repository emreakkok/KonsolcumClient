import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from './category';
import { RouterModule } from '@angular/router';
import { List } from './list/list';
import { Create } from './create/create';

import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule} from '@angular/material/paginator'
import { MatSortModule } from '@angular/material/sort'
import { DeleteDirective } from '../../../directives/admin/delete';
import {MatDialogModule} from '@angular/material/dialog';
import { FileUploadModule } from '../../../services/common/file-upload/file-upload-module';
import { DialogModule } from '../../../dialogs/dialog-module';
import { DeleteDirectiveModule } from '../../../directives/admin/delete-directive-module';


@NgModule({
  declarations: [
    Category,
    Create,
    List
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(
      [
        { path: "", component: Category}
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
    MatCardModule,MatTooltipModule, MatSortModule, DialogModule , FileUploadModule , DeleteDirectiveModule
  ]
})
export class CategoryModule { }
