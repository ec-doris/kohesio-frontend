import {Deserializable} from "./deserializable.model";

export class Filters implements Deserializable{

    public keywords:String;
    public name:String;
    public country: String;
    public region: String;
    public theme: String;

    deserialize(input: any): this {
        return Object.assign(this, {
            keywords: input.keywords ? input.keywords : undefined,
            country: input.country ? input.country : undefined,
            region: input.region ? input.region : undefined,
            theme: input.theme ? input.theme : undefined,
            name: input.name ? input.name : undefined,
        });
    }
}
