import { Component } from '@angular/core';
import { Base, SpinnerType } from '../../../base/base';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from '../../../services/common/models/user-service';
import { CustomToastr, ToastrMessageType, ToastrPosition } from '../../../services/common/custom-toastr';

@Component({
  selector: 'app-password-reset',
  standalone: false,
  templateUrl: './password-reset.html',
  styleUrl: './password-reset.scss'
})
export class PasswordReset extends Base{

  constructor(spinner: NgxSpinnerService,private userService: UserService,private customToastr: CustomToastr){
    super(spinner);
  }

  passwordReset(email: string){
    this.showSpinner(SpinnerType.BallAtom);
    this.userService.passwordReset(email,()=>{
      
      this.customToastr.message("Şifre güncelleme maili gönderildi.","Şifre Güncelleme",{
        messageType: ToastrMessageType.Info,
        position : ToastrPosition.TopRight
      })
      this.hideSpinner(SpinnerType.BallAtom)
    });
  }


}
