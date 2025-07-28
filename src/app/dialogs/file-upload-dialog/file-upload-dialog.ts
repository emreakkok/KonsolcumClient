import { Component, Inject } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-file-upload-dialog',
  standalone: false,
  templateUrl: './file-upload-dialog.html',
  styleUrl: './file-upload-dialog.scss'
})
export class FileUploadDialog extends BaseDialog<FileUploadDialog>{

  constructor(dialogRef: MatDialogRef<FileUploadDialog>,  @Inject(MAT_DIALOG_DATA) public data : FileUploadDialogState){
    super(dialogRef);
  }

}

export enum FileUploadDialogState{
  Yes,
  No
}
