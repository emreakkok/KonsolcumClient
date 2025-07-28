import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Base } from '../../../base/base';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.html',
  styleUrl: './user.scss'
})
export class User  extends Base{

  constructor(spinner: NgxSpinnerService) {
        super(spinner);
      }
}
