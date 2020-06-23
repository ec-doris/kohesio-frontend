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
    projectWebsite: string;
    programWebsite: string;
    programmingPeriodLabel: string;

    deserialize(input: any): this {
        return Object.assign(this, {
            item: input.item,
            images: input.images,
            countryLabel: input.countryLabel,
            link: input.link,
            categoryLabel: input.categoryLabel,
            coordinates: input.coordinates,
            description: input.description,
            label: input.label,
            cofinancingRate: input.cofinancingRate,
            source: input.source,
            objectiveLabel: input.objectiveLabel,
            beneficiaries: input.beneficiaries,
            startTime: input.startTime,
            euBudget: input.euBudget,
            endTime: input.endTime,
            budget: input.budget,
            programLabel: input.programLabel,
            managingAuthorityLabel: input.managingAuthorityLabel,
            fundLabel: input.fundLabel,
            countryCode: input.countryCode,
            objectiveId: input.objectiveId,
            projectWebsite: input.projectWebsite,
            programWebsite: input.programWebsite,
            programmingPeriodLabel: input.programmingPeriodLabel
        });
    }
}
