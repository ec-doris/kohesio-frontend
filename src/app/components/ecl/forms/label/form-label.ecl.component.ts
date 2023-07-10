import {Component, Input} from '@angular/core';


@Component({
    selector: 'kohesio-ecl-form-label',
    templateUrl: './form-label.ecl.component.html',
})
export class KohesioEclFormLabelComponent {

  @Input() required:boolean = false;

}
