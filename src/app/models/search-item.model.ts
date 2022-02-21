import {Deserializable} from "./deserializable.model";

export class SearchList implements Deserializable{

    public items: SearchItem[] | undefined;
    public numberResults!: number;

    deserialize(input: any): this {
        return Object.assign(this, {
            items: input.list,
            numberResults: input.numberResults
        });
    }

}

export class SearchItem implements Deserializable{

    public item!: string;
    public label!: string;
    public country!: string;
    public countryCode!: string;
    public link: string | null | undefined;
    public transliteration: string | null | undefined;
    public type!: string;

    deserialize(input: any): this {
        return Object.assign(this, {
            item: input.item,
            label: input.label,
            country: input.country,
            countryCode: input.countryCode,
            link: input.link,
            transliteration: input.transliteration,
            type: input.type
        });
    }

}
