import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUpload } from './file-upload';
import { NgxFileDropModule } from 'ngx-file-drop';
import { DialogModule } from '../../../dialogs/dialog-module';
import { FileUploadDialog } from '../../../dialogs/file-upload-dialog/file-upload-dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    FileUpload,
    FileUploadDialog,
    
  ],
  imports: [
    CommonModule,
    NgxFileDropModule,
    MatDialogModule, MatButtonModule
  ],
  exports:[
    FileUpload,
    FileUploadDialog
  ]
})
export class FileUploadModule { }
