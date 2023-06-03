import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
    selector: 'kohesio-ecl-form-checkbox',
    templateUrl: './form-checkbox.ecl.component.html',
    providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          multi:true,
          useExisting: KohesioEclFormCheckboxComponent
        }
      ]
})
export class KohesioEclFormCheckboxComponent implements ControlValueAccessor{

    inputValue:any;
    onChange = (_value:any) => {};
    onTouched = () => {};

    @Input() label!:string;
    @Input() helpText?:string;
    @Input() isDisabled:boolean = false;
    @Input() checked:boolean = false;

    writeValue(obj: string): void {
       this.inputValue = obj;
    }
    registerOnChange(onChange: any): void {
        this.onChange = onChange;
    }
    registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

    change($event:any){
      this.onChange($event.target.checked);
    }

}
