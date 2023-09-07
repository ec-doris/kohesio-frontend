import {Component, EventEmitter, Input, Output} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
    selector: 'kohesio-ecl-form-radio',
    templateUrl: './form-radio.ecl.component.html',
    providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          multi:true,
          useExisting: KohesioEclFormRadioComponent
        }
      ]
})
export class KohesioEclFormRadioComponent implements ControlValueAccessor{
    private static id: number = 0;

    public componentId: string = "";

    inputValue:any;
    onChange = (_value:any) => {};
    onTouched = () => {};

    @Input() label!:string;
    @Input() helpText?:string;
    @Input() isDisabled:boolean = false;
    @Input() staticValue:string = "";
    @Output() change = new EventEmitter<any>();

    ngOnInit(): void {
      this.componentId = 'kohesio-ecl-form-radio-' + ++KohesioEclFormRadioComponent.id;
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
        this.onChange(this.staticValue);
        this.change.emit();
      }
    }

}

