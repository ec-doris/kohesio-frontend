import {Deserializable} from "./deserializable.model";

export class ProjectDetail implements Deserializable{

    public item: string;
    public images: [];
    countryLabel: string;
    link: string;
    categoryLabel: string;
    coordinates: [];
    description: string;
    label: string;
    cofinancingRate: string;
    source: string;
    objectiveLabel: string;
    beneficiariesNames: [];
    startTime: Date;
    euBudget: string;
    endTime: Date;
    beneficiariesName: [];
    budget: string;
    programLabel: string;

    deserialize(input: any): this {
        return Object.assign(this, input);
    }
}
