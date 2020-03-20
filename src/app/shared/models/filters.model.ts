import {Deserializable} from "./deserializable.model";

export class Filters implements Deserializable{

    public countries: Array<string>;
    public topics: Array<string>;

    deserialize(input: any): this {
        return Object.assign(this, {
            countries: input.countries ? input.countries.map(country => {
                return country.id;
            }) : undefined,
            topics: input.topics ? input.topics.map(topic => {
                return topic.id;
            }) : undefined
        });
    }
}
