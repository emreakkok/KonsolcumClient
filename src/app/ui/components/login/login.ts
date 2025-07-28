import { Component } from '@angular/core';
import { UserService } from '../../../services/common/models/user-service';
import { Base, SpinnerType } from '../../../base/base';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../services/common/auth-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login extends Base {


  constructor(private userService: UserService, spinner : NgxSpinnerService, private authService: AuthService,private activatedRoute: ActivatedRoute,private router:Router) {
    super(spinner);    
  }

  async login(usernameOrEmail: string, password: string){
    this.showSpinner(SpinnerType.BallAtom);
    try {
      await this.userService.login(usernameOrEmail, password, () => {
        this.authService.identityCheck();
        this.activatedRoute.queryParams.subscribe(params => {
          const returnUrl: string = params["returnUrl"];
          if (returnUrl)
            this.router.navigate([returnUrl]);
          else
            this.router.navigate(["/"]);
        });
      });
    } catch (error) {
      // Hata durumunda burada işlem yapabilirsiniz
      console.error('Login failed:', error);
      // Hata mesajı göstermek için
      // this.showErrorMessage(error.message);
    } finally {
      // Her durumda spinner'ı kapat
      this.hideSpinner(SpinnerType.BallAtom);
    }
    
  }
}
