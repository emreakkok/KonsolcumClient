import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Basket } from './basket';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    Basket
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(
      [
        {path: "", component: Basket}
      ]
    ),
    ReactiveFormsModule
  ],
  exports: [
    Basket //appe basketi taşımak için
  ]
})
export class BasketModule { }
