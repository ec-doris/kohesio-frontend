import { Component, Input } from '@angular/core';

@Component({
  selector: 'kohesio-ecl-button',
  templateUrl: './button.ecl.component.html',
})
export class KohesioEclButtonComponent {
  @Input() type = 'button';
  @Input() isDisabled? = false;
  @Input() variant: 'primary' | 'secondary' | 'call' | 'ghost' = 'primary';
}
