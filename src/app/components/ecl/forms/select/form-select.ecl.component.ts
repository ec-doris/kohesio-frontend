import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
    selector: 'kohesio-ecl-form-select',
    templateUrl: './form-select.ecl.component.html',
    providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          multi:true,
          useExisting: KohesioEclFormSelectComponent
        }
      ]
})
export class KohesioEclFormSelectComponent implements ControlValueAccessor{
    
    value:string | undefined = undefined;
    onChange = (_value:any) => {};
    onTouched = () => {};
    @Input() items: any[] | undefined;
    @Input() disabled: boolean = false;
    @Output() change = new EventEmitter<any>();

    writeValue(obj: string): void {
       this.value = obj;
    }
    registerOnChange(onChange: any): void {
        this.onChange = onChange;
        this.change.emit();
    }
    registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

}
