const ExcelJS = require('exceljs');
const fs = require('fs');

class Read {

  public async run(){
    fs.readdir("files", (err, files) => {
      files.forEach(file => {
        this.processFile(file);
      });
    });
  }

  private async processFile(fileName: string){
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile("files/"+fileName);

    const worksheet = workbook.worksheets[0];

    const json:any = {
      locale: fileName.split("-")[5].toLowerCase(),
      translations: {

      }
    };
    const outputFileName:string = "messages."+ json.locale + ".json";

    /*if (json.locale != "cs"){
      return;
    }*/

    try {
      worksheet.eachRow((row, rowNumber) => {
        if (row && rowNumber > 1) {
          let key: string = row.getCell(2).value;
          if (row.getCell(2).value.richText && row.getCell(2).value.richText.length) {
            key = row.getCell(2).value.richText[0].text;
          }
          let value = row.getCell(3).value;
          if (row.getCell(3).value.richText && row.getCell(3).value.richText.length) {
            value = "";
            row.getCell(3).value.richText.forEach(rText=>{
              value += rText.text;
            })
          }
          json.translations[key] = value;
        }
      });
    }catch(message){
      console.log(message);
    }

    fs.writeFileSync('../../src/locale/'+outputFileName, JSON.stringify(json, null, "\t"), 'utf8');
    console.log("write file for " + outputFileName);
  }

}

new Read().run();
