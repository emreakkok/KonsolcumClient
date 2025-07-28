import { Injectable } from '@angular/core';
import { DialogPosition, MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) { }

  openDialog(dialogParameters: DialogParameters): void {
    // componentType'ın tanımlı olduğunu kontrol et
    if (!dialogParameters.componentType) {
      console.error('componentType is required');
      return;
    }

    const dialogRef = this.dialog.open(dialogParameters.componentType, {
      width: dialogParameters.options?.width,
      height: dialogParameters.options?.height,
      position: dialogParameters.options?.position,
      data: dialogParameters.data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // afterClosed callback'ini result parametresi ile çağır
      if (dialogParameters.afterClosed) {
        dialogParameters.afterClosed(result);
      }
    });
  }
}

export class DialogParameters {
  componentType!: ComponentType<any>; // ! işareti ile required olduğunu belirt
  data?: any; // Optional olarak işaretle
  afterClosed?: (result: any) => void; // result parametresi ekle
  options?: Partial<DialogOptions> = new DialogOptions();
}

export class DialogOptions {
  width?: string = "300px";
  height?: string;
  position?: DialogPosition;
}