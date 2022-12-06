import * as request from 'supertest';
import * as fs from 'fs';
const WebSocket = require('ws');
const mime = require('mime');
const https = require('https');

export class WebSocketDrivein {

    public ws: any = new WebSocket("wss://analytics-ws.cnect.eu");
    private _filePath: string = "test_files/file.txt";
    private partialResults = [];

    constructor(){
    }

    public testWebSocket(body: any, totalPartialResults: number): Promise<any>{
        return new Promise((resolve, reject) => {
            this.ws.on('message', async (data: any) => {
                const result = JSON.parse(data);
                //console.log("Message Received =", result);

                switch(result.type){
                    case "file-received":
                    case "processing-status":
                    case "processing":
                      break;

                    case "process-watch":
                        //Uploading the file to s3
                        const s3UploadResult = await this.sendFileToS3(body);
                        if (s3UploadResult.statusCode != 204 &&
                            s3UploadResult.statusCode != 200){
                            reject(false);
                        }
                        break;
                    case "partial-results":
                        this.partialResults.push(result.message);
                        if (this.partialResults.length == totalPartialResults){
                          resolve({
                            partialResults: this.partialResults,
                            message: "all process were completed"
                          });
                        }
                        break;
                    case "results":
                        resolve({
                          partialResults: this.partialResults,
                          message:result.message
                        });
                        break;
                    default:
                        reject({
                            errorType: result.type,
                            message: result.message
                        });
                        break;
                }
            });

            this.ws.on('open', ()=>{
                this.send(body.process_id);
            });
        });
    }

    public async sendFileToS3(body: any): Promise<any> {
        return await request.agent(body.signed_url)
            .put('')
            .set('content-type',mime.getType(this._filePath))
            .send(fs.readFileSync(this._filePath, {encoding: null}));
    }

    public close(){
        this.ws.close();
    }

    public send(processId: string){
        this.ws.send(JSON.stringify({
            action: "process",
            data:processId
        }));
    }

    public set filePath(filePath:string){
        this._filePath = filePath;
    }

}
