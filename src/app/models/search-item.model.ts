import {Deserializable} from "./deserializable.model";
import {TranslateService} from "../services/translate.service";

export class SearchList implements Deserializable{

    public items: SearchItem[] | undefined;
    public numberResults!: number;

    constructor(public translateService: TranslateService) {
    }

    deserialize(input: any): this {

        const items: SearchItem[] = input.list.map((prj:SearchItem) => {
            return new SearchItem(this.translateService).deserialize(prj);
        });

        return Object.assign(this, {
            items: items,
            numberResults: input.numberResults
        });
    }

}

export class SearchItem implements Deserializable{

    public item!: string;
    public label!: string;
    public country!: string;
    public countryCode!: string;
    public countryLabel!: string;
    public link: string | null | undefined;
    public transliteration: string | null | undefined;
    public type!: string;
    public image: string | null | undefined;
    public imageCopyright: string | null | undefined;
    public imageSummary: string | null | undefined;
    public summary: string | null | undefined;
    public typeLabel!:string;

    constructor(public translateService: TranslateService) {
    }

    deserialize(input: any): this {
        return Object.assign(this, {
            item: input.item,
            label: input.label,
            country: input.country,
            countryCode: input.countryCode,
            countryLabel: input.countryLabel,
            link: input.link,
            transliteration: input.transliteration,
            type: input.type,
            image: input.image,
            imageCopyright: input.imageCopyright,
            imageSummary: input.imageSummary,
            summary: input.summary,
            typeLabel:input.typeLabel
        });
    }

    get routerLink(): string[]{
        if (this.typeid == "Q9934"){
            return ['/' + this.translateService.routes.projects + '/' + this.id];
        }else if(this.typeid == "Q196899"){
            return ['/' + this.translateService.routes.beneficiaries + '/' + this.id];
        }
        return [];
    }

    get typeid(): string | undefined{
        return this.type.split("/").pop();
    }

    get id(): string | undefined{
        return this.item.split("/").pop();
    }

    get description(): string{
        if (this.summary && this.summary.length > 250){
            return this.summary.substring(0,250) + '...';
        }else if (this.summary){
            return this.summary;
        }else{
            return "";
        }
    }

    get typeLabelTransform(){
        if (this.typeLabel.toLowerCase() == "beneficiary"){
            return "Beneficiary";
        }else if(this.typeLabel.toLowerCase() == "kohesio project"){
            return "Project";
        }else{
            return this.typeLabel;
        }
    }

    get imageSrc():string{
      if (this.image){
        return this.image;
      }else {
        let image="";
        if (this.typeid == "Q9934"){
          image = "project.jpg";
        }else if(this.typeid == "Q196899"){
          image = "beneficiary.jpg"
        }
        return `assets/images/cards/${image}`
      }
    }

}
