import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { HttpClientService } from '../http-client-service';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { CustomToastr, ToastrMessageType, ToastrPosition } from '../custom-toastr';
import { MatDialog } from '@angular/material/dialog';
import { FileUploadDialog, FileUploadDialogState } from '../../../dialogs/file-upload-dialog/file-upload-dialog';
import { DialogService } from '../dialog-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../../base/base';

@Component({
  selector: 'app-file-upload',
  standalone: false,
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.scss'
})
export class FileUpload 
{

  constructor(private httpClientService: HttpClientService,private customToastr: CustomToastr, private dialog: MatDialog,private dialogService:DialogService,private spinner: NgxSpinnerService){

  }

  public files: NgxFileDropEntry[];
  @Input() options : Partial<FileUploadOptions>;
  @Output() uploadSuccess: EventEmitter<void> = new EventEmitter<void>();

  public selectedFiles(files: NgxFileDropEntry[]) {
  this.files = files;
  
  this.dialogService.openDialog({
    componentType: FileUploadDialog,
    data: FileUploadDialogState.Yes,
    afterClosed: (result) => {
      // SADECE Yes döndüğünde upload et
      if (result === FileUploadDialogState.Yes) {
        this.processFilesAndUpload(files);
      }
      // İptal edilirse (result === undefined veya FileUploadDialogState.No) 
      // hiçbir şey yapma - upload etme!
    }
  });
}

private processFilesAndUpload(files: NgxFileDropEntry[]) {
  const fileData: FormData = new FormData();
  let processedFiles = 0;
  const totalFiles = files.length;

  if (totalFiles === 0) {
    this.customToastr.message(
      "Yüklenecek dosya bulunamadı",
      "Hata",
      {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      }
    );
    return;
  }

  files.forEach((file, index) => {
    if (file.fileEntry.isFile) {
      const fileEntry = file.fileEntry as FileSystemFileEntry;
      fileEntry.file((_file: File) => {
        // Dosya adını key olarak kullanın, backend'de IFormFileCollection bu şekilde bekler
        fileData.append('files', _file, _file.name);
        processedFiles++;
        
        // Tüm dosyalar işlendiğinde upload et
        if (processedFiles === totalFiles) {
          this.uploadFiles(fileData);
        }
      });
    }
  });
}

private uploadFiles(fileData: FormData) {
  this.spinner.show(SpinnerType.BallAtom);
  
  this.httpClientService.post(
    {
      controller: this.options.controller,
      action: this.options.action,
      queryString: this.options.queryString,
      headers: new HttpHeaders({"responseType": "blob"})
    },
    fileData
  ).subscribe({
    next: (data) => {
      this.spinner.hide(SpinnerType.BallAtom);
      // Bu satırı kaldırın - sadece emit yapın
      // this.customToastr.message(...);
      this.uploadSuccess.emit();
    },
    error: (errorResponse: HttpErrorResponse) => {
      this.spinner.hide(SpinnerType.BallAtom);
      this.customToastr.message(
        "Dosyalar yüklenirken beklenmeyen bir hatayla karşılaşılmıştır",
        "Başarısız",
        {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight
        }
      );
      console.error("File upload error:", errorResponse);
    }
  });
}

}

export class FileUploadOptions {
  controller?: string;
  action?: string;
  queryString?: string;
  explanation?: string;
  accept?: string;
}