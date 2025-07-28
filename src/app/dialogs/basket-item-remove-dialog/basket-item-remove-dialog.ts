import { Component, Inject, OnDestroy } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

declare var $: any;
@Component({
  selector: 'app-basket-item-remove-dialog',
  standalone: false,
  templateUrl: './basket-item-remove-dialog.html',
  styleUrl: './basket-item-remove-dialog.scss'
})
export class BasketItemRemoveDialog extends BaseDialog<BasketItemRemoveDialog> implements OnDestroy{
constructor(
    dialogRef: MatDialogRef<BasketItemRemoveDialog>, 
    @Inject(MAT_DIALOG_DATA) public data: BasketItemDeleteState
  ) {
    super(dialogRef);
  }
  
  ngOnDestroy(): void {
   $("#basketModal").modal("show");
  }
}

export enum BasketItemDeleteState {
  Yes,
  No
}