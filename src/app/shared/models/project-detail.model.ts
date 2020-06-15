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
    beneficiaries: [any];
    startTime: Date;
    euBudget: string;
    endTime: Date;
    budget: string;
    programLabel: string;
    managingAuthorityLabel: string;
    fundLabel: string;
    countryCode: string;
    objectiveId: string;

    deserialize(input: any): this {
        return Object.assign(this, input);
    }
}
