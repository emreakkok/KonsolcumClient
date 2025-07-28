import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { CustomToastr, ToastrMessageType, ToastrPosition } from './custom-toastr';
import { Toast } from 'ngx-toastr';
import { UserService } from './models/user-service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../base/base';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerInterceptorService implements HttpInterceptor{

  constructor( private customToastr : CustomToastr, private userService : UserService,private router : Router,private spinner: NgxSpinnerService) { }
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(catchError(error => {
      console.log('HTTP Error:', error);
      
      switch (error.status) {
        case HttpStatusCode.Unauthorized:

        
          
          // Refresh token logic
          this.userService.refreshTokenLogin(localStorage.getItem("refreshToken"),(state) => {
            if(!state){
                const url = this.router.url;
              if(url.startsWith("/products")){
                this.customToastr.message("Sepete ürün eklemek için oturum açmanız gerekiyor.","Oturum açınız!",
                  {
                    messageType: ToastrMessageType.Warning,
                    position:ToastrPosition.TopRight
                  }
                )
              }else
                {
                this.customToastr.message(
                  "Bu işlemi yapmaya yetkiniz bulunmamaktadır!",
                  "Yetkisiz İşlem!",
                  {
                    messageType: ToastrMessageType.Warning,
                    position: ToastrPosition.BottomFullWidth
                  }
                );
              }
            }
          }).then(data => {
            // Token yenileme işlemi
          });
          break;

        case HttpStatusCode.InternalServerError:
          this.customToastr.message(
            "Sunucuya erişilemiyor!",
            "Sunucu Hatası!",
            {
              messageType: ToastrMessageType.Error,
              position: ToastrPosition.BottomFullWidth
            }
          );
          break;

        case HttpStatusCode.BadRequest:
          // BadRequest durumlarını service'lerde handle et
          // Interceptor'da sadece log'la, mesaj gösterme
          console.log('BadRequest Error (Service\'de handle edilecek):', error.error);
          break;

        case HttpStatusCode.NotFound:
          this.customToastr.message(
            "İstenen kaynak bulunamadı!",
            "Sayfa Bulunamadı!",
            {
              messageType: ToastrMessageType.Warning,
              position: ToastrPosition.BottomFullWidth
            }
          );
          break;

        case HttpStatusCode.Forbidden:
          this.customToastr.message(
            "Bu işlemi yapmaya yetkiniz yok!",
            "Erişim Engellendi!",
            {
              messageType: ToastrMessageType.Warning,
              position: ToastrPosition.BottomFullWidth
            }
          );
          break;

        default:
          // Bilinmeyen hatalar için genel mesaj
          this.customToastr.message(
            "Beklenmeyen bir hata meydana gelmiştir!",
            "Hata!",
            {
              messageType: ToastrMessageType.Error,
              position: ToastrPosition.BottomFullWidth
            }
          );
          break;
      }
      this.spinner.hide(SpinnerType.BallAtom);

      // Hatayı service'lerde yakalanabilmesi için tekrar fırlat
      return throwError(() => error);
    }));
  }
}
