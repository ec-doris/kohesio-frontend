import {Deserializable} from "./deserializable.model";

export class ProjectDetail implements Deserializable{

    public item: string;
    public images: [];
    countryLabel: string;
    link: string;
    categoryLabel: string;
    coordinates: [string];
    description: string;
    label: string;
    cofinancingRate: number;
    source: string;
    objectiveLabel: string;
    beneficiaries: [any];
    startTime: Date;
    euBudget: string;
    endTime: Date;
    budget: string;
    programLabel: string;
    managingAuthorityLabel: string;
    fundLabel: string;
    countryCode: string;
    objectiveId: string;
    projectWebsite: string;
    programWebsite: string;
    programmingPeriodLabel: string;
    region: string;
    regionText: string;
    geoJson: any;

    deserialize(input: any): this {
        return Object.assign(this, {
            item: input.item,
            images: input.images,
            countryLabel: input.countryLabel,
            link: input.link,
            categoryLabel: input.categoryLabel,
            coordinates: input.coordinates,
            description: input.description,
            label: input.label,
            cofinancingRate: input.cofinancingRate ? parseFloat(input.cofinancingRate) : 0,
            source: input.source,
            objectiveLabel: input.objectiveLabel,
            beneficiaries: input.beneficiaries,
            startTime: input.startTime ? new Date(input.startTime) : undefined,
            euBudget: input.euBudget,
            endTime: input.endTime ? new Date(input.endTime) : undefined,
            budget: input.budget,
            programLabel: input.programLabel,
            managingAuthorityLabel: input.managingAuthorityLabel,
            fundLabel: input.fundLabel,
            countryCode: input.countryCode,
            objectiveId: input.objectiveId,
            projectWebsite: input.projectWebsite,
            programWebsite: input.programWebsite,
            programmingPeriodLabel: input.programmingPeriodLabel,
            region: this.getRegion(input),
            regionText: input.regionText,
            geoJson: input.geoJson ? this.parseJSON(input.geoJson) : null
        });
    }

    parseJSON(json){
        if (Array.isArray(json)){
            const resultArray = [];
            json.forEach(geoJson=>{
                const validJSON = geoJson.replace(/'/g, '"');    
                resultArray.push(JSON.parse(validJSON))
            });
            return resultArray;
        }else{
            const validJSON = json.replace(/'/g, '"');
            return JSON.parse(validJSON);
        }
    }

    getRegion(input){
        let region = "";
        if (input.region){
            region = input.region.trim()
        }
        if (input.regionUpper1 &&
            input.regionUpper1.toUpperCase() != input.region.toUpperCase()){

            region += ", " + input.regionUpper1.trim()
        }
        if (input.regionUpper2 &&
            input.regionUpper2 != input.region.toUpperCase() &&
            input.regionUpper2.toUpperCase() != input.regionUpper1.toUpperCase()){

            region += ", " + input.regionUpper2.trim()
        }
        if (input.regionUpper3 &&
            input.regionUpper3 != input.region.toUpperCase() &&
            input.regionUpper3.toUpperCase() != input.regionUpper2.toUpperCase() &&
            input.regionUpper3.toUpperCase() != input.regionUpper1.toUpperCase()){

            region += ", " + input.regionUpper3.trim()
        }
        return region;
    }

}
