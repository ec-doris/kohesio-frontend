const fs = require('fs');
import { readFile } from "fs/promises";

export class Update {

  public langs = ["bg","cs","da","de","el","es","et","fi","fr","ga","hr","hu","it","lt","lv","mt","nl","pl","pt","ro","sk","sl","sv"];
  public messagesFilePath = "../../src/locale/";

  public copyOneTranslation(from: string, to: string){

    this.langs.forEach((lang:string)=>{
      const filename:string = this.messagesFilePath+"messages."+lang+".json";
      this.readJsonFile(filename).then((data) => {
        data.translations[to]=data.translations[from];
        fs.writeFileSync(filename, JSON.stringify(data, null, "\t"), 'utf8');
      });
    })

  }

  public async readJsonFile(path) {
    const file = await readFile(path, "utf8");
    return JSON.parse(file);
  }

}

new Update().copyOneTranslation("page.home.carousel.of","comp.paginator.of");
