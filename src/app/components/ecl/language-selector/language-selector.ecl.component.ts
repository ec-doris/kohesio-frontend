import {Component, Inject, LOCALE_ID} from '@angular/core';


@Component({
    selector: 'kohesio-ecl-language-selector',
    templateUrl: './language-selector.ecl.component.html',
})
export class KohesioEclLanguageSelectorComponent {

  constructor(@Inject(LOCALE_ID) public locale: string){}

  changeLanguage(selectedLangCode:string){
    window.location.href = `/${selectedLangCode}`
  }


}
