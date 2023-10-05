import {AutoCompleteItem} from "../auto-complete/item.model";

export class AutoCompleteSelectedItem implements AutoCompleteItem {
  selected: boolean = false;
  id: string;
  label: string;
  shortValue: string;
  subItems: AutoCompleteSelectedItem[];
}
