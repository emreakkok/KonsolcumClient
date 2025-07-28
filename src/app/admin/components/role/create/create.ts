import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Base } from '../../../../base/base';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomToastr, ToastrMessageType, ToastrPosition } from '../../../../services/common/custom-toastr';
import { RoleService } from '../../../../services/common/models/role-service';

@Component({
  selector: 'app-role-create',
  standalone: false,
  templateUrl: './create.html',
  styleUrl: './create.scss'
})
export class Create extends Base implements OnInit {
  @Output() createdRole = new EventEmitter<string>();

  constructor(
    spinner: NgxSpinnerService,
    private roleService: RoleService,
    private customToastr: CustomToastr,
    private cdr: ChangeDetectorRef) {
    super(spinner);
  }

  async ngOnInit() {
    this.cdr.detectChanges();
  }

  async create(name: any) {
    if (!name.value || name.value.trim() === '') {
      this.customToastr.message(
        "Rol adı boş olamaz!",
        "Hata!",
        {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight
        }
      );
      return;
    }

    try {
      const result = await this.roleService.create(name.value);
      
      if (result.succeeded) {
        this.customToastr.message(
          "Rol başarıyla oluşturuldu!",
          "Başarılı!",
          {
            messageType: ToastrMessageType.Success,
            position: ToastrPosition.TopRight
          }
        );
        
        this.createdRole.emit(name.value);
        name.value = ''; // Input'u temizle
      }
    } catch (error: any) {
      console.error('Rol oluşturma hatası:', error);
      this.customToastr.message(
        error?.message || 'Bir hata oluştu',
        "Hata!",
        {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight
        }
      );
    }
  }
}