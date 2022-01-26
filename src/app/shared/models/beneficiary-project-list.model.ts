import {Deserializable} from "./deserializable.model";
import {environment} from "../../../environments/environment";

export class BeneficiaryProjectList implements Deserializable{

    item: string;
    projects: [];

    deserialize(input: any): this {
        return Object.assign(this, {
            item: input.item,
            projects: this.deserializeProjects(input.projects),
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
