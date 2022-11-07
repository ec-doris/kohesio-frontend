import {Delta} from "./delta";

const ExcelJS = require('exceljs');
//import messages from '../../../src/locale/messages.json';

class Write {

    public async run(translations: any){

        /*DATA*/
        let data:any = [];
        let index = 1;
        for (const [key, value] of Object.entries(translations)) {
            data.push({
                index: index,
                code: key,
                label: {
                    richText: this.parseLabel(value)
                },
                link: this.mapLink(key)
            });
            index++;
        }

        /*WRITING THE FILE*/
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Translations');
        worksheet.columns = [
            { header: 'Index', key: 'index', width: 10 },
            { header: 'Code', key: 'code', width: 32, style: { font: { color: { argb: 'FFFF0000' } } }},
            { header: 'EN', key: 'label', width: 100 },
            { header: 'Link', key: 'link', width: 50 }
        ];
        worksheet.addRows(data);
        await workbook.xlsx.writeFile("output/translations.xlsx");
    }

    private parseLabel(label:any):any[]{
      console.log("LABEL="+label);
        let richText = [];
        const splitLabel:string[] = label.split(/({\$[^}]+})/g);
        if (label.trim().startsWith("{VAR_PLURAL")){
            const pluralSplit = label.split(/({[^{}]+})/g);
            pluralSplit.forEach((portion:string)=>{
                if (portion.startsWith("{") && portion.endsWith("}")){
                    richText.push(this.redPortion("{"));
                    richText.push(this.normalPortion(portion.replace("{","").replace("}","")));
                    richText.push(this.redPortion("}"));
                }else{
                    richText.push(this.redPortion(portion));
                }
            });
        }else if (splitLabel.length > 1){
            splitLabel.forEach(portion=>{
                if (portion!=""){
                    const rT = portion.startsWith("{$") ? this.redPortion(portion) : this.normalPortion(portion)
                    richText.push(rT);
                }
            });
        }else{
            richText.push({
                text:label
            });
        }
        return richText;
    }

    private redPortion(label:string):any{
        return {
            text: label,
            font: {'color': {'argb': 'FFFF0000'}}
        }
    }

    private normalPortion(label:string):any{
        return {
            text: label,
            font: {'color': {'argb': 'FF000000'}}
        }
    }


    private componentLinkMap:any = {
        "download-button":"/projects"
    }

    private mapLink(code:string):string{
        let link = "https://kohesio.ec.europa.eu"
        if (code.startsWith("page") && !code.startsWith("page.home")
            && !code.startsWith("page.project-detail")
            && !code.startsWith("page.beneficiary-detail")){
            link += "/" + code.split(".")[1];
        }else if(code.startsWith("page.beneficiary-detail")){
            link += "/projects/Q100952"
        }else if(code.startsWith("page.project-detail")){
            link += "/beneficiaries/Q2514974"
        }else if(code.startsWith("comp")){
            const comp = code.split(".")[1];
            if(this.componentLinkMap[comp]){
                link += this.componentLinkMap[comp];
            }
        }
        return link;
    }

}

const deltaTranslations = new Delta().run();
new Write().run(deltaTranslations.translations);
