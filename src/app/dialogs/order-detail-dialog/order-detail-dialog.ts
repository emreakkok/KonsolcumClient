import { ChangeDetectorRef, Component, EventEmitter, Inject, NgZone, Output } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrderDetailDto } from '../../contracts/order/order-detail';
import { OrderDetailProductDto } from '../../contracts/order/order-detail-product-dto';
import { OrderService } from '../../services/common/models/order-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomToastr, ToastrMessageType, ToastrPosition } from '../../services/common/custom-toastr';
import { DialogService } from '../../services/common/dialog-service';
import { CompleteOrderDialog, CompleteOrderState } from '../complete-order-dialog/complete-order-dialog';
import { SpinnerType } from '../../base/base';
import { AuthService } from '../../services/common/auth-service';

@Component({
  selector: 'app-order-detail-dialog',
  standalone: false,
  templateUrl: './order-detail-dialog.html',
  styleUrl: './order-detail-dialog.scss'
})
export class OrderDetailDialog extends BaseDialog<OrderDetailDialog>{

@Output() orderCompleted: EventEmitter<string> = new EventEmitter<string>(); 

orderDetail: OrderDetailDto | null = null;
  products: OrderDetailProductDto[] = [];
  isLoading: boolean = true;
  displayedColumns: string[] = ['productName', 'quantity', 'unitPrice', 'totalPrice', 'description'];

  constructor(
    dialogRef: MatDialogRef<OrderDetailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: OrderDetailDialogState | string,
    private orderService: OrderService,
    private spinner: NgxSpinnerService,
    private toastr: CustomToastr,
    private cdr: ChangeDetectorRef, // ChangeDetectorRef'i kullanmaya devam
    private ngZone: NgZone, // NgZone'u kullanmaya devam
    private dialogService: DialogService,
    private authService: AuthService 
  ) {
    super(dialogRef);
  }

  async ngOnInit(): Promise<void> {
    await this.loadOrderDetail();
  }

  async loadOrderDetail(): Promise<void> {
    this.spinner.show();
    this.isLoading = true; // Yükleme başlangıcında true
    // this.cdr.detectChanges(); // <-- İlk yükleme durumunu DOM'a hemen yansıtmak için denenebilir

    try {
      const orderId = typeof this.data === 'string' ? this.data : '';
      
      if (!orderId) {
        this.toastr.message(
          'Geçersiz sipariş ID. Lütfen geçerli bir sipariş seçin.',
          'Hata!',
          {
            messageType: ToastrMessageType.Error,
            position: ToastrPosition.TopRight
          }
        );
        // NgZone içinde isLoading'i false yapalım
        this.ngZone.run(() => {
          this.isLoading = false;
          this.spinner.hide();
        });
        return; 
      }

      this.orderDetail = await this.orderService.getOrderDetail(orderId, 
        () => { /* Başarı callback'i */ },
        (errorMessage) => {
          this.toastr.message(
            errorMessage,
            'Hata!',
            {
              messageType: ToastrMessageType.Error,
              position: ToastrPosition.TopRight
            }
          );
        }
      );
      
      if (this.orderDetail) {
        this.products = this.orderDetail.products || [];
      } else {
        this.toastr.message(
          'Sipariş detayları bulunamadı.',
          'Bilgi',
          {
            messageType: ToastrMessageType.Info,
            position: ToastrPosition.TopRight
          }
        );
      }

    } catch (error: any) {
      console.error('Order detail yükleme hatası:', error);
    } finally {
      // Yükleme tamamlandığında veya hata oluştuğunda
      // Angular'ın değişim algılama döngüsü içinde çalıştığımızdan emin olmak için
      // bu bloğu NgZone.run() içine alalım ve manuel tetikleme ekleyelim.
      this.ngZone.run(() => {
        this.isLoading = false;
        this.spinner.hide();
        this.cdr.detectChanges(); // <-- BURAYI EKLEYİN!
      });
    }
  }

  completeOrder(){
    this.dialogService.openDialog({
    componentType: CompleteOrderDialog,
    data: CompleteOrderState.Yes, // veya CompleteOrderState.No, ne gerekiyorsa
    afterClosed: async (result: CompleteOrderState) => {
      if (result === CompleteOrderState.Yes) {
        this.spinner.show(SpinnerType.BallAtom);
        await this.orderService.completeOrder(this.data as string);
        this.spinner.hide(SpinnerType.BallAtom);
        this.toastr.message("Sipariş başarıyla tamamlanmıştır!","Sipariş Tamamlandı",{
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.TopRight
        });
        this.orderCompleted.emit(this.data as string);
        await this.loadOrderDetail();
        this.dialogRef.close('completed');
        
      }
    }
  });
  }

  get canCompleteOrder(): boolean {
  return this.authService.userRoles.includes('Complete Order Yetkisi');
}


  }

  // HTML'de kullanılmıyor gibi görünüyor, orderDetail.totalPrice zaten mevcut.
  // Eğer kullanılıyorsa, burada gösterilen hesaplama mantığı ile tutarlı olmalı.
  // getTotalOrderAmount(): number {
  //   return this.products.reduce((total, product) => total + (product.unitPrice * product.quantity), 0);
  // }

// Dialog'un durumunu belirten enum
export enum OrderDetailDialogState {
  Close,
  OrderComplete // Sipariş tamamlandı işlemi için kullanılabilir
}