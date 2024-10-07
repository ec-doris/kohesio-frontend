import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformVideoUrl'
})
export class TransformVideoUrlPipe implements PipeTransform {

  transform(url: string): string {
    const encodedUrl = encodeURIComponent(url);
    return `https://webtools.europa.eu/crs/iframe/?oriurl=${encodedUrl}`;
  }
}
