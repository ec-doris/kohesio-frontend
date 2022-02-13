import {Deserializable} from "./deserializable.model";

export class Theme implements Deserializable{

    public instance!: string;
    public instanceLabel!: string;
    public id!: any;
    public wikibaseId: string | undefined;

    deserialize(input: any): this {
        return Object.assign(this, {
            instance: input.instance,
            instanceLabel: input.instanceLabel,
            id: input.id,
            wikibaseId: input.instance.split("/").pop()
        });
    }

}
