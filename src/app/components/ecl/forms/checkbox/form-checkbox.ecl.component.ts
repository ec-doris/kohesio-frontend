import {Component, EventEmitter, Input, Output} from '@angular/core';
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
    private static id: number = 0;

    public componentId: string = "";

    inputValue:any;
    onChange = (_value:any) => {};
    onTouched = () => {};

    @Input() label!:string;
    @Input() helpText?:string;
    @Input() isDisabled:boolean = false;
    @Input() checked:boolean = false;
    @Output() change = new EventEmitter<any>();

    ngOnInit(): void {
      this.componentId = 'kohesio-ecl-form-checkbox-' + ++KohesioEclFormCheckboxComponent.id;
    }

    writeValue(obj: string): void {
       this.inputValue = obj;
    }
    registerOnChange(onChange: any): void {
        this.onChange = onChange;
    }
    registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

    ngOnChanges($event:any){
      if ($event.target) {
        this.onChange($event.target.checked);
        this.change.emit();
      }
    }

}

