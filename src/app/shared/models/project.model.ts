import {Deserializable} from "./deserializable.model";

export class Project implements Deserializable{

    public link: string;
    public objectiveId: string;
    public countryCode: string;
    public title: string;
    public startTime: Date;
    public endTime: Date;
    public budget: number;
    public description: string;
    public snippet: string;
    public item: string;
    public coordinates: string[];
    public images: string[];

    deserialize(input: any): this {
        return Object.assign(this, {
            item: input.item,
            link: input.link,
            objectiveId: this.getValueFromPropertyArray(input.objectiveIds),
            countryCode: this.getValueFromPropertyArray(input.countrycode),
            title: this.getValueFromPropertyArray(input.labels, 500),
            startTime: this.getDateFromPropertyArray(input.startTimes),
            endTime: this.getDateFromPropertyArray(input.endTimes),
            budget: this.getBudget(input.euBudgets),
            description: this.getValueFromPropertyArray(input.descriptions, 250),
            snippet: this.getValueFromPropertyArray(input.snippet, 500),
            coordinates: input.coordinates,
            images: input.images
        });
    }

    getValueFromPropertyArray(array, size=undefined){
        if (Array.isArray(array) && array.length) {
            if (size && array[0].length > size) {
                return array[0].substring(0, size) + '...';
            } else {
                return array[0];
            }
        }else{
            return undefined;
        }
    }

    getDateFromPropertyArray(array){
        const value = this.getValueFromPropertyArray(array);
        return new Date(value);
    }

    getBudget(array){
        let budget = this.getValueFromPropertyArray(array);
        if (budget){
            return budget.replace("+","");
        }else{
            return null;
        }
    }

}
