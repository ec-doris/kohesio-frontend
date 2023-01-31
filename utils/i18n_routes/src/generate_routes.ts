import fs from "fs";
import { readFile } from "fs/promises";

export class GenerateRoutes{

  public langs = ["bg","cs","da","de","el","es","en","et","fi","fr","ga","hr","hu","it","lt","lv","mt","nl","pl","pt","ro","sk","sl","sv"];
  public messagesFilePath = "../../src/locale/";
  public routeOutputPath = "../../build/routes/";

  public run(){

    this.langs.forEach((lang:string)=>{
      let filename:string = this.messagesFilePath+"messages."+lang+".json";
      if (lang == 'en'){
        filename = this.messagesFilePath+"messages.json";
      }
      const output:string = this.routeOutputPath+"routes_"+lang;
      this.readJsonFile(filename).then((data) => {
        let outputStringFile = "/\n";
        for(let translations in data.translations){
          if (translations.startsWith("translate.routes")){
            outputStringFile += '/' + data.translations[translations] + "\n";
          }
        }
        fs.writeFileSync(output, outputStringFile, {encoding:'utf8',flag:'w'});
      });
    })

  }

  public async readJsonFile(path) {
    const file = await readFile(path, "utf8");
    return JSON.parse(file);
  }

}

new GenerateRoutes().run();
