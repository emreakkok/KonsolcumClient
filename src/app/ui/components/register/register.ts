import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { User } from '../../../entities/user';
import { UserService } from '../../../services/common/models/user-service';
import { Create_User } from '../../../contracts/users/create_user';
import { CustomToastr, ToastrMessageType, ToastrPosition } from '../../../services/common/custom-toastr';
import { Base } from '../../../base/base';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register extends Base implements OnInit {


  constructor( private formBuilder: FormBuilder, private userService: UserService, private customToastr: CustomToastr,private router: Router,spinner: NgxSpinnerService) {
    super(spinner);
  }

  frm: FormGroup;
  submitted: boolean = false;
  
  ngOnInit(): void {
    this.frm = this.formBuilder.group({
      nameSurname : ["", [Validators.required,Validators.maxLength(50), Validators.minLength(2)]],
      username : ["",[Validators.required,Validators.maxLength(50), Validators.minLength(2)]],
      email : ["",[Validators.required,Validators.maxLength(150), Validators.email]],
      password : ["",[Validators.required]],
      passwordConfirm : ["",[Validators.required]]
    },
    {validators: (group: AbstractControl) : ValidationErrors | null => {

      let sifre = group.get("password")?.value;
      let sifreTekrar = group.get("passwordConfirm")?.value

      return sifre === sifreTekrar ? null : {notSame : true};
    }}
  
  
  )
  }


  
  get component() {
    return this.frm.controls;
  }

  async onSubmit(user : User){
    this.submitted = true;

    if(this.frm.invalid)
      return;

    const result: Create_User =await this.userService.create(user);
    if(result.succeded){
      this.customToastr.message(result.message,"Kullanıcı Kaydı Başarılı", {
      messageType:ToastrMessageType.Success,
      position:ToastrPosition.TopRight

      
    });
    // Başarılı kayıt sonrası login sayfasına yönlendir
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000); // 2 saniye bekle ki kullanıcı başarı mesajını görebilsin

    }
    else{
      this.customToastr.message(result.message, "Kullanıcı Kaydı Hata",{
      messageType:ToastrMessageType.Error,
      position:ToastrPosition.TopRight
    })
  }

  }

}
