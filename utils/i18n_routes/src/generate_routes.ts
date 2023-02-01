import fs, {readFileSync} from "fs";
import { readFile } from "fs/promises";

export class GenerateRoutes{

  public langs = ["bg","cs","da","de","el","es","en","et","fi","fr","ga","hr","hu","it","lt","lv","mt","nl","pl","pt","ro","sk","sl","sv"];
  public messagesFilePath = "../../src/locale/";
  public routeOutputPath = "../../build/routes/";

  public async run(){
    const output:string = this.routeOutputPath+"prerender-routes";
    let outputStringFile = "";
    this.langs.forEach((lang:string)=>{
      let filename:string = this.messagesFilePath+"messages."+lang+".json";
      if (lang == 'en'){
        filename = this.messagesFilePath+"messages.json";
      }
      const data = this.readJsonFile(filename);
      outputStringFile += "/" + lang +"\n";
      for(let translations in data.translations){
        if (translations.startsWith("translate.routes")){
          outputStringFile += "/" + lang + "/" + data.translations[translations] + "\n";
        }
      }
    })
    fs.writeFileSync(output, outputStringFile, {encoding:'utf8',flag:'w'});
  }

  public readJsonFile(path) {
    const file = readFileSync(path, "utf8");
    return JSON.parse(file);
  }

}

new GenerateRoutes().run();
