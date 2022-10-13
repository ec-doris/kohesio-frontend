import {Component, Inject, LOCALE_ID} from '@angular/core';
import {TranslateService} from "../../../services/translate.service";


@Component({
    selector: 'kohesio-ecl-language-selector',
    templateUrl: './language-selector.ecl.component.html',
})
export class KohesioEclLanguageSelectorComponent {

  public languages: any[] = [{
    code: "bg",
    label: "български"
  },{
    code: "es",
    label:"español"
  },{
    code: "cs",
    label:"čeština"
  },{
    code: "da",
    label:"dansk"
  },{
    code: "de",
    label:"Deutsch"
  },{
    code: "et",
    label:"eesti"
  },{
    code: "el",
    label:"ελληνικά"
  },{
    code: "en",
    label:"English"
  },{
    code: "fr",
    label:"français"
  },{
    code: "ga",
    label:"Gaeilge"
  },{
    code: "hr",
    label:"hrvatski"
  },{
    code: "it",
    label:"italiano"
  },{
    code: "lv",
    label:"latviešu"
  },{
    code: "lt",
    label:"lietuvių"
  },{
    code: "hu",
    label:"magyar"
  },{
    code: "mt",
    label:"Malti"
  },{
    code: "nl",
    label:"Nederlands"
  },{
    code: "pl",
    label:"polski"
  },{
    code: "pt",
    label:"português"
  },{
    code: "ro",
    label:"română"
  },{
    code: "sk",
    label:"slovenčina"
  },{
    code: "sl",
    label:"slovenščina"
  },{
    code: "fi",
    label:"suomi"
  },{
    code: "sv",
    label:"svenska"
  }];

  public localeLabel: string;

  constructor(@Inject(LOCALE_ID) public locale: string,
              public translateService: TranslateService){
    this.localeLabel = this.getLanguageLabel(locale);
  }

  changeLanguage(selectedLangCode:string){
     this.translateService.translateUrl(selectedLangCode).subscribe((url:string)=>{
       window.location.href = url;
    });
  }

  getLanguageLabel(locale: string): string{
    const lang = this.languages.find((language:any)=>{
      return language.code == locale;
    })
    return lang.label;
  }


}
