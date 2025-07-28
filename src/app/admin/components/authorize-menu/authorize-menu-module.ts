import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorizeMenu } from './authorize-menu';
import { RouterModule } from '@angular/router';
import { MatTreeModule } from '@angular/material/tree'
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    AuthorizeMenu
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(
      [
        {path: "",component: AuthorizeMenu}
      ]
    ),
    MatTreeModule,MatIconModule, MatButtonModule

  ]
})
export class AuthorizeMenuModule { }
