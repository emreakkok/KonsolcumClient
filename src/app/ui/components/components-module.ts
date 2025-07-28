import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsModule } from './products/products-module';
import { HomeModule } from './home/home-module';
import { CategoriesModule } from './categories/categories-module';
import { RegisterModule } from './register/register-module';
import { LoginModule } from './login/login-module';
import { BasketModule } from './basket/basket-module';
import { PasswordResetModule } from './password-reset/password-reset-module';
import { UpdatePasswordModule } from './update-password/update-password-module';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ProductsModule,
    CategoriesModule,
    HomeModule,
    RegisterModule,
    LoginModule,
    BasketModule,
    PasswordResetModule,
    UpdatePasswordModule
  ],
  exports: [
    BasketModule //appe basketi taşımak için
  ]
})
export class ComponentsModule { }
