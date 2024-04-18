import {readFile} from "fs/promises";

const ExcelJS = require('exceljs');
const fs = require('fs');

class Read {

  private dir:string = "files/5batch";

  public async run(){
    fs.readdir(this.dir, (err, files) => {
      files.forEach(file => {
        /* DEBUGGING ONE FILE
        if (file == 'REGIO-2022-00163-00-04-HU-TRA-00.XLSX') {
          console.log("processing FILE="+file);
          this.processFile(file);
        }
        */
        this.processFile(file);
      });
    });
  }

  private async processFile(fileName: string){
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(`${this.dir}/${fileName}`);

    const worksheet = workbook.worksheets[0];

    const json:any = {
      locale: fileName.split("-")[5].toLowerCase(),
      translations: {

      }
    };
    const outputFileName:string = "messages."+ json.locale + ".json";
    const outputJSON =  await this.readJsonFile("../../src/locale/"+outputFileName);
    json.translations = outputJSON.translations;
    /*if (json.locale != "cs"){
      return;
    }*/

    try {
      worksheet.eachRow((row, rowNumber) => {
        if (row && rowNumber > 1) {
          let key: string = row.getCell(2).value;
          //console.log("PROCESSING KEY="+key);
          if (row.getCell(2).value.richText && row.getCell(2).value.richText.length) {
            key = row.getCell(2).value.richText[0].text;
          }
          let value = row.getCell(3).value;
          //console.log("PROCESSING VALUE="+value);
          if (row.getCell(3).value.richText && row.getCell(3).value.richText.length) {
            value = "";
            row.getCell(3).value.richText.forEach(rText=>{
              value += rText.text;
            })
          }
          if (value && !key.startsWith("Q")) {
            json.translations[key] = this.cleanValue(value);
          }
        }
      });
    }catch(message){
      console.log(message);
    }

    fs.writeFileSync('../../src/locale/'+outputFileName, JSON.stringify(json, null, "\t"), 'utf8');
    console.log("write file for " + outputFileName);
  }

  public async readJsonFile(path) {
    const file = await readFile(path, "utf8");
    return JSON.parse(file);
  }

  private cleanValue(value:string){
    const re1 = new RegExp("{\\$([A-Z])\\w+\\s}", "g");
    const re2 = new RegExp("{\\s\\$([A-Z])\\w+}", "g");
    const re3 = new RegExp("{\\$\\s([A-Z])\\w+}", "g");
    return value.replace(re1,this.removeSpaces)
                .replace(re2,this.removeSpaces)
                .replace(re3,this.removeSpaces);
  }

  private removeSpaces(value:string){
    const reSpace = new RegExp("\\s", "g");
    console.log("REPLACING "+ value + " to " + value.replace(reSpace,""));
    return value.replace(reSpace,"");
  }

}

new Read().run();
