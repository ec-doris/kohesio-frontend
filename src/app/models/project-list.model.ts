import {Deserializable} from "./deserializable.model";
import {Project} from "./project.model";

export class ProjectList implements Deserializable{

    public list!: Project[];
    public numberResults!: number;
    public similarWords!: String[];

    deserialize(input: any): this {
        const projects: Project[] = input.list.map((prj:any) => {
            return new Project().deserialize(prj);
        });

        return Object.assign(this, {
            list: projects,
            numberResults: input.numberResults,
            similarWords: input.similarWords
        });


    }

}
