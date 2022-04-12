const writeXlsxFile = require('write-excel-file/node');
import messages from '../../../src/locale/messages.json'; 

class Write {

    public async run(){
        /*DATA*/
        let data:any = [];
        let index = 1;
        for (const [key, value] of Object.entries(messages.translations)) {
            data.push({
                index: index,
                code: key,
                label: value
            });
            index++;
        }
        /*SCHEMA*/
        const schema = [{
            column: 'Index',
            type: Number,
            align: 'center',
            value: (obj:any) => obj.index
        },{
            column: 'Code',
            type: String,
            color: '#FF0000',
            value: (obj:any) => obj.code
        },{
            column: 'EN',
            type: String,
            value: (obj:any) => obj.label
        }];
        /*WRITING THE FILE*/
        await writeXlsxFile(data, {
            schema,
            filePath: 'output/file.xlsx'
        })
    }

}

new Write().run();