import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordReset } from './password-reset';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    PasswordReset
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(
      [
        {path: "", component: PasswordReset}
      ]
    ),
  ]
})
export class PasswordResetModule { }
