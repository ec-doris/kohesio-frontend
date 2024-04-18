import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Observable, of, startWith} from "rxjs";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {map} from "rxjs/operators";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {AutoCompleteItem} from "../auto-complete/item.model";

@Component({
    selector: 'kohesio-multi-auto-complete',
    templateUrl: './multi-auto-complete.component.html',
    styleUrls: ['./multi-auto-complete.component.scss'],
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        multi:true,
        useExisting: KohesioMultiAutoCompleteComponent
      }
    ]
})

export class KohesioMultiAutoCompleteComponent implements ControlValueAccessor, OnChanges{

  internalItems: Observable<AutoCompleteItem[]> = new Observable<AutoCompleteItem[]>();
  selectedItems: AutoCompleteItem[] = [];
  inputValue:AutoCompleteItem[] | undefined = undefined;
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
      this.selectedItems = [];
    }
    if (obj && obj.length){
      obj.forEach((o:AutoCompleteItem)=>{
        o.selected = true;
        this.selectedItems.push(o)
      })
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
    this.toggleSelection(event.option.value);
  }

  public toggleSelection(item:AutoCompleteItem){
    item.selected = !item.selected;
    if (item.selected) {
      this.selectedItems.push(item);
    }else{
      this.selectedItems = this.selectedItems.filter((filteredItem:AutoCompleteItem) => {
        return filteredItem.id !== item.id;
      });
    }
    this.onChange(this.selectedItems);
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
    if (this.selectedItems.length == 0){
      this.onChange(undefined);
    }
  }

  remove(removedItem:any){
    this.selectedItems = this.selectedItems.filter((item:AutoCompleteItem) => {
      return item.id !== removedItem.id;
    });
    this.onChange(this.selectedItems);
    this.internalItems.subscribe(items=>{
      items.forEach(internalItem=>{
        if (internalItem.id == removedItem.id){
          removedItem.selected = false;
          return;
        }
        if (internalItem.subItems && internalItem.subItems.length){
          internalItem.subItems.forEach(internalSubItem=>{
            if (internalSubItem.id == removedItem.id){
              internalSubItem.selected = false;
              return;
            }
          });
        }
      })
    })
  }

}
