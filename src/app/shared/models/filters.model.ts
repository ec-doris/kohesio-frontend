import {Deserializable} from "./deserializable.model";

export class Filters implements Deserializable{

    public term:String;
    public country: String;
    public topic: String;

    deserialize(input: any): this {
        return Object.assign(this, {
            country: input.countries ? input.countries : undefined,
            topic: input.topics ? input.topics : undefined,
            term: input.term ? input.term : undefined
        });
    }
}
