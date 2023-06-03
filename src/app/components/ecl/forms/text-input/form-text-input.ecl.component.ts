import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
    selector: 'kohesio-ecl-form-text-input',
    templateUrl: './form-text-input.ecl.component.html',
    providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          multi:true,
          useExisting: KohesioEclFormTextInputComponent
        }
      ]
})
export class KohesioEclFormTextInputComponent implements ControlValueAccessor, AfterViewInit{

    inputValue:any;
    onChange = (_value:any) => {};
    onTouched = () => {};

    @Input() isDisabled:boolean = false;
    @Input() focus:boolean = false;

    @ViewChild("inputElement") inputElement!:ElementRef;

    writeValue(obj: string): void {
       this.inputValue = obj;
    }
    registerOnChange(onChange: any): void {
        this.onChange = onChange;
    }
    registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

    ngAfterViewInit(){
      if (this.focus) {
        this.inputElement.nativeElement.focus();
      }
    }



}
