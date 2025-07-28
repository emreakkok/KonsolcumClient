import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CategoryService } from '../../../../services/common/models/category-service';
import { Create_Category } from '../../../../contracts/category/create_category';
import { Base, SpinnerType } from '../../../../base/base';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomToastr, ToastrMessageType, ToastrPosition } from '../../../../services/common/custom-toastr';
import { error } from 'console';
import { FileUploadOptions } from '../../../../services/common/file-upload/file-upload';

@Component({
  selector: 'app-category-create',
  standalone: false,
  templateUrl: './create.html',
  styleUrl: './create.scss'
})
export class Create extends Base implements OnInit {
  @Output() categoryCreated = new EventEmitter<void>();

  constructor(private categoryService: CategoryService, spinner: NgxSpinnerService ,private customToastr: CustomToastr) { 
    super(spinner);
  }

  ngOnInit(): void {

  }
 /*
  @Output() fileUploadOptions: Partial<FileUploadOptions> = {
    action:"upload",
    controller: "categories",
    explanation: "Resimleri sürükleyin veya seçin...",
    accept: " .png, .jpg, .jpeg"
  };
*/
  createCategory(
    txtName: HTMLInputElement,
    txtDescription: HTMLTextAreaElement,
    chkIsActive: any
  ): void {

    //spinner-başlangıç
        this.showSpinner(SpinnerType.BallAtom);
        //spinner-son

    const newCategory: Create_Category = new Create_Category();

    newCategory.name = txtName.value;
    newCategory.description = txtDescription.value;
    newCategory.isActive = chkIsActive.checked;
    

    console.log('Oluşturulacak Kategori Objemi (Create_Category tipinde):', newCategory);

    this.categoryService.createCategory(newCategory, () => { // Success callback
        this.hideSpinner(SpinnerType.BallAtom);
        this.customToastr.message(
          "Kategori başarıyla oluşturuldu!",
          "Başarılı!",
          {
            messageType: ToastrMessageType.Success,
            position: ToastrPosition.TopRight
          }
        );
        // Formu temizle (isteğe bağlı)
        txtName.value = '';
        txtDescription.value = '';
        chkIsActive.checked = false;

        this.categoryCreated.emit();
      },
      errorMessage =>{
      this.customToastr.message(
        errorMessage,
        "Hata!",
        {
          messageType: ToastrMessageType.Error,
          position:ToastrPosition.TopRight
        }
      )
      this.hideSpinner(SpinnerType.BallAtom);
    } );
  }
}
