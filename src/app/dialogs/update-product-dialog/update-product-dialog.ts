import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { NgForm } from '@angular/forms';
import { List_Product } from '../../contracts/list_product';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../services/common/models/product-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomToastr, ToastrMessageType, ToastrPosition } from '../../services/common/custom-toastr';
import { CategoryService } from '../../services/common/models/category-service';
import { List_Category } from '../../contracts/category/list_category';

@Component({
  selector: 'app-update-product-dialog',
  standalone: false,
  templateUrl: './update-product-dialog.html',
  styleUrl: './update-product-dialog.scss'
})
export class UpdateProductDialog extends BaseDialog<UpdateProductDialog> implements OnInit {

  product: List_Product | null = null;
  categories: List_Category[] = []; // Kategorileri tutacak dizi
  isLoading = true;

  constructor(
    dialogRef: MatDialogRef<UpdateProductDialog>,
    @Inject(MAT_DIALOG_DATA) public productId: string,
    private productService: ProductService,
    private categoryService: CategoryService, // CategoryService'i enjekte edin
    private spinner: NgxSpinnerService,
    private toastr: CustomToastr,
    private cdr: ChangeDetectorRef
  ) {
    super(dialogRef);
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      // Ürün detaylarını çek
      const fetchedProduct = await this.productService.getProductById(this.productId);
      
      // Kategorileri çek
      const allCategories = await this.categoryService.read(0, 100); // Tüm kategorileri çekiyoruz
      this.categories = allCategories.categories;

      if (fetchedProduct) {
        this.product = fetchedProduct;
        if (!this.product.id) {
          this.product.id = this.productId;
        }
      } else {
        this.toastr.message('Ürün bulunamadı.', 'Hata', {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight
        });
      }
    } catch (err) {
      this.toastr.message('Ürün veya kategori bilgileri alınırken hata oluştu.', 'Hata', {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      });
      console.error("Veri yüklenirken hata oluştu:", err);
    } finally {
      this.isLoading = false;
      this.spinner.hide();
      this.cdr.detectChanges(); // Veriler yüklendikten sonra değişikliği manuel tetikle
    }
  }

  updateProduct() {
    if (!this.product) return;

    console.log("Güncellenen ürün nesnesi:", this.product);
    console.log("Güncelleme için ürün ID:", this.product.id); 

    this.spinner.show();
    this.productService.updateProduct(this.product, () => {
      this.spinner.hide();
      this.toastr.message('Ürün başarıyla güncellendi.', 'Başarılı', {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight
      });
      this.dialogRef.close(true);
      this.cdr.detectChanges();
    }, (errorMessage) => {
      this.spinner.hide();
      this.toastr.message(errorMessage, 'Hata', {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      });
      this.cdr.detectChanges();
    });
  }

}
