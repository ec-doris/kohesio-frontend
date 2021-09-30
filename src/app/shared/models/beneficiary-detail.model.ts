import {Deserializable} from "./deserializable.model";
import {environment} from "../../../environments/environment";

export class BeneficiaryDetail implements Deserializable{

    beneficiaryLabel: string;
    country: string;
    countryCode: string;
    images: string[];
    item: string;
    maxEndTime: Date;
    minStartTime: Date;
    numberProjects: number;
    projects: [];
    totalBudget: number;
    totalEuBudget: number;
    website: string;
    description: string;
    coordinates: string;
    budgetsPerFund: [{
        fundLabel: string;
        totalEuBudget: number;
    }]


    deserialize(input: any): this {
        return Object.assign(this, {
            beneficiaryLabel: input.beneficiaryLabel,
            country: input.country,
            countryCode: input.countryCode,
            images: input.images,
            item: input.item,
            maxEndTime: new Date(input.maxEndTime),
            minStartTime: new Date(input.minStartTime),
            numberProjects: input.numberProjects,
            projects: this.deserializeProjects(input.projects),
            totalBudget: input.totalBudget,
            totalEuBudget: input.totalEuBudget,
            website: input.website,
            description: input.description,
            coordinates: input.coordinates,
            budgetsPerFund: input.budgetsPerFund
        });
    }

    private deserializeProjects(projects: []){
        let result = [];
        if (projects && projects.length){
            projects.forEach((project:any)=>{
               result.push({
                   id: project.project.replace(environment.entityURL, ""),
                   label: project.label,
                   budget: project.budget,
                   euBudget: project.euBudget,
                   fundLabel: project.fundLabel
                });
            });
        }

        return result;
    }
}
