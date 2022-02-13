import {Deserializable} from "./deserializable.model";
import {Beneficiary} from "./beneficiary.model";

export class BeneficiaryList implements Deserializable{

    public list: Beneficiary[] | undefined;
    public numberResults!: number;

    deserialize(input: any): this {
        const beneficiaries: Beneficiary[] = input.list.map((prj:any) => {
            return new Beneficiary().deserialize(prj);
        });

        return Object.assign(this, {
            list: beneficiaries,
            numberResults: input.numberResults
        });


    }

}
