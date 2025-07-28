import { Component, ViewChild, viewChild } from '@angular/core';
import { List } from './list/list';
import { Base } from '../../../base/base';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-role',
  standalone: false,
  templateUrl: './role.html',
  styleUrl: './role.scss'
})
export class Role extends Base{
  @ViewChild('roleList') roleList!: List;


  constructor(spinner: NgxSpinnerService){
    super(spinner)
  }
  createdRole(createdRole: string){
    if (this.roleList) {
      this.roleList.getRoles();
    }
  }
}
