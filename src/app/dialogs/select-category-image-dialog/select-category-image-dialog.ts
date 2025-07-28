import { ChangeDetectorRef, Component, Inject, OnInit, Output } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileUploadOptions } from '../../services/common/file-upload/file-upload';
import { HttpClientService, RequestParameters } from '../../services/common/http-client-service';
import { CustomToastr, ToastrMessageType, ToastrPosition } from '../../services/common/custom-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../base/base';
import { FileContract } from '../../contracts/file-contract';
import { DialogService } from '../../services/common/dialog-service';
import { DeleteDialog, DeleteState } from '../delete-dialog/delete-dialog';
import { FileUploadDialog, FileUploadDialogState } from '../file-upload-dialog/file-upload-dialog';

@Component({
  selector: 'app-select-category-image-dialog',
  standalone: false,
  templateUrl: './select-category-image-dialog.html',
  styleUrl: './select-category-image-dialog.scss'
})

export class SelectCategoryImageDialog extends BaseDialog<SelectCategoryImageDialog> implements OnInit {
  images: FileContract[] = [];
  errorMessage: string | null = null;
  categoryId: string;
  options: Partial<FileUploadOptions>;
  selectedImageId: string = "";

  constructor(
    dialogRef: MatDialogRef<SelectCategoryImageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { categoryId: string },
    private httpClientService: HttpClientService,
    private toastr: CustomToastr,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService
  ) {
    super(dialogRef);
    this.categoryId = data.categoryId;
  }

  ngOnInit(): void {
    if (this.categoryId && this.categoryId !== 'undefined' && this.categoryId !== null) {
      this.options = {
        accept: ".png, .jpeg, .jpg, .gif",
        action: "UploadImages",
        controller: "Categories",
        explanation: "Kategori resmini seçin",
        queryString: `id=${this.categoryId}`
      };
      setTimeout(() => {
        this.getImagesByCategoryId(this.categoryId);
      });
    } else {
      this.errorMessage = 'Category ID is missing or invalid. Cannot load images or upload files.';
      this.spinner.hide(SpinnerType.BallAtom);
      this.toastr.message(
        this.errorMessage,
        "Hata!",
        { messageType: ToastrMessageType.Error, position: ToastrPosition.TopRight }
      );
      console.error('Category ID is undefined or null in SelectCategoryImageDialog ngOnInit:', this.categoryId);
    }
  }

  // Resim URL'sini oluşturma metodu
  getImageUrl(imagePath: string): string {
    
    const cleanPath = imagePath.replace(/\\/g, '/').replace(/^wwwroot\//, '');
    return `https://localhost:7240/${cleanPath}`;
  }

  // Kategori ID'sine göre resimleri getirme
  getImagesByCategoryId(categoryId: string): void {
    this.errorMessage = null;
    this.spinner.show(SpinnerType.BallAtom);

    const requestParameters: Partial<RequestParameters> = {
      controller: 'categories',
      action: `${categoryId}/images`
    };

    this.httpClientService.get<FileContract[]>(requestParameters).subscribe({
      next: (images) => {
        this.images = images || [];
        
        // Seçili olan showcase ID'sini güncelle
        const showcaseImage = this.images.find(img => img.showcase);
        this.selectedImageId = showcaseImage?.id ?? '';

        this.spinner.hide(SpinnerType.BallAtom);
        this.cdr.detectChanges(); // Change detection'ı manuel tetikle
      },
      error: (err) => {
        this.errorMessage = 'Failed to load images. Please try again later.';
        this.images = []; // Hata durumunda array'i temizle
        this.spinner.hide(SpinnerType.BallAtom);
        this.cdr.detectChanges();
        this.toastr.message(
          this.errorMessage,
          "Hata!",
          { messageType: ToastrMessageType.Error, position: ToastrPosition.TopRight }
        );
        console.error('Error loading category images:', err);
      }
    });
  }

  // Dosya yükleme başarılı olduğunda çalışacak
  onFileUploadSuccess() {
  this.getImagesByCategoryId(this.categoryId); // veya productId
  this.toastr.message("Resimler başarıyla yüklendi.", "Başarılı", {
    messageType: ToastrMessageType.Success,
    position: ToastrPosition.TopRight
  });
}

  // Resim silme metodu - Dialog ile onay alma
  deleteImage(imageId: string): void {
    this.dialogService.openDialog({
      componentType: DeleteDialog,
      data: DeleteState.Yes,
      afterClosed: (result) => {
        if (result === DeleteState.Yes) {
          this.performDeleteImage(imageId);
        }
      }
    });
  }

  // Gerçek silme işlemi
  private performDeleteImage(imageId: string): void {
    console.log(`Deleting image with ID: ${imageId}`);
    this.spinner.show(SpinnerType.BallAtom);

    const requestParameters: Partial<RequestParameters> = {
      controller: 'categories',
      action: 'delete-image'
    };

    this.httpClientService.delete<any>(requestParameters, imageId).subscribe({
      next: () => {
        this.getImagesByCategoryId(this.categoryId);
        this.toastr.message("Resim başarıyla silindi.", "Başarılı", { 
          messageType: ToastrMessageType.Success, 
          position: ToastrPosition.TopRight 
        });
        this.spinner.hide(SpinnerType.BallAtom);
      },
      error: (err) => {
        this.errorMessage = 'Failed to delete image: ' + (err.error?.message || err.message);
        this.toastr.message(this.errorMessage, "Hata!", { 
          messageType: ToastrMessageType.Error, 
          position: ToastrPosition.TopRight 
        });
        this.spinner.hide(SpinnerType.BallAtom);
        console.error('Delete image error:', err);
      }
    });
  }

  // TrackBy function for ngFor performance
  trackByImageId(index: number, image: FileContract): string {
    return image.id;
  }

showCase(imageId: string): void {
    const selectedImage = this.images.find(img => img.id === imageId);
    if (!selectedImage) return;

    this.spinner.show(SpinnerType.BallAtom);

    this.httpClientService.get({
      controller: 'categories', // Kategori controller'ı
      action: 'ChangeShowcaseFile', // Bu endpoint'in backend'de tanımlı olduğundan emin olun
      queryString: `imageId=${imageId}&categoryId=${this.categoryId}` // categoryId'yi gönderiyoruz
    },).subscribe({
      next: () => {
        // Başarılı işlem sonrası sadece local state'i güncelle
        this.images.forEach(img => img.showcase = false);
        const targetImage = this.images.find(img => img.id === imageId);
        if (targetImage) {
          targetImage.showcase = true;
        }

        this.selectedImageId = imageId; // Seçili vitrin resmi ID'sini güncelle

        this.toastr.message("Kategori vitrin resmi başarıyla değiştirildi.", "Başarılı", {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.TopRight
        });

        this.spinner.hide(SpinnerType.BallAtom);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toastr.message("Kategori vitrin resmi değiştirilirken bir hata oluştu.", "Hata!", {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight
        });
        this.spinner.hide(SpinnerType.BallAtom);
        console.error('Showcase change error:', err);
      }
    });
  }
}

export enum SelectCategoryImageState {
  Close
}