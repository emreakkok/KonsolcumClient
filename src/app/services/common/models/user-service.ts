import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client-service';
import { Create_User } from '../../../contracts/users/create_user';
import { firstValueFrom, Observable } from 'rxjs';
import { User } from '../../../entities/user';
import { Token } from '../../../contracts/token/token';
import { CustomToastr, ToastrMessageType, ToastrPosition } from '../custom-toastr';
import { TokenResponse } from '../../../contracts/token/token-response';
import { List_User } from '../../../contracts/users/list-user';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClientService: HttpClientService,private customToastr : CustomToastr) { }

  async create(user : User): Promise<Create_User>{
    const observable : Observable<Create_User | User> = this.httpClientService.post<Create_User | User>(
      {
        controller:"users",
      },user);

    return await firstValueFrom(observable) as Create_User;
  }

  async login(usernameOrEmail: string, password: string, callBackFunction? : () => void): Promise<any>{
    const observable: Observable<any | TokenResponse> = this.httpClientService.post<any | TokenResponse>({
      controller:"auth",
      action: "login"
    },{ usernameOrEmail,password})

    const tokenResponse : TokenResponse = await firstValueFrom(observable) as TokenResponse;
    if(tokenResponse){

      localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);

      this.customToastr.message("Kullanıcı girişi başarıyla sağlanmıştır.","Giriş Başarılı",{
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight})
    }
      

    callBackFunction?.();
  }

  async refreshTokenLogin(refreshToken:string | null,  callBackFunction? : (state: boolean) => void): Promise<any>{
    const observable : Observable<any | TokenResponse> = this.httpClientService.post({
      action:"refreshtokenlogin",
      controller:"auth"
    }, {refreshToken: refreshToken});

    try{
      const tokenResponse : TokenResponse = await firstValueFrom(observable) as TokenResponse;

      if(tokenResponse){
        localStorage.setItem("accessToken", tokenResponse.token.accessToken);
        localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
      }

      callBackFunction?.(tokenResponse ? true:false);
    }
    catch{
      callBackFunction?.(false);
    }
  }

  async passwordReset(email: string, callBackFunction? : () => void){
    const observable: Observable<any> = this.httpClientService.post({
      controller: "auth",
      action:"password-reset"
    },{email: email});

    await firstValueFrom(observable);
    callBackFunction?.();
  }

  async verifyResetToken(resetToken: string, userId: string, callBackFunction?: () => void): Promise<boolean> {
  try {
    console.log('verifyResetToken çağrılıyor:', { 
      resetToken: resetToken.substring(0, 20) + '...', 
      userId 
    });
    
    const observable: Observable<any> = this.httpClientService.post({
      controller: "auth",
      action: "verify-reset-token"
    }, {
      resetToken: resetToken,
      userId: userId
    });

    const response = await firstValueFrom(observable);
    console.log('verifyResetToken response:', response);
    
    // API'den dönen response'un state property'sini kontrol et
    const isValid = response?.state === true;
    
    // Callback'i her zaman çağır
    if (callBackFunction) {
      callBackFunction();
    }
    
    return isValid;
  } catch (error) {
    console.error('verifyResetToken error:', error);
    
    // Callback'i hata durumunda da çağır
    if (callBackFunction) {
      callBackFunction();
    }
    
    return false;
  }
}

  async updatePassword(userId:string,resetToken:string,password:string,passwordConfirm: string,successCallBack?: () => void, errorCallBack?: (error: string) => void){
    const observable : Observable<any> = this.httpClientService.post({
      controller:"users",
      action:"update-password"
    },{userId:userId,
      resetToken: resetToken,
      password:password,
      passwordConfirm: passwordConfirm
    });


    const promiseData : Promise<any> = firstValueFrom(observable);
    promiseData.then(value => successCallBack?.()).catch(error => errorCallBack?.(error));
    await promiseData;

  }

  async getAllUsers(page?: number, size?: number, successCallBack?: () => void, errorCallback?: (errorMessage: string) => void): Promise<{totalUserCount:number, users:List_User[]}> {
      
        const promiseData: Promise<{totalUserCount:number, users:List_User[]}> = firstValueFrom(this.httpClientService.get<{totalUserCount:number, users:List_User[]}>({
        controller: "users",
        queryString:`page=${page}&size=${size}`
      }));
      
      promiseData
      .then(() => {
        if (successCallBack) successCallBack();
      })
      .catch((errorResponse: HttpErrorResponse) => {
        if (errorCallback) errorCallback(errorResponse.message);
      });

      return await promiseData;
  }
  async assignRoleUser(id:string ,roles: string[], successCallBack?: () => void, errorCallBack?: (error:string) => void) {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "users",
      action: "assign-role-to-user"
    }, {
      userId: id,
      roles: roles
    })

    const promiseData = observable.subscribe({
      next: successCallBack,
      error: errorCallBack
    });

    await promiseData;
  }

  async getRolesToUser(userId:string, successCallBack?: () => void, errorCallBack?: (error: string) => void): Promise<string[]> {
    const observable: Observable<any> = this.httpClientService.get({
      controller: "users",
      action: "get-roles-to-user"
    }, userId);

    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack)
      .catch(errorCallBack);

    return (await promiseData).userRoles;
  }

}
