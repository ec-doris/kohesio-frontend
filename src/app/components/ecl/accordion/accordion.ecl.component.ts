import { Component, Input } from '@angular/core';


@Component({
    selector: 'kohesio-ecl-accordion',
    templateUrl: './accordion.ecl.component.html',
})
export class KohesioEclAccordionComponent {

    @Input()
    public title:string = "";
    
    @Input()
    public collapsed:boolean = true;

    toggle(){
        this.collapsed = !this.collapsed
    }
}
