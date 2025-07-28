import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Base, SpinnerType } from '../../../base/base';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from '../../../services/common/models/user-service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomToastr, ToastrMessageType, ToastrPosition } from '../../../services/common/custom-toastr';

@Component({
  selector: 'app-update-password',
  standalone: false,
  templateUrl: './update-password.html',
  styleUrl: './update-password.scss'
})
export class UpdatePassword extends Base implements OnInit{

  constructor(
    spinner: NgxSpinnerService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private customToastr: CustomToastr,
    private router: Router,
    private cdr: ChangeDetectorRef // ChangeDetectorRef eklendi
  ) {
    super(spinner)
  }

  state: boolean = false;
  isLoading: boolean = true;
  errorMessage: string = '';

  ngOnInit(): void {
    console.log('UpdatePassword component initialized');
    this.showSpinner(SpinnerType.BallAtom);

    this.activatedRoute.params.subscribe({
      next: async params => {
        try {
          const userId: string = params["userId"];
          const resetToken: string = params["resetToken"];

          console.log("userId:", userId);
          console.log("resetToken:", resetToken);
          console.log("resetToken length:", resetToken?.length);

          if (!userId || !resetToken) {
            console.error("userId veya resetToken boş!");
            this.errorMessage = "Geçersiz sıfırlama linki!";
            this.isLoading = false;
            this.hideSpinner(SpinnerType.BallAtom);
            this.cdr.detectChanges(); // Manuel change detection
            return;
          }

          console.log("Token doğrulama başlıyor...");
          this.state = await this.userService.verifyResetToken(resetToken, userId, () => {
            console.log("Token doğrulama tamamlandı");
            this.hideSpinner(SpinnerType.BallAtom);
            this.isLoading = false;
            // Async callback içinde change detection'ı tetikle
            setTimeout(() => {
              this.cdr.detectChanges();
            }, 0);
          });

          console.log("Token durumu:", this.state);
          
          // State değişikliğinden sonra change detection'ı tetikle
          this.isLoading = false;
          this.hideSpinner(SpinnerType.BallAtom);
          this.cdr.detectChanges();

        } catch (error) {
          console.error("Token doğrulama hatası:", error);
          this.errorMessage = "Token doğrulama sırasında hata oluştu!";
          this.isLoading = false;
          this.hideSpinner(SpinnerType.BallAtom);
          this.cdr.detectChanges(); // Manuel change detection
        }
      },
      error: err => {
        console.error("Parametre okunurken hata:", err);
        this.errorMessage = "URL parametreleri okunamadı!";
        this.isLoading = false;
        this.hideSpinner(SpinnerType.BallAtom);
        this.cdr.detectChanges(); // Manuel change detection
      }
    });
  }

  updatePassword(password: string, passwordConfirm:string){
    this.showSpinner(SpinnerType.BallAtom);
    if(password != passwordConfirm){
      this.customToastr.message("Şifreleri doğrulayınız!","Hata!",{
        messageType : ToastrMessageType.Error,
        position : ToastrPosition.TopRight
      });
      this.hideSpinner(SpinnerType.BallAtom)
      return
    }
    this.activatedRoute.params.subscribe({
      next: async params => {
        const userId: string = params["userId"];
        const resetToken: string = params["resetToken"];
        await this.userService.updatePassword(userId,resetToken,password,passwordConfirm,
        ()=>{
          this.customToastr.message("Şifre başarıyla güncellendi!","Güncellendi!",{
        messageType : ToastrMessageType.Success,
        position : ToastrPosition.TopRight
        })
        this.router.navigate(["/login"])
        },error =>{
          console.log(error)
        });
        this.hideSpinner(SpinnerType.BallAtom)
      }
    })
  }
}