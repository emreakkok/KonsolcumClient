import { Component, Inject, OnDestroy } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

declare var $: any;
@Component({
  selector: 'app-shopping-complete-dialog',
  standalone: false,
  templateUrl: './shopping-complete-dialog.html',
  styleUrl: './shopping-complete-dialog.scss'
})
export class ShoppingCompleteDialog extends BaseDialog<ShoppingCompleteDialog> implements OnDestroy{
constructor(
    dialogRef: MatDialogRef<ShoppingCompleteDialog>, 
    @Inject(MAT_DIALOG_DATA) public data: ShoppingCompleteState
  ) {
    super(dialogRef);
  }
  show: boolean = false;
  
  onYesClick(): void {
    this.dialogRef.close(ShoppingCompleteState.Yes);
    this.show=true;
  }

  ngOnDestroy(): void {
  if(!this.show)
    $("#basketModal").modal("show");
  }
}

export enum ShoppingCompleteState {
  Yes,
  No
}