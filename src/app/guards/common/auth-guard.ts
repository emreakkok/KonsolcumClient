import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CustomToastr, ToastrMessageType, ToastrPosition } from '../../services/common/custom-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../base/base';
import { AuthService } from '../../services/common/auth-service';


export const authGuard: CanActivateFn = (route, state) => {
  
  const router = inject(Router);
  const customToastr = inject(CustomToastr);
  const spinner = inject(NgxSpinnerService);
  const authService = inject(AuthService);

  spinner.show(SpinnerType.BallAtom);

  if (!authService.isAuthenticated) {
    spinner.hide(SpinnerType.BallAtom);
    
    router.navigate(["login"], { queryParams: { returnUrl: state.url } });
    
    customToastr.message(
      "Oturum açmanız gerekiyor!",
      "Yetkisiz Erişim!",
      {
        messageType: ToastrMessageType.Warning,
        position: ToastrPosition.TopRight
      }
    );
    
    // return false; // ÖNEMLİ: false döndürüyoruz
  }

  spinner.hide(SpinnerType.BallAtom);
  return true; // Sadece token geçerli olduğunda true döndürüyoruz
};