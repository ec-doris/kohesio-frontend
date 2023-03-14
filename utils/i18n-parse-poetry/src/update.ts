const fs = require('fs');
import { readFile } from "fs/promises";

interface translations{
  type:string,
  from:string,
  to?:string,
  deleteSource?:boolean;
}

export class Update {

  public langs = ["bg","cs","da","de","el","es","et","fi","fr","ga","hr","hu","it","lt","lv","mt","nl","pl","pt","ro","sk","sl","sv"];
  public messagesFilePath = "../../src/locale/";

  public run(objects:translations[]){
    this.langs.forEach((lang:string)=>{
      const filename:string = this.messagesFilePath+"messages."+lang+".json";
      this.readJsonFile(filename).then((data) => {
        objects.forEach((translation:translations)=>{
          switch (translation.type){
            case "update":
              if (data.translations[translation.from]) {
                data.translations[translation.to] = data.translations[translation.from];
                if (translation.deleteSource) {
                  delete data.translations[translation.from];
                }
              }
              break
            case "delete":
              delete data.translations[translation.from];
              break;
          }

        })
        fs.writeFileSync(filename, JSON.stringify(data, null, "\t"), 'utf8');
      });
    })
  }

  public async readJsonFile(path) {
    const file = await readFile(path, "utf8");
    return JSON.parse(file);
  }

}

const update = new Update();
/*const objects:translations[] = [{
  type: "update",
  from: "page.beneficiary-detail.label.shareon",
  to: "comp.share-block.label.shareon",
  deleteSource: true
},{
  type: "update",
  from: "page.beneficiary-detail.label.reportIssue",
  to: "comp.share-block.label.reportIssue",
  deleteSource: true
},{
  type: "delete",
  from: "page.project-detail.label.shareon"
},{
  type: "delete",
  from: "page.project-detail.label.reportIssue"
}]*/
const objects:translations[] = [{
  type: "update",
  from: "page.project-detail.button.graph",
  to: "comp.button.graph",
  deleteSource: true
},{
  type: "update",
  from: "page.project-detail.button.more",
  to: "comp.button.more",
  deleteSource: true
},{
  type: "delete",
  from: "page.beneficiary-detail.button.graph"
},{
  type: "delete",
  from: "page.beneficiary-detail.button.more"
}]


update.run(objects);
