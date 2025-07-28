import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../../../base/base';
import { CustomToastr, ToastrMessageType, ToastrPosition } from '../../../../services/common/custom-toastr';
import { List_Product } from '../../../../contracts/list_product';
import { CategoryService } from '../../../../services/common/models/category-service';
import { BasketService } from '../../../../services/common/models/basket-service';

@Component({
  selector: 'app-ui-category-products',
  standalone: false,
  templateUrl: './category-products.html',
  styleUrl: './category-products.scss'
})
export class CategoryProducts implements OnInit {

  products: List_Product[] = [];
  categoryName: string = '';
  categoryId: string = '';
  totalProductCount: number = 0;
  pageSize: number = 12;
  pageList: number[] = [];
  currentPageNo: number = 1;
  totalPageCount: number = 0;
  isLoading: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private basketService: BasketService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private toastr: CustomToastr,
    @Inject('baseSignalRUrl') private baseSignalRUrl: string // baseSignalRUrl enjekte edildi
  ) {}

  async ngOnInit() {
    this.pageSize = 12;

    this.activatedRoute.params.subscribe(async params => {
      this.categoryId = params['categoryId'];
      const pageParam = params['pageNo'];
      this.currentPageNo = pageParam ? parseInt(pageParam) : 1;
      
      if (this.categoryId) {
        await this.loadCategoryProducts();
      }
    });
  }

  async loadCategoryProducts() {
    this.isLoading = true;
    this.spinner.show(SpinnerType.BallAtom);

    try {
      const result = await this.categoryService.getProductsByCategory(
        this.categoryId,
        this.currentPageNo - 1,
        this.pageSize,
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
        this.products = result.products;
        this.categoryName = result.categoryName;
        this.totalProductCount = result.totalProductCount;
        this.totalPageCount = Math.ceil(this.totalProductCount / this.pageSize);
        this.generatePageList();
      } else {
        this.products = [];
        this.totalProductCount = 0;
        this.totalPageCount = 0;
        this.toastr.message(result.message || "Ürünler yüklenirken bir hata oluştu.", "Hata!", {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight
        });
      }

      this.cdr.detectChanges();
    } catch (error) {
      this.products = [];
      this.totalProductCount = 0;
      this.totalPageCount = 0;
      this.toastr.message("Ürünler yüklenirken beklenmeyen bir hata oluştu.", "Hata!", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      });
    } finally {
      this.spinner.hide(SpinnerType.BallAtom);
      this.isLoading = false;
    }
  }

  generatePageList() {
    this.pageList = [];
    const maxPages = 7;
    
    if (this.totalPageCount <= maxPages) {
      for (let i = 1; i <= this.totalPageCount; i++) {
        this.pageList.push(i);
      }
    } else {
      const startPage = Math.max(1, this.currentPageNo - 3);
      const endPage = Math.min(this.totalPageCount, this.currentPageNo + 3);
      
      for (let i = startPage; i <= endPage; i++) {
        this.pageList.push(i);
      }
    }
  }

  async changePage(page: number) {
    if (page < 1 || page > this.totalPageCount) return;
    this.router.navigate(['/categories', this.categoryId, 'products', page]);
  }

  async goToPreviousPage() {
    if (this.currentPageNo > 1) {
      await this.changePage(this.currentPageNo - 1);
    }
  }

  async goToNextPage() {
    if (this.currentPageNo < this.totalPageCount) {
      await this.changePage(this.currentPageNo + 1);
    }
  }

  goBackToCategories() {
    this.router.navigate(['/categories']);
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    // API'den çekilecek varsayılan resim yolu güncellendi
    img.src = `${this.baseSignalRUrl}assets/default-product.png`; 
  }

  async addToBasket(product: List_Product) {
    if (product.stockQuantity <= 0) {
      this.toastr.message("Bu ürün stokta bulunmamaktadır.", "Uyarı!", {
        messageType: ToastrMessageType.Warning,
        position: ToastrPosition.TopRight
      });
      return;
    }

    try {
      await this.basketService.add({
        productId: product.id,
        quantity: 1
      });

      this.toastr.message(`${product.name} sepete eklendi.`, "Başarılı!", {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight
      });
    } catch (error) {
      /* this.toastr.message("Ürün sepete eklenirken bir hata oluştu.", "Hata!", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      }); */
    }
  }

  /**
   * TrackBy fonksiyonu - performans için
   */
  trackByProductId(index: number, product: List_Product): string {
    return product.id;
  }
}