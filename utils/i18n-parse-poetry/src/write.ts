const writeXlsxFile = require('write-excel-file/node');

class Write {

    public async run(){
        const data = [
            // Row #1
            [
              // Column #1
              {
                value: 'Name',
              }
            ],
            // Row #2
            [
              // Column #1
              {
                value: 'John Smith'
              }
            ]
        ];

        await writeXlsxFile(data, {
            filePath: 'output/file.xlsx'
          })
    }

}

new Write().run();