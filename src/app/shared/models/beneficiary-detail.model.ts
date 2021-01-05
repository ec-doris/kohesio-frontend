import {Deserializable} from "./deserializable.model";
import {environment} from "../../../environments/environment";

export class BeneficiaryDetail implements Deserializable{

    beneficiaryLabel: string;
    country: string;
    images: string[];
    item: string;
    maxEndTime: Date;
    minStartTime: Date;
    numberProjects: number;
    projects: [];
    totalBudget: number;
    totalEuBudget: number;
    website: string;


    deserialize(input: any): this {
        return Object.assign(this, {
            beneficiaryLabel: input.beneficiaryLabel,
            country: input.country,
            images: input.images,
            item: input.item,
            maxEndTime: new Date(input.maxEndTime),
            minStartTime: new Date(input.minStartTime),
            numberProjects: input.numberProjects,
            projects: this.deserializeProjects(input.projects),
            totalBudget: input.totalBudget,
            totalEuBudget: input.totalEuBudget,
            website: input.website
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
                   euBudget: project.euBudget
                });
            });
        }

        return result;
    }
}
