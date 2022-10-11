import {Deserializable} from "./deserializable.model";

export class Project implements Deserializable{

    public link: string | undefined;
    public objectiveId!: string;
    public countryCode!: string;
    public title!: string;
    public startTime: Date | undefined;
    public endTime: Date | undefined;
    public budget: number | undefined;
    public totalBudget: number | undefined;
    public description: string | undefined;
    public snippet: string | undefined;
    public item: string | undefined;
    public coordinates: string[] | undefined;
    public images: string[] | undefined;
    public labels: string[] | undefined;
    public copyrightImages: string[] | undefined;
    public isHighlighted: boolean | undefined;

    deserialize(input: any): this {
        return Object.assign(this, {
            item: input.item,
            link: input.link,
            objectiveId: this.getValueFromPropertyArray(input.objectiveIds),
            countryCode: this.getCountryCode(input.countrycode),
            title: this.getValueFromPropertyArray(input.labels, 500),
            startTime: this.getDateFromPropertyArray(input.startTimes),
            endTime: this.getDateFromPropertyArray(input.endTimes),
            budget: this.getBudget(input.euBudgets),
            totalBudget: this.getBudget(input.totalBudgets),
            description: this.getValueFromPropertyArray(input.descriptions, 250),
            snippet: this.getValueFromPropertyArray(input.snippet, 500),
            coordinates: input.coordinates,
            images: input.images,
            labels: input.labels,
            copyrightImages: input.copyrightImages,
            isHighlighted: input.isHighlighted
        });
    }

    getCountryCode(array: any){
        if (Array.isArray(array) && array.length && array.length > 1) {
            return "EU";
        }else{
            return this.getValueFromPropertyArray(array);
        }
    }

    getValueFromPropertyArray(array:any, size=0){
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

    getDateFromPropertyArray(array:any){
        const value = this.getValueFromPropertyArray(array);
        if (value){
            return new Date(value);
        }else{
            return undefined
        }
    }

    getBudget(array:any){
        let budget = this.getValueFromPropertyArray(array);
        if (budget){
            return budget.replace("+","");
        }else{
            return null;
        }
    }

}
