import { Pipe, PipeTransform } from "@angular/core";
import { environment } from "src/environments/environment";

@Pipe({
  name: "outermostRegions"
})
export class OutermostRegionsPipe  implements PipeTransform {
  transform(array: any, mapRegions: any): any[] {
    if (mapRegions.length>1){
      const countryId = mapRegions[1].region.replace(environment.entityURL,"");
      const regions = array.filter(region => {
        if (region.country == countryId){
          return true;
        }
      });
      return regions;
    }else{
      return null;
    }
  }
}