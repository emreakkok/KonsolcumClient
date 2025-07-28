import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { NgxSpinnerService } from 'ngx-spinner';
import { List_Product } from '../../../../contracts/list_product';
import { Base, SpinnerType } from '../../../../base/base';
import { ProductService } from '../../../../services/common/models/product-service';
import { CustomToastr, ToastrMessageType, ToastrPosition } from '../../../../services/common/custom-toastr';
import { DialogService } from '../../../../services/common/dialog-service';
import { SelectProductImageDialog } from '../../../../dialogs/select-product-image-dialog/select-product-image-dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BasketService } from '../../../../services/common/models/basket-service';
import { Create_Basket_Item } from '../../../../contracts/basket/create-basket-item';

@Component({
  selector: 'app-ui-product-list',
  standalone: false,
  templateUrl: './list.html',
  styleUrl: './list.scss'
})
export class List extends Base implements OnInit {

   products: List_Product[] = [];
  totalProductCount: number = 0;
  pageSize: number = 12;
  pageList: number[] = [];
  currentPageNo: number = 1;
  totalPageCount: number = 0;

  constructor(
    private productService: ProductService, 
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private basketService: BasketService,
    spinner : NgxSpinnerService,
    private customToastr: CustomToastr,
    @Inject('baseSignalRUrl') private baseSignalRUrl: string 
  ) {
    super(spinner);
  }

  async ngOnInit() {
    this.pageSize = 12;

    this.activatedRoute.params.subscribe(async params => {
      const pageParam = params['pageNo'];
      this.currentPageNo = pageParam ? parseInt(pageParam) : 1;
      await this.loadProducts();
    });
  }

  async loadProducts() {
    this.showSpinner(SpinnerType.BallAtom);
    try {
      const result = await this.productService.getActiveProducts(
        this.currentPageNo - 1,
        this.pageSize,
        () => this.hideSpinner(SpinnerType.BallAtom),
        errorMessage => {
          this.customToastr.message(errorMessage, "Hata!", {
            messageType: ToastrMessageType.Error,
            position: ToastrPosition.TopRight
          });
          this.hideSpinner(SpinnerType.BallAtom);
        }
      );

      this.products = result.products;
      this.totalProductCount = result.totalProductCount;
      this.totalPageCount = Math.ceil(this.totalProductCount / this.pageSize);
      
      this.generatePageList();
      this.cdr.detectChanges();
    } catch (error) {
      this.customToastr.message("Ürünler yüklenirken beklenmeyen bir hata oluştu.", "Hata!", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      });
      this.hideSpinner(SpinnerType.BallAtom);
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
    
    this.router.navigate(['/products', page]);
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

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = `${this.baseSignalRUrl}assets/default-product.png`; 
  }

  async addToBasket(product: List_Product){
    if (product.stockQuantity <= 0) {
      this.customToastr.message("Bu ürün stokta bulunmamaktadır.", "Uyarı!", {
        messageType: ToastrMessageType.Warning,
        position: ToastrPosition.TopRight
      });
      return;
    }

    this.showSpinner(SpinnerType.BallAtom);
    let _basketItem: Create_Basket_Item = new Create_Basket_Item();
    _basketItem.productId = product.id;
    _basketItem.quantity = 1;
    
    try {
      await this.basketService.add(_basketItem);
      this.hideSpinner(SpinnerType.BallAtom);
      this.customToastr.message(`${product.name} sepete eklendi.`, "Başarılı!", {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight
      });
    } catch (error) {
      this.hideSpinner(SpinnerType.BallAtom);
      /* this.customToastr.message("Ürün sepete eklenirken bir hata oluştu.", "Hata!", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      });*/
    }
  }
}