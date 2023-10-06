import { Component, Input } from '@angular/core';


@Component({
    selector: 'kohesio-ecl-spinner',
    templateUrl: './spinner.ecl.component.html',
})
export class KohesioEclSpinnerComponent {

  @Input()
  hasLabel:boolean = true;

}
