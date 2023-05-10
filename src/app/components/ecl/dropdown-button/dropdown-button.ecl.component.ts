import {Component, Input, ViewChild} from '@angular/core';
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {CdkMenu, CdkMenuTrigger} from "@angular/cdk/menu";

@Component({
    selector: 'kohesio-ecl-dropdown-button',
    templateUrl: './dropdown-button.ecl.component.html',
    styleUrls: ['./dropdown-button.ecl.component.scss']
})
export class KohesioEclDropDownButtonComponent {

    @Input() variant: 'primary' | 'secondary' | 'call' | 'ghost' = 'primary';
    @Input() label: string = "Menu";

    public opened:boolean = false;

    @ViewChild(CdkMenuTrigger) public menuTrigger?: CdkMenuTrigger;

    ngOnInit(): void {

    }

    onOpenMenu(){
      this.opened = true;
    }

    onCloseMenu(){
      this.opened = false;
    }

}
