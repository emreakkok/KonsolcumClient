import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../services/common/models/category-service';
import { CustomToastr, ToastrMessageType, ToastrPosition } from '../../services/common/custom-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { List_Category } from '../../contracts/category/list_category';

@Component({
  selector: 'app-update-category-dialog',
  standalone: false,
  templateUrl: './update-category-dialog.html',
  styleUrl: './update-category-dialog.scss'
})
export class UpdateCategoryDialog extends BaseDialog<UpdateCategoryDialog> {

  category: List_Category | null = null;
  isLoading = true; // Başlangıçta true olduğundan emin olun

  constructor(
    dialogRef: MatDialogRef<UpdateCategoryDialog>,
    @Inject(MAT_DIALOG_DATA) public categoryId: string,
    private categoryService: CategoryService,
    private spinner: NgxSpinnerService,
    private toastr: CustomToastr,
    private cdr: ChangeDetectorRef // *** ChangeDetectorRef'i enjekte ettik ***
  ) {
    super(dialogRef);
  }

  async ngOnInit() {
    this.spinner.show();
    try {
      // getCategoryById metodunu kullanıyoruz
      const fetchedCategory = await this.categoryService.getCategoryById(this.categoryId);
      
      if (fetchedCategory) {
        this.category = fetchedCategory;
        // *** EKLEME BAŞLANGICI ***
        // Eğer fetchedCategory'nin ID'si boşsa (örneğin backend dönüşünde eksikse),
        // diyaloga enjekte edilen categoryId'yi kullanarak ID'yi güvence altına alıyoruz.
        if (!this.category.id) {
          this.category.id = this.categoryId;
        }
        // *** EKLEME SONU ***
      } else {
        this.toastr.message('Kategori bulunamadı.', 'Hata', {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight
        });
      }
    } catch (err) {
      this.toastr.message('Kategori bilgileri alınırken hata oluştu.', 'Hata', {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      });
      console.error("Kategori yüklenirken hata oluştu:", err); // Hata detayını konsola yazdır
    } finally {
      this.isLoading = false;
      this.spinner.hide();
      this.cdr.detectChanges(); // *** Değişiklikleri manuel olarak tetikle ***
    }
  }

  updateCategory() {
    if (!this.category) return;

    // *** Hata ayıklama için konsol logları ***
    console.log("Güncellenen kategori nesnesi:", this.category);
    console.log("Güncelleme için kategori ID:", this.category.id); 

    this.spinner.show();
    this.categoryService.updateCategory(this.category, () => {
      this.spinner.hide();
      this.toastr.message('Kategori başarıyla güncellendi.', 'Başarılı', {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight
      });
      this.dialogRef.close(true);
      this.cdr.detectChanges(); // *** Güncelleme sonrası da tetikle ***
    }, (errorMessage) => {
      this.spinner.hide();
      this.toastr.message(errorMessage, 'Hata', {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      });
      this.cdr.detectChanges(); // *** Hata durumunda da tetikle ***
    });
  }

}