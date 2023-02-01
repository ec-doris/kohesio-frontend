import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Observable, of, startWith} from "rxjs";
import {AutoCompleteItem} from "./item.model";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {map} from "rxjs/operators";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";

@Component({
    selector: 'kohesio-auto-complete',
    templateUrl: './auto-complete.component.html',
    styleUrls: ['./auto-complete.component.scss'],
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        multi:true,
        useExisting: KohesioAutoCompleteComponent
      }
    ]
})

export class KohesioAutoCompleteComponent implements ControlValueAccessor, OnChanges{

  internalItems: Observable<AutoCompleteItem[]> = new Observable<AutoCompleteItem[]>();
  inputValue:string | undefined = undefined;
  onChange = (_value:any) => {};
  onTouched = () => {};
  @Input() items: AutoCompleteItem[] = [];
  @Input() hasEmptyValue: boolean = true;
  @Input() isDisabled: boolean = false;
  @Input() placeholder: string | undefined;
  @Output() change = new EventEmitter<any>();
  public hasSubItems = false;

  constructor(){}

  ngOnInit(){
    if (this.items){
      this.items.forEach((item:AutoCompleteItem)=>{
        if (item.subItems && item.subItems.length){
          this.hasSubItems = true;
          return;
        }
      })
    }
    if(this.items && this.items.length) {
      this.internalItems = of(this.items);
    }
  }

  writeValue(obj: any): void {
    if (obj == null){
      this.inputValue = undefined;
    }
    this.inputValue = obj;
  }
  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }
  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.items && this.items.length) {
      this.internalItems = of(this.items);
    }
    this.change.emit();
  }

  public onOptionSelected(event: MatAutocompleteSelectedEvent){
    this.onChange(event.option.value);
    this.change.emit();
  }

  public onInputType(value:string){
    this.internalItems = of(value.toString()).pipe(
      startWith(''),
      map((value) => {
        return this.hasSubItems ? this._filterSubItems(value) : this._filterItems(value)
      })
    );
  }

  private _filterItems(value: string) {
    if (value) {
      return this.filterItem(this.items, value);
    }

    return this.items;
  }

  private _filterSubItems(value: string) {
    if (value) {
      return this.items
        .map((group:AutoCompleteItem) => {
          return {
            label: group.label,
            subItems: this.filterItem(group.subItems, value)
          }
        })
        .filter((group:AutoCompleteItem) => {
          return group.subItems && group.subItems.length > 0;
        })
    }

    return this.items;
  }

  private filterItem(options: AutoCompleteItem[] | undefined, value: any): AutoCompleteItem[]{
    if (options) {
      return options.filter(item => {
        let search = '';
        if (typeof value === 'string') {
          search = value;
        } else {
          search = value?.value;
        }
        return item.label.toLowerCase().includes(search.toLowerCase());
      });
    }
    return [];
  }

  public displayWith(option: any): string {
    return option?.label;
  }

  public onOpen(){
    this.internalItems = of(this.items);
  }

  public onClosed(){
    if (!this.inputValue){
      this.onChange(undefined);
    }
  }

}
