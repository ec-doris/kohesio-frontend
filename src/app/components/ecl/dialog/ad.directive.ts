import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[adHost]',
})
export class AdDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
