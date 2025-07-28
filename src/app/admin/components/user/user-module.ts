import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from './user';
import { List } from './list/list';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DeleteDirectiveModule } from '../../../directives/admin/delete-directive-module';
import { FileUploadModule } from '../../../services/common/file-upload/file-upload-module';
import { DialogModule } from '../../../dialogs/dialog-module';
import { MatSortModule } from '@angular/material/sort';



@NgModule({
  declarations: [
    User,
    List
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(
      [
        {path: "",component: User}
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
export class UserModule { }
