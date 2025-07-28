import { Component } from '@angular/core';
import { Base, SpinnerType } from '../../../base/base';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-order',
  standalone: false,
  templateUrl: './order.html',
  styleUrl: './order.scss'
})
export class Order extends Base {

  constructor(spinner: NgxSpinnerService) {
      super(spinner);
    }
  
    ngOnInit(): void {
      //this.showSpinner(SpinnerType.BallAtom);
    }
}
