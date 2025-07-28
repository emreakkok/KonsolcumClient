import { Component } from '@angular/core';
import { Base, SpinnerType } from '../../../base/base';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.html',
  styleUrl: './categories.scss'
})
export class Categories extends Base {

  constructor(spinner: NgxSpinnerService) {
      super(spinner);
    }
  
    ngOnInit(): void {
      //this.showSpinner(SpinnerType.BallAtom);
    }
}
