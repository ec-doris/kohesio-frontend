
import { environment } from "src/environments/environment";
import {Deserializable} from "./deserializable.model";

export class BeneficiaryProjectList implements Deserializable{

    item: string | undefined;
    projects: [] | undefined;

    deserialize(input: any): this {
        return Object.assign(this, {
            item: input.item,
            projects: this.deserializeProjects(input.projects),
        });
    }

    private deserializeProjects(projects: []){
        let result:any = [];
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