import { MatDialogRef } from "@angular/material/dialog";

export class BaseDialog<DialogComponent> {

    constructor(public dialogRef : MatDialogRef<DialogComponent>) //generic
  {
  
  }

    close(){
    this.dialogRef.close();
  }
}
