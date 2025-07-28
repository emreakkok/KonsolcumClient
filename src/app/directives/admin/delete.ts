import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { Base, SpinnerType } from '../../base/base';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialog, DeleteState } from '../../dialogs/delete-dialog/delete-dialog';
import { HttpClientService } from '../../services/common/http-client-service';
import { CustomToastr, ToastrMessageType, ToastrPosition } from '../../services/common/custom-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService } from '../../services/common/dialog-service';

declare var $: any;

@Directive({
  selector: '[appDelete]',
  standalone: false
})
export class DeleteDirective extends Base {
  
  @Input() id: string;
  @Input() controller: string;
  @Output() callback: EventEmitter<any> = new EventEmitter();

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private httpClientService: HttpClientService,
    spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private customToastr: CustomToastr,
    private dialogService: DialogService
  ) {
    super(spinner);
    this.createElement();
  }

  private createElement(): void {
    // Mevcut içeriği temizle
    this.element.nativeElement.innerHTML = '';
    
    // Mat-icon elementini oluştur
    const matIcon = this.renderer.createElement('mat-icon');
    
    // Material Icons class'ını ekle
    this.renderer.addClass(matIcon, 'material-icons');
    
    // Icon text'ini oluştur
    const text = this.renderer.createText('delete_forever');
    
    // Stil ekle
    this.renderer.setStyle(matIcon, 'cursor', 'pointer');
    this.renderer.setStyle(matIcon, 'color', 'deeppink');
    this.renderer.setStyle(matIcon, 'font-size', '24px');
    this.renderer.setStyle(matIcon, 'user-select', 'none');
    this.renderer.setStyle(matIcon, 'vertical-align', 'middle');
    
    // Hover efekti için
    this.renderer.listen(matIcon, 'mouseenter', () => {
      this.renderer.setStyle(matIcon, 'color', 'red');
      this.renderer.setStyle(matIcon, 'transform', 'scale(1.1)');
    });
    
    this.renderer.listen(matIcon, 'mouseleave', () => {
      this.renderer.setStyle(matIcon, 'color', 'deeppink');
      this.renderer.setStyle(matIcon, 'transform', 'scale(1)');
    });
    
    // Text'i mat-icon'a ekle
    this.renderer.appendChild(matIcon, text);
    
    // Mat-icon'u element'e ekle
    this.renderer.appendChild(this.element.nativeElement, matIcon);
  }

  @HostListener('click')
  async onclick() {
    this.dialogService.openDialog({
      componentType: DeleteDialog,
      data: DeleteState.Yes,
      afterClosed: async (result) => {
        if (result === DeleteState.Yes) {
          this.showSpinner(SpinnerType.BallAtom);
          
          this.httpClientService.delete({
            controller: this.controller
          }, this.id).subscribe({
            next: (data) => {
              const td: HTMLElement = this.element.nativeElement;
              $(td.parentElement).animate({
                opacity: 0,
                left: "+=50",
                height: "toggle"
              }, 700, () => {
                this.hideSpinner(SpinnerType.BallAtom);
                this.callback.emit();
                this.customToastr.message(
                  "Başarıyla silinmiştir",
                  "Başarılı",
                  {
                    messageType: ToastrMessageType.Success,
                    position: ToastrPosition.TopRight
                  }
                );
              });
            },
            error: (httpErrorResponse: HttpErrorResponse) => {
              this.hideSpinner(SpinnerType.BallAtom);
              this.customToastr.message(
                "Silme işlemi sırasında bir hata oldu",
                "Başarısız",
                {
                  messageType: ToastrMessageType.Error,
                  position: ToastrPosition.TopRight
                }
              );
            }
          });
        }
      }
    });
  }
}