import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ProductDetail } from '../../../../contracts/product-detail';
import { ProductService } from '../../../../services/common/models/product-service';
import { BasketService } from '../../../../services/common/models/basket-service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomToastr, ToastrMessageType, ToastrPosition } from '../../../../services/common/custom-toastr';
import { SpinnerType } from '../../../../base/base';
import { Create_Basket_Item } from '../../../../contracts/basket/create-basket-item';

@Component({
  selector: 'app-product-detail-component',
  standalone: false,
  templateUrl: './product-detail-component.html',
  styleUrl: './product-detail-component.scss'
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: ProductDetail = new ProductDetail();
  isLoading: boolean = false;
  
  // Image slider properties
  currentImageIndex: number = 0;
  autoSlideInterval: any;
  quantity: number = 1;

  constructor(
    private productService: ProductService,
    private basketService: BasketService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private toastr: CustomToastr,
    @Inject('baseSignalRUrl') private baseSignalRUrl: string
  ) {}

  async ngOnInit() {
    this.activatedRoute.params.subscribe(async params => {
      const productId = params['id'];
      if (productId) {
        await this.loadProductDetail(productId);
      }
    });
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  async loadProductDetail(productId: string) {
    this.isLoading = true;
    this.spinner.show(SpinnerType.BallAtom);

    try {
      const result = await this.productService.getProductDetail(
        productId,
        () => {
          this.spinner.hide(SpinnerType.BallAtom);
          this.isLoading = false;
        },
        errorMessage => {
          this.toastr.message(errorMessage, "Hata!", {
            messageType: ToastrMessageType.Error,
            position: ToastrPosition.TopRight
          });
          this.spinner.hide(SpinnerType.BallAtom);
          this.isLoading = false;
        }
      );

      if (result.success) {
        this.product = result;
        this.startAutoSlide();
      } else {
        this.toastr.message(result.message || "Ürün detayları yüklenirken bir hata oluştu.", "Hata!", {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight
        });
        this.router.navigate(['/products']);
      }

      this.cdr.detectChanges();
    } catch (error) {
      this.toastr.message("Ürün detayları yüklenirken beklenmeyen bir hata oluştu.", "Hata!", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      });
      this.router.navigate(['/products']);
    } finally {
      this.spinner.hide(SpinnerType.BallAtom);
      this.isLoading = false;
    }
  }

  // Image slider methods
  getImageUrl(imagePath: string): string {
    if (!imagePath) return `${this.baseSignalRUrl}assets/default-product.png`;
    const cleanPath = imagePath.replace(/\\/g, '/').replace(/^wwwroot\//, '');
    return `https://localhost:7240/${cleanPath}`;
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = `${this.baseSignalRUrl}assets/default-product.png`;
  }

  nextImage() {
    if (this.product.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.product.images.length;
    }
  }

  previousImage() {
    if (this.product.images.length > 0) {
      this.currentImageIndex = this.currentImageIndex === 0 
        ? this.product.images.length - 1 
        : this.currentImageIndex - 1;
    }
  }

  goToImage(index: number) {
    this.currentImageIndex = index;
    this.stopAutoSlide();
    // Kullanıcı manuel olarak değiştirdiğinde otomatik kaydırmayı durdur ve tekrar başlat
    setTimeout(() => this.startAutoSlide(), 5000);
  }

  startAutoSlide() {
    this.stopAutoSlide();
    if (this.product.images.length > 1) {
      this.autoSlideInterval = setInterval(() => {
        this.nextImage();
        this.cdr.detectChanges();
      }, 4000); // 4 saniyede bir değiş
    }
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  // Quantity methods
  increaseQuantity() {
    if (this.quantity < this.product.stockQuantity) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  onQuantityChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value, 10);
    
    if (!isNaN(value) && value >= 1 && value <= this.product.stockQuantity) {
      this.quantity = value;
    } else {
      // Geçersiz değer girilirse eski değeri geri yükle
      target.value = this.quantity.toString();
    }
  }

  // Basket operations
  async addToBasket() {
    if (this.product.stockQuantity <= 0) {
      this.toastr.message("Bu ürün stokta bulunmamaktadır.", "Uyarı!", {
        messageType: ToastrMessageType.Warning,
        position: ToastrPosition.TopRight
      });
      return;
    }

    if (this.quantity > this.product.stockQuantity) {
      this.toastr.message("Stok miktarından fazla ürün ekleyemezsiniz.", "Uyarı!", {
        messageType: ToastrMessageType.Warning,
        position: ToastrPosition.TopRight
      });
      return;
    }

    try {
      this.spinner.show(SpinnerType.BallAtom);
      
      // Sepetteki mevcut ürünleri kontrol et
      const basketItems = await this.basketService.get();
      
      // List_Basket_Item'da productId property'si yoksa, name ile karşılaştırma yapabiliriz
      // Veya basketItemId ile product.id'yi eşleştiren bir yöntem kullanabiliriz
      // Şu an için basit bir çözüm: name ile karşılaştırma
      const existingItem = basketItems.find(item => item.name === this.product.name);
      
      if (existingItem) {
        // Ürün zaten sepette varsa quantity'i güncelle
        const updatedQuantity = existingItem.quantity + this.quantity;
        
        if (updatedQuantity > this.product.stockQuantity) {
          this.toastr.message("Sepetteki ürün miktarı ile birlikte stok limitini aşamazsınız.", "Uyarı!", {
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.TopRight
          });
          return;
        }
        
        await this.basketService.updateQuantity({
          basketItemId: existingItem.basketItemId,
          quantity: updatedQuantity
        });
        
        this.toastr.message(`${this.product.name} sepetteki miktarı güncellendi. Toplam: ${updatedQuantity} adet`, "Güncellendi!", {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.TopRight
        });
      } else {
        // Yeni ürün ekle
        let basketItem: Create_Basket_Item = new Create_Basket_Item();
        basketItem.productId = this.product.id;
        basketItem.quantity = this.quantity;
        
        await this.basketService.add(basketItem);
        
        this.toastr.message(`${this.product.name} (${this.quantity} adet) sepete eklendi.`, "Başarılı!", {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.TopRight
        });
      }
      
      // Miktarı 1'e sıfırla
      this.quantity = 1;
      
    } catch (error) {
     /* this.toastr.message("Ürün sepete eklenirken bir hata oluştu.", "Hata!", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      });*/
    } finally {
      this.spinner.hide(SpinnerType.BallAtom);
    }
  }

  // Navigation
  goBack() {
    window.history.back();
  }

  goToCategory() {
    this.router.navigate(['/categories', this.product.categoryId, 'products']);
  }

  goToProducts() {
    this.router.navigate(['/products']);
  }
}