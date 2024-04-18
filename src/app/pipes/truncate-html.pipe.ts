import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "truncateHtml"
})
export class TruncateHtmlPipe  implements PipeTransform {
  transform(text: string | undefined): string | undefined {
    if (!text) {
      return text;
    }

    let without_html:string = text.replace(/<(?:.|\n)*?>/gm, '');
    without_html = without_html.replace(/ +(?= )/g,'');
    without_html = without_html.replace(/&nbsp;/gi," ")

    return without_html;
  }
}
