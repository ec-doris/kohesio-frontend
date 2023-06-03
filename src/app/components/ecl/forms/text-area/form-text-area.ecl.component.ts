import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
    selector: 'kohesio-ecl-form-text-area',
    templateUrl: './form-text-area.ecl.component.html',
    styleUrls:['form-text-area.ecl.component.scss'],
    providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          multi:true,
          useExisting: KohesioEclFormTextAreaComponent
        }
      ]
})
export class KohesioEclFormTextAreaComponent implements ControlValueAccessor{

    inputValue:any;
    onChange = (_value:any) => {};
    onTouched = () => {};

    @Input() isDisabled:boolean = false;
    @Input() extraClass?:string;
    @Input() autosize:boolean = true;

    writeValue(obj: string): void {
       this.inputValue = obj;
    }
    registerOnChange(onChange: any): void {
        this.onChange = onChange;
    }
    registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }
    innerTextCopy(){
      return this.inputValue.replace(/\n/g, '<br/>');
    }

}
