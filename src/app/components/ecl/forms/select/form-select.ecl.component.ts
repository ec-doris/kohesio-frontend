import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
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
export class KohesioEclFormSelectComponent implements ControlValueAccessor, OnChanges{
    
    
    value:string | undefined = undefined;
    onChange = (_value:any) => {};
    onTouched = () => {};
    @Input() items: any[] | undefined;
    @Input() hasEmptyValue: boolean = true;
    @Input() isDisabled: boolean = false;
    @Output() change = new EventEmitter<any>();
    private firstTimeChange:boolean = true;

    writeValue(obj: string): void {
       this.value = obj;
    }
    registerOnChange(onChange: any): void {
        this.onChange = onChange;
    }
    registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (!this.firstTimeChange){
            this.firstTimeChange = false;
            this.change.emit();
        }
    }

}
