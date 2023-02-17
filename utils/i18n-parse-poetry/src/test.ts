/*Testing all the translated files and compare with the English to see the differences*/

import {readFile} from "fs/promises";

export class Test{

  public langs = ["bg","cs","da","de","el","es","et","fi","fr","ga","hr","hu","it","lt","lv","mt","nl","pl","pt","ro","sk","sl","sv"];
  public messagesFilePath = "../../src/locale/";
  public enPath = this.messagesFilePath + "messages.json";

  public async run(){
    const englishTranslationFile = await this.readJsonFile(this.enPath);
    const languageInfo:any = [];
    for (const lang of this.langs) {
      const filename: string = this.messagesFilePath + "messages." + lang + ".json";
      const langTranslations = await this.readJsonFile(filename);
      const translationsMissing:string[] = [];
      for (const translationEN in englishTranslationFile.translations) {
        let found = false;
        for (const translationLANG in langTranslations.translations) {
          if (translationEN == translationLANG){
            found = true;
            break;
          }
        }
        if (!found){
          translationsMissing.push(translationEN)
        }
      }
      languageInfo.push({
        language: lang,
        missing: translationsMissing
      });
    }
    for(let langInfo of languageInfo){
      console.log(`Language info ${langInfo.language}, missing ${langInfo.missing.length}`);
    }
    languageInfo[0].missing.forEach((missing:string)=>{
      console.log(`Missing translation: ${missing}`);
    })
  }


  public async readJsonFile(path) {
    const file = await readFile(path, "utf8");
    return JSON.parse(file);
  }

}

new Test().run();
