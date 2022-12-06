import {readFile} from "fs/promises";
import fs from "fs";
import * as request from 'supertest';
import {WebSocketDrivein} from "./ws-drivein";
import https from "https";

class ETranslation {

  public REST_URL = "https://analytics-api.cnect.eu/";
  public API_KEY = process.env.DORIS_API_KEY || '';
  public apiUrl = '';

  public async run(keys:string[]) {
    const englishFile =  await this.readJsonFile("../../src/locale/messages.json");
    let textTranslate = "";
    for(let key of keys){
      textTranslate += englishFile.translations[key]+"\n";
    }
    fs.writeFileSync('output/textTranslate.txt', textTranslate, 'utf8');

    const agent = request.agent(this.REST_URL);
    const result = await agent
      .post(this.apiUrl)
      .set("x-api-key", this.API_KEY)
      .send({
        service: "translate",
        parameters: {
          source: "en",
          target: "eu"
        }
      });

    //console.log("RESULTS FROM DRIVEIN=",JSON.parse(result.text));

    const webSocketDrivein = new WebSocketDrivein();
    webSocketDrivein.filePath = "output/textTranslate.txt";
    webSocketDrivein.testWebSocket(JSON.parse(result.text),23).then(wsResults=>{
      const partialResults = wsResults.partialResults;
      const downloadFilePromises: Promise<any>[] = []
      for (let partial of partialResults){
        downloadFilePromises.push(this.downloadFile(partial.downloadLink,partial.language));
      }
      Promise.all(downloadFilePromises).then(async (results)=>{
        const files = fs.readdirSync("output/etranslation/");
        for(let file of files){
          const language = file.replace(".txt","");
          const outputFileName:string = "messages."+language+ ".json";
          const outputJSON =  await this.readJsonFile("../../src/locale/"+outputFileName);
          const lines = await this.readTextFile("output/etranslation/"+file);

          //console.log("OUTPUTJSON=", outputJSON.locale);
          //console.log("LINE=", lines);
          keys.forEach((key, i) => {
            outputJSON.translations[key] = lines[i].trim();
          });
          fs.writeFileSync('../../src/locale/'+outputFileName, JSON.stringify(outputJSON, null, "\t"), 'utf8');
          console.log("SUCCESS FOR LANGUAGE " + language.toUpperCase());
          //console.log("INDEX="+index+" FILES_LENGTH="+files.length);
        }
        process.exit(0);
      });

    }).catch(error=>{
      console.log("ERROR",error);
    });

  }

  public async readJsonFile(path) {
    const file = await readFile(path, "utf8");
    return JSON.parse(file);
  }

  public async readTextFile(path) {
    const file = await readFile(path, "utf8");
    return file.split("\n");
  }

  public async downloadFile(link:string, lang: string):Promise<any>{
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(`output/etranslation/${lang}.txt`);
      https.get(link, (response) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve(true);
        });
      });
    });
  }

}

new ETranslation().run(["comp.message.warning.title","comp.message.noTranslationAvailable"]);
