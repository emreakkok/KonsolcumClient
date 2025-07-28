import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDynamicLoadComponent]',
  standalone: false
})
export class DynamicLoadComponent {

   constructor(public viewContainerRef: ViewContainerRef) { }

}
