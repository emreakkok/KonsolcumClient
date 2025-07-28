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
import { FormsModule } from '@angular/forms';
import { FileUploadDialog, FileUploadDialogState } from '../file-upload-dialog/file-upload-dialog';

@Component({
  selector: 'app-select-product-image-dialog',
  standalone: false,
  templateUrl: './select-product-image-dialog.html',
  styleUrl: './select-product-image-dialog.scss'
})

export class SelectProductImageDialog extends BaseDialog<SelectProductImageDialog> implements OnInit {
  images: FileContract[] = [];
  errorMessage: string | null = null;
  productId: string;
  options: Partial<FileUploadOptions>;
  selectedImageId: string = "";

  constructor(
    dialogRef: MatDialogRef<SelectProductImageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { productId: string },
    private httpClientService: HttpClientService,
    private toastr: CustomToastr,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
  ) {
    super(dialogRef);
    this.productId = data.productId;
  }

  ngOnInit(): void {
    if (this.productId && this.productId !== 'undefined' && this.productId !== null) {
      this.options = {
        accept: ".png, .jpeg, .jpg, .gif",
        action: "UploadImages",
        controller: "Products",
        explanation: "Ürün resmini seçin",
        queryString: `id=${this.productId}`
      };
      
      // Change detection tamamlandıktan sonra çalıştır
      setTimeout(() => {
        this.getImagesByProductId(this.productId);
      });
    } else {
      this.errorMessage = 'Product ID is missing or invalid. Cannot load images or upload files.';
      this.spinner.hide(SpinnerType.BallAtom);
      this.toastr.message(
        this.errorMessage,
        "Hata!",
        { messageType: ToastrMessageType.Error, position: ToastrPosition.TopRight }
      );
      console.error('Product ID is undefined or null in SelectProductImageDialog ngOnInit:', this.productId);
    }
  }

  // Resim URL'sini oluşturma metodu
  getImageUrl(imagePath: string): string {
    
    const cleanPath = imagePath.replace(/\\/g, '/').replace(/^wwwroot\//, '');
    return `https://localhost:7240/${cleanPath}`;
  }

  // Ürün ID'sine göre resimleri getirme
  getImagesByProductId(productId: string): void {
    this.errorMessage = null;
    this.spinner.show(SpinnerType.BallAtom);

    const requestParameters: Partial<RequestParameters> = {
      controller: 'products',
      action: `${productId}/images`
    };

    this.httpClientService.get<FileContract[]>(requestParameters).subscribe({
      next: (images) => {
        // Önce images array'ini güncelle
        this.images = images || [];
        
        // Seçili olan showcase ID'sini güncelle
        const showcaseImage = this.images.find(img => img.showcase);
        this.selectedImageId = showcaseImage?.id ?? '';

        this.spinner.hide(SpinnerType.BallAtom);
        
        // Change detection'ı manuel tetikle
        this.cdr.detectChanges();
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
        console.error('Error loading product images:', err);
      }
    });
  }

  // Dosya yükleme başarılı olduğunda çalışacak
  onFileUploadSuccess() {
  this.getImagesByProductId(this.productId); // veya productId
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
      controller: 'products',
      action: 'delete-image'
    };

    this.httpClientService.delete<any>(requestParameters, imageId).subscribe({
      next: () => {
        this.getImagesByProductId(this.productId);
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

  // Showcase belirleme işlemi - yeniden load yapmadan
  showCase(imageId: string): void {
    const selectedImage = this.images.find(img => img.id === imageId);
    if (!selectedImage) return;

    this.spinner.show(SpinnerType.BallAtom);

    this.httpClientService.get({
      controller: 'products',
      action: 'ChangeShowcaseFile',
      queryString: `imageId=${imageId}&productId=${this.productId}`
    },).subscribe({
      next: () => {
        // Başarılı işlem sonrası sadece local state'i güncelle
        this.images.forEach(img => img.showcase = false);
        const targetImage = this.images.find(img => img.id === imageId);
        if (targetImage) {
          targetImage.showcase = true;
        }
        
        this.selectedImageId = imageId;
        
        this.toastr.message("Ürün vitrin resmi başarıyla değiştirildi.", "Başarılı", {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.TopRight
        });
        
        this.spinner.hide(SpinnerType.BallAtom);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toastr.message("Ürün vitrin resmi değiştirilirken bir hata oluştu.", "Hata!", {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight
        });
        this.spinner.hide(SpinnerType.BallAtom);
        console.error('Showcase change error:', err);
      }
    });
  }
}

export enum SelectProductImageState {
  Close
}