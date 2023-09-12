export interface AutoCompleteItem {
  id?: string;
  label: string;
  shortValue?: string;
  selected?:boolean;
  subItems?: AutoCompleteItem[];
}
