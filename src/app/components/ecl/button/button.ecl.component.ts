import { Component, Input } from '@angular/core';


@Component({
    selector: 'kohesio-ecl-button',
    templateUrl: './button.ecl.component.html',
})
export class KohesioEclButtonComponent {

    @Input()
    type:string = "button";

}
