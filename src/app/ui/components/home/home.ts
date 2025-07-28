import { Component } from '@angular/core';
import { Base, SpinnerType } from '../../../base/base';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home extends Base {

  constructor(spinner: NgxSpinnerService) {
      super(spinner);
    }
  
    ngOnInit(): void {
      //this.showSpinner(SpinnerType.BallAtom);
    }
}
