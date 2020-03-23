import {Deserializable} from "./deserializable.model";

export class Project implements Deserializable{

    public link: string;
    public objectiveId: string;
    public countryCode: string;
    public title: string;
    public startTime: Date;
    public budget: number;
    public description: string;

    deserialize(input: any): this {
        return Object.assign(this, {
            link: input.s0.value,
            objectiveId: input.objectiveId.value,
            countryCode: input.countrycode.value,
            title: input.label.value.length > 60 ?
                input.label.value.substring(0, 60) + '...' :
                input.label.value,
            startTime: input.startTime.value,
            budget: parseFloat(input.euBudget.value),
            description: input.description.value.length > 500 ?
                input.description.value.substring(0, 500) + '...' :
                input.description.value
        });
    }
}
