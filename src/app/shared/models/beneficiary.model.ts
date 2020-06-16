import {Deserializable} from "./deserializable.model";

export class Beneficiary implements Deserializable{


    deserialize(input: any): this {
        return Object.assign(this, input);
    }
}
