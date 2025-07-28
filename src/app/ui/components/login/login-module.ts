import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Login } from './login';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    Login
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(
      [
        {path: "", component: Login}
      ]
    ),
  ]
})
export class LoginModule { }
