import {Deserializable} from "./deserializable.model";

export class ProjectDetail implements Deserializable{

    public item: string | undefined;
    public images!: [];
    countryLabel!: string;
    link: string | undefined;
    categoryLabels: string[] = [];
    coordinates: [string] | undefined;
    description: string | undefined;
    label: string | undefined;
    cofinancingRate: number | undefined;
    source: string | undefined;
    objectiveLabels: string[] = [];
    beneficiaries: [] = [];
    startTime: Date | undefined;
    euBudget: string | undefined;
    endTime: Date | undefined;
    budget: string | undefined;
    programLabel: string | undefined;
    managingAuthorityLabel: string | undefined;
    fundLabel: string | undefined;
    countryCode!: string;
    objectiveId: string | undefined;
    objectiveIds!: [string];
    projectWebsite: string | undefined;
    programWebsite: string | undefined;
    programmingPeriodLabel: string | undefined;
    region: string | undefined;
    regionText: string | undefined;
    geoJson: any | undefined;
    infoRegioUrl: string | undefined;
    programInfoRegioUrl: string | undefined;

    deserialize(input: any): this {
        return Object.assign(this, {
            item: input.item,
            images: input.images,
            countryLabel: input.countryLabel,
            link: input.link,
            categoryLabels: input.categoryLabels,
            coordinates: input.coordinates,
            description: input.description,
            label: input.label,
            cofinancingRate: input.cofinancingRate ? parseFloat(input.cofinancingRate) : 0,
            source: input.source,
            objectiveLabels: input.objectiveLabels,
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
            objectiveIds: input.objectiveIds,
            projectWebsite: input.projectWebsite,
            programWebsite: input.programWebsite,
            programmingPeriodLabel: input.programmingPeriodLabel,
            region: this.getRegion(input),
            regionText: input.regionText,
            geoJson: input.geoJson ? this.parseJSON(input.geoJson) : null,
            infoRegioUrl: input.infoRegioUrl,
            programInfoRegioUrl: input.programInfoRegioUrl
        });
    }

    parseJSON(json: any){
        if (Array.isArray(json)){
            const resultArray:any = [];
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

    getRegion(input: any){
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
