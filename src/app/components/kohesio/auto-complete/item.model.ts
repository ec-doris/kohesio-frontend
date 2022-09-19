export interface AutoCompleteItem {
  id?: string;
  label: string;
  shortValue?: string;
  subItems?: AutoCompleteItem[];
};
