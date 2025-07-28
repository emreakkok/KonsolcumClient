import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Base, SpinnerType } from '../../../base/base';
import { NgxSpinnerService } from 'ngx-spinner';
import { BasketService } from '../../../services/common/models/basket-service';
import { List_Basket_Item } from '../../../contracts/basket/list-basket-item';
import { Update_Basket_Item } from '../../../contracts/basket/update-basket-item';
import { CustomToastr, ToastrMessageType, ToastrPosition } from '../../../services/common/custom-toastr';
import { OrderService } from '../../../services/common/models/order-service';
import { Create_Order } from '../../../contracts/order/create-order';
import { Router } from '@angular/router';
import { DialogService } from '../../../services/common/dialog-service';
import { BasketItemDeleteState, BasketItemRemoveDialog } from '../../../dialogs/basket-item-remove-dialog/basket-item-remove-dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-basket',
  standalone: false,
  templateUrl: './basket.html',
  styleUrl: './basket.scss'
})
export class Basket extends Base implements OnInit{

  addressForm: FormGroup;
  showAddressForm: boolean = false;

  constructor(
    spinner: NgxSpinnerService,
    private basketService: BasketService,
    private cdRef: ChangeDetectorRef,
    private customToastr: CustomToastr,
    private orderService: OrderService,
    private router: Router,
    private dialogService: DialogService,
    private formBuilder: FormBuilder
  ) {
    super(spinner);
    
    // Adres formu oluştur
    this.addressForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],
      address: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      district: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      notes: ['', [Validators.maxLength(200)]]
    });
  }

  basketItems: List_Basket_Item[] = [];

  isAuthenticated(): boolean {
    return !!localStorage.getItem("accessToken");
  }

  async ngOnInit(): Promise<void> {
    if (!this.isAuthenticated()) {
      this.basketItems = [];
      return;
    }

    this.showSpinner(SpinnerType.BallAtom);

    try {
      const items = await this.basketService.get();
      setTimeout(() => {
        this.basketItems = items;
        this.cdRef.detectChanges();
      });
    } catch (error) {
      console.error("Sepet alınamadı:", error);
      this.basketItems = [];
    }

    this.hideSpinner(SpinnerType.BallAtom);
  }

  async changeQuantity(event: Event, basketItemId: string): Promise<void> {
    const inputElement = event.target as HTMLInputElement;
    const newQuantity = parseInt(inputElement.value, 10);

    console.log('Update Request Data:', { basketItemId, newQuantity });

    if (!basketItemId || isNaN(newQuantity) || newQuantity <= 0) {
      console.error("Geçersiz veri:", basketItemId, newQuantity);
      inputElement.value = "1";
      this.customToastr.message("Geçersiz miktar değeri!", "Hata!", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      });
      return;
    }

    const currentBasketItem = this.basketItems.find(item => item.basketItemId === basketItemId);
    if (!currentBasketItem) {
      console.error("Sepet öğesi bulunamadı:", basketItemId);
      inputElement.value = "1";
      this.customToastr.message("Sepet öğesi bulunamadı!", "Hata!", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      });
      return;
    }

    if (newQuantity > currentBasketItem.stockQuantity) {
      inputElement.value = currentBasketItem.quantity.toString();
      this.customToastr.message(
        `Stok limitini aştınız! Maksimum ${currentBasketItem.stockQuantity} adet seçebilirsiniz.`, 
        "Stok Limiti Aşıldı!", {
          messageType: ToastrMessageType.Warning,
          position: ToastrPosition.TopRight
        }
      );
      return;
    }

    try {
      this.showSpinner(SpinnerType.BallAtom);

      const basketItem: Update_Basket_Item = {
        basketItemId,
        quantity: newQuantity
      };

      console.log('Sending update request:', basketItem);

      await this.basketService.updateQuantity(basketItem);
      console.log('Update successful');
      
      this.customToastr.message(
        `${currentBasketItem.name} miktarı ${newQuantity} adet olarak güncellendi.`, 
        "Başarılı!", {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.TopRight
        }
      );
      
      await this.ngOnInit();
      
    } catch (error) {
      console.error("Adet güncellenirken hata:", error);
      
      inputElement.value = currentBasketItem.quantity.toString();
      
      this.customToastr.message("Miktar güncellenirken bir hata oluştu!", "Hata!", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      });
    } finally {
      this.hideSpinner(SpinnerType.BallAtom);
    }
  }

  increaseQuantity(basketItemId: string): void {
    const basketItem = this.basketItems.find(item => item.basketItemId === basketItemId);
    if (!basketItem) return;

    const newQuantity = basketItem.quantity + 1;
    
    if (newQuantity > basketItem.stockQuantity) {
      this.customToastr.message(
        `Stok limitini aştınız! Maksimum ${basketItem.stockQuantity} adet seçebilirsiniz.`, 
        "Stok Limiti Aşıldı!", {
          messageType: ToastrMessageType.Warning,
          position: ToastrPosition.TopRight
        }
      );
      return;
    }

    this.updateQuantityDirectly(basketItemId, newQuantity);
  }

  decreaseQuantity(basketItemId: string): void {
    const basketItem = this.basketItems.find(item => item.basketItemId === basketItemId);
    if (!basketItem || basketItem.quantity <= 1) return;

    const newQuantity = basketItem.quantity - 1;
    this.updateQuantityDirectly(basketItemId, newQuantity);
  }

  private async updateQuantityDirectly(basketItemId: string, newQuantity: number): Promise<void> {
    try {
      this.showSpinner(SpinnerType.BallAtom);

      const basketItem: Update_Basket_Item = {
        basketItemId,
        quantity: newQuantity
      };

      await this.basketService.updateQuantity(basketItem);
      
      const currentItem = this.basketItems.find(item => item.basketItemId === basketItemId);
      if (currentItem) {
        this.customToastr.message(
          `${currentItem.name} miktarı ${newQuantity} adet olarak güncellendi.`, 
          "Başarılı!", {
            messageType: ToastrMessageType.Success,
            position: ToastrPosition.TopRight
          }
        );
      }
      
      await this.ngOnInit();
      
    } catch (error) {
      console.error("Adet güncellenirken hata:", error);
      this.customToastr.message("Miktar güncellenirken bir hata oluştu!", "Hata!", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      });
    } finally {
      this.hideSpinner(SpinnerType.BallAtom);
    }
  }

  getTotalAmount(): number {
    return this.basketItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  hasStockIssues(): boolean {
    return this.basketItems.some(item => 
      item.quantity > item.stockQuantity || 
      item.stockQuantity <= 0
    );
  }

  getTotalItemCount(): number {
    return this.basketItems.reduce((total, item) => total + item.quantity, 0);
  }

  removeBasketItem(basketItemId: string) {
    $("#basketModal").modal("hide");

    this.dialogService.openDialog({
      componentType: BasketItemRemoveDialog,
      data: BasketItemDeleteState.Yes,
      afterClosed: async (result) => {
        if (result === BasketItemDeleteState.Yes) {
          this.showSpinner(SpinnerType.BallAtom);

          try {
            await this.basketService.remove(basketItemId);
            $("." + basketItemId).fadeOut(500, () => {
              this.hideSpinner(SpinnerType.BallAtom);
              this.ngOnInit();
            });

            this.customToastr.message("Ürün sepetten kaldırıldı.", "Başarılı!", {
              messageType: ToastrMessageType.Success,
              position: ToastrPosition.TopRight
            });

            $("#basketModal").modal("show");
          } catch (error) {
            console.error("Ürün silinirken hata:", error);
            this.customToastr.message("Ürün silinirken bir hata oluştu!", "Hata!", {
              messageType: ToastrMessageType.Error,
              position: ToastrPosition.TopRight
            });
            this.hideSpinner(SpinnerType.BallAtom);
            $("#basketModal").modal("show");
          }
        } else {
          $("#basketModal").modal("show");
        }
      }
    });
  }

  // Adres formunu göster/gizle
  toggleAddressForm(): void {
    this.showAddressForm = !this.showAddressForm;
  }

  // Form alanları için getter'lar
  get fullNameControl() { return this.addressForm.get('fullName'); }
  get phoneControl() { return this.addressForm.get('phone'); }
  get addressControl() { return this.addressForm.get('address'); }
  get districtControl() { return this.addressForm.get('district'); }
  get cityControl() { return this.addressForm.get('city'); }
  get notesControl() { return this.addressForm.get('notes'); }

  // Siparişi tamamla
  async shoppingComplete(): Promise<void> {
    // Önce stok kontrolü yap
    if (this.hasStockIssues()) {
      this.customToastr.message(
        "Sepetinizde stok sorunu olan ürünler var. Lütfen miktarları düzenleyin.", 
        "Stok Sorunu!", {
          messageType: ToastrMessageType.Warning,
          position: ToastrPosition.TopRight
        }
      );
      return;
    }

    // Sepet boş mu kontrol et
    if (this.basketItems.length === 0) {
      this.customToastr.message(
        "Sepetinizde ürün bulunmuyor.", 
        "Sepet Boş!", {
          messageType: ToastrMessageType.Warning,
          position: ToastrPosition.TopRight
        }
      );
      return;
    }

    // Adres formu gösterilmemişse göster
    if (!this.showAddressForm) {
      this.showAddressForm = true;
      this.customToastr.message(
        "Lütfen teslimat bilgilerinizi doldurun.", 
        "Teslimat Bilgileri", {
          messageType: ToastrMessageType.Info,
          position: ToastrPosition.TopRight
        }
      );
      return;
    }

    // Form validasyonu
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      this.customToastr.message(
        "Lütfen tüm zorunlu alanları doldurun.", 
        "Form Hatası!", {
          messageType: ToastrMessageType.Warning,
          position: ToastrPosition.TopRight
        }
      );
      return;
    }

    try {
      this.showSpinner(SpinnerType.BallAtom);
      
      // Adres bilgilerini birleştir
      const formValues = this.addressForm.value;
      const fullAddress = `
        Ad Soyad: ${formValues.fullName}
        Telefon: ${formValues.phone}
        Adres: ${formValues.address}
        İlçe: ${formValues.district}
        İl: ${formValues.city}
        ${formValues.notes ? 'Not: ' + formValues.notes : ''}
      `.trim();

      const order: Create_Order = new Create_Order();
      order.shippingAddress = fullAddress;
      
      await this.orderService.create(order);
      
      this.customToastr.message("Sipariş alınmıştır!", "Sipariş Oluşturuldu!", {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight
      });

      // Formu sıfırla ve gizle
      this.addressForm.reset();
      this.showAddressForm = false;
      
      $("#basketModal").modal("hide");
      this.router.navigate(["/"]);
      
    } catch (error) {
      console.error("Sipariş oluşturulurken hata:", error);
      this.customToastr.message("Sipariş oluşturulurken bir hata oluştu!", "Hata!", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      });
    } finally {
      this.hideSpinner(SpinnerType.BallAtom);
    }
  }
}