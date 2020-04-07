import {Deserializable} from "./deserializable.model";

export class Project implements Deserializable{

    public link: string;
    public objectiveId: string;
    public countryCode: string;
    public title: string;
    public startTime: Date;
    public budget: number;
    public description: string;
    public snippet: string;

    deserialize(input: any): this {
        return Object.assign(this, {
            link: input.s0.value,
            objectiveId: input.objectiveId ? input.objectiveId.value : '',
            countryCode: input.countrycode.value,
            title: input.label.value.length > 40 ?
                input.label.value.substring(0, 40) + '...' :
                input.label.value,
            startTime: input.startTime ? input.startTime.value : undefined,
            budget: input.euBudget ? parseFloat(input.euBudget.value) : undefined,
            description: input.description ? input.description.value.length > 500 ?
                input.description.value.substring(0, 500) + '...' :
                input.description.value : '',
            snippet: input.snippet ? input.snippet.value.length > 500 ?
                input.snippet.value.substring(0, 500) + '...' :
                input.snippet.value : ''
        });
    }

    getFullDescription(){
        if (this.snippet){
            return this.snippet;
        }else{
            return this.description;
        }
    }
}
