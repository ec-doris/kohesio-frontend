import { Pipe, PipeTransform } from "@angular/core";
import { environment } from "src/environments/environment";

@Pipe({
  name: "outermostRegions"
})
export class OutermostRegionsPipe  implements PipeTransform {
  transform(array: any, mapRegions: any): any[] {
    if (mapRegions.length>1 || (mapRegions.length == 1 && mapRegions[0].region)){
      const index = (mapRegions.length>1 && !mapRegions[0].region) ? 1 : 0;
      const countryId = mapRegions[index].region.replace(environment.entityURL,"");
      const regions = array.filter((region:any) => {
          return region.country == countryId;
      });
      return regions;
    }else{
      return array;
    }
  }
}