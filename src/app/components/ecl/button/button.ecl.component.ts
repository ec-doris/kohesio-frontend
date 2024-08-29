import { Component, Input } from '@angular/core';

@Component({
  selector: 'kohesio-ecl-button',
  styles: [`
    .ecl-button--call {
      background-color: #ffd617;
      color: #3860ed;
      padding-left: 14px;
      padding-right: 14px;
      height: 44px;
    }
  `],
  templateUrl: './button.ecl.component.html',
})
export class KohesioEclButtonComponent {
  @Input() type = 'button';
  @Input() isDisabled? = false;
  @Input() variant: 'primary' | 'secondary' | 'call' | 'ghost' = 'primary';
}
