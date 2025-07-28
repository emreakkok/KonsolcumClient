import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../../../base/base';
import { CustomToastr, ToastrMessageType, ToastrPosition } from '../../../../services/common/custom-toastr';
import { List_Category } from '../../../../contracts/category/list_category';
import { CategoryService } from '../../../../services/common/models/category-service';

@Component({
  selector: 'app-ui-category-list',
  standalone: false,
  templateUrl: './list.html',
  styleUrl: './list.scss'
})
export class List implements OnInit {

  categories: List_Category[] = [];
  totalCategoryCount: number = 0;
  pageSize: number = 12;
  pageList: number[] = [];
  currentPageNo: number = 1;
  totalPageCount: number = 0;

  constructor(
    private categoryService: CategoryService,
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
      const pageParam = params['pageNo'];
      this.currentPageNo = pageParam ? parseInt(pageParam) : 1;
      await this.loadCategories();
    });
  }

  async loadCategories() {
    this.spinner.show(SpinnerType.BallAtom);

    try {
      const result = await this.categoryService.getActiveCategories(
        this.currentPageNo - 1,
        this.pageSize,
        () => {
          this.spinner.hide(SpinnerType.BallAtom);
        },
        errorMessage => {
          this.toastr.message(errorMessage, "Hata!", {
            messageType: ToastrMessageType.Error,
            position: ToastrPosition.TopRight
          });
          this.spinner.hide(SpinnerType.BallAtom);
        }
      );

      this.categories = result.categories;
      this.totalCategoryCount = result.totalCategoryCount;
      this.totalPageCount = Math.ceil(this.totalCategoryCount / this.pageSize);
      this.generatePageList();
      this.cdr.detectChanges();
    } catch (error) {
      this.toastr.message("Kategoriler yüklenirken beklenmeyen bir hata oluştu.", "Hata!", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      });
      this.spinner.hide(SpinnerType.BallAtom);
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
    this.router.navigate(['/categories', page]);
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
    // API'den çekilecek varsayılan resim yolu güncellendi
    img.src = `${this.baseSignalRUrl}assets/default-category.png`;
  }

  /**
   * Kategori ürünlerini görüntülemek için sayfa yönlendirmesi yapar
   * @param categoryId Kategori ID'si
   * @param categoryName Kategori adı (opsiyonel, log için)
   */
  viewCategoryProducts(categoryId: string, categoryName?: string) {
    console.log(`${categoryName || 'Kategori'} ürünleri görüntüleniyor...`);
    this.router.navigate(['/categories', categoryId, 'products']);
  }

  /**
   * TrackBy fonksiyonu - performans için
   */
  trackByCategoryId(index: number, category: List_Category): string {
    return category.id;
  }
}
