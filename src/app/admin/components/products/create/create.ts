import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductService } from '../../../../services/common/models/product-service';
import { Create_Product } from '../../../../contracts/create_product';
import { Base, SpinnerType } from '../../../../base/base';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomToastr, ToastrMessageType, ToastrPosition } from '../../../../services/common/custom-toastr';
import { List_Category } from '../../../../contracts/category/list_category';
import { CategoryService } from '../../../../services/common/models/category-service';
@Component({
  selector: 'app-product-create',
  standalone: false,
  templateUrl: './create.html',
  styleUrl: './create.scss'
})
export class Create extends Base implements OnInit {
   @Output() productCreated = new EventEmitter<void>();

  categories: List_Category[] = [];

  constructor(private productService: ProductService,
              private categoryService: CategoryService,
              spinner: NgxSpinnerService,
              private customToastr: CustomToastr,
              private cdr: ChangeDetectorRef) {
    super(spinner);
  }

  async ngOnInit() {
    const result = await this.categoryService.read(0, 100);
    this.categories = result.categories;
    this.cdr.detectChanges();
  }

  create(txtName: any, txtDescription: any, txtPrice: any, 
       txtStockQuantity: any, ddlCategory: any, chkIsActive: any, chkIsFeatured: any) {
  
  const product: Create_Product = {
    name: txtName.value,
    description: txtDescription.value,
    price: parseFloat(txtPrice.value) || 0,
    stockQuantity: parseInt(txtStockQuantity.value) || 0,
    isActive: chkIsActive.checked,
    isFeatured: chkIsFeatured.checked,
    categoryId: ddlCategory.value
  };

  console.log('Gönderilen ürün:', product); // Debug için ekleyin

  this.productService.createProduct(product, 
    () => {
      this.customToastr.message(
        "Ürün başarıyla oluşturuldu!",
        "Başarılı!",
        {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.TopRight
        }
      );

      // Formu temizle
        txtName.value = '';
        txtDescription.value = '';
        txtPrice.value = '';
        txtStockQuantity.value = '';
        chkIsActive.checked = false;
        chkIsFeatured.checked = false;
        ddlCategory.value = '';

        // Parent component'e bilgi gönder
        this.productCreated.emit();


    },
    (error) => {
      console.error('Ürün oluşturma hatası:', error);
      this.customToastr.message(
        error,
        "Hata!",
        {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight
        }
      );
    }
  );
}
}
