const fs = require('fs');
import messages_new from '../../../src/locale/messages.json';
import messages_old from '../messages_old_commit_04_10_2023.json';

export class Delta {

    public run(){
        let data:any = {
          locale: "en",
          translations: {}
        };
        for (const [keyNew, valueNew] of Object.entries(messages_new.translations)) {
          let found:boolean = false;
          for (const [keyOld, valueOld] of Object.entries(messages_old.translations)) {
            if (keyNew == keyOld){
              found = true;
              if (valueNew != valueOld){
                data.translations[keyNew] = valueNew;
                found = true;
                break;
              }
            }
          }
          if (!found){
            data.translations[keyNew] = valueNew;
          }
        }
        fs.writeFileSync('output/delta.json', JSON.stringify(data, null, "\t"), 'utf8');
        return data;
    }

}

new Delta().run();
