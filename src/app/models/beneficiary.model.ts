import { environment } from "src/environments/environment";
import {Deserializable} from "./deserializable.model";


export class Beneficiary implements Deserializable{

    budget: number | undefined;
    cofinancingRate: number | undefined;
    country: string | undefined;
    countryCode: string | undefined;
    countryName: string | undefined;
    euBudget: number | undefined;
    id: number | undefined;
    label: string | undefined;
    link: string | undefined;
    numberProjects: number | undefined;
    transliteration: string | undefined;


    deserialize(input: any): this {
        return Object.assign(this, {
            budget: input.budget,
            cofinancingRate: input.cofinancingRate,
            country: input.country,
            countryCode: input.countryCode,
            countryName: input.countryName,
            euBudget: input.euBudget,
            id: input.id.replace(environment.entityURL,""),
            label: input.label,
            link: input.link,
            numberProjects: input.numberProjects,
            transliteration: input.transliteration
        });
    }
}
