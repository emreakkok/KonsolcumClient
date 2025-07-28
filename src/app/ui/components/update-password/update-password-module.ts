import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdatePassword } from './update-password';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    UpdatePassword
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: UpdatePassword }
    ]),
    ReactiveFormsModule
  ]
})
export class UpdatePasswordModule { }