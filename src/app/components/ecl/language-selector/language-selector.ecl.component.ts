import { Component } from '@angular/core';


@Component({
    selector: 'kohesio-ecl-language-selector',
    templateUrl: './language-selector.ecl.component.html',
})
export class KohesioEclLanguageSelectorComponent {

  changeLanguage(selectedLangCode:string){
    window.location.href = `/${selectedLangCode}`
  }


}
