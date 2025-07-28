import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseDialog } from '../base/base-dialog';

@Component({
  selector: 'app-delete-dialog',
  standalone: false,
  templateUrl: './delete-dialog.html',
  styleUrl: './delete-dialog.scss'
})
export class DeleteDialog extends BaseDialog<DeleteDialog> {
  constructor(
    dialogRef: MatDialogRef<DeleteDialog>, 
    @Inject(MAT_DIALOG_DATA) public data: DeleteState
  ) {
    super(dialogRef);
  }


}

export enum DeleteState {
  Yes,
  No
}