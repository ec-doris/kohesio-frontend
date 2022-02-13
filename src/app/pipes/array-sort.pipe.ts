import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "sort"
})
export class ArraySortPipe  implements PipeTransform {
  transform(array: any, field: any): any[] {
    if (!Array.isArray(array)) {
      return [];
    }
    array.sort((a: string, b: string) => {
      if (a[field].toLowerCase() < b[field].toLowerCase()) {
        return -1;
      } else if (a[field].toLowerCase() > b[field].toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}