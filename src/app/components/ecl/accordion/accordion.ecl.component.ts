import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
    selector: 'kohesio-ecl-accordion',
    templateUrl: './accordion.ecl.component.html',
})
export class KohesioEclAccordionComponent {

    @Input()
    public title:string = "";
    
    @Input()
    public collapsed:boolean = true;

    @Output() change = new EventEmitter<any>();

    toggle(){
        this.collapsed = !this.collapsed
        this.change.emit(this.collapsed);
    }
}
