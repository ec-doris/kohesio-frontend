import {Deserializable} from "./deserializable.model";

export class Program {

  link!:string;
  programInfoRegioUrl!: string;
  programmingPeriodLabel!: string;
  programFullLabel!: string;
  programLabel!: string;
}

export class ProjectDetail implements Deserializable{

    public item: string | undefined;
    public images: any;
    countryLabel!: string;
    link: string | undefined;
    categoryLabels: string[] = [];
    categoryIDs: string[] = [];
    coordinates: [string] | undefined;
    description: string | undefined;
    label: string | undefined;
    cofinancingRate: number | undefined;
    source: string | undefined;
    themeLabels: string[] = [];
    beneficiaries: [] = [];
    startTime: Date | undefined;
    euBudget: string | undefined;
    endTime: Date | undefined;
    budget: string | undefined;
    programLabel: string | undefined;
    programFullLabel: string | undefined;
    managingAuthorityLabel: string | undefined;
    fundLabel: string | undefined;
    countryCode!: string;
    objectiveId: string | undefined;
    themeIds!: [string];
    projectWebsite: string | undefined;
    programWebsite: string | undefined;
    programmingPeriodLabel: string | undefined;
    region: string | undefined;
    regionText: string | undefined;
    geoJson: any | undefined;
    infoRegioUrl: string | undefined;
    keepUrl: string | undefined;
    programInfoRegioUrl: string | undefined;
    videos: string[] = [];
    tweets: string[] = [];
    program: Program[] = [];
    fundWebsite: string | undefined;
    hasSubmitted:boolean = false;
    canEdit:boolean = false;
    canApprove:boolean = false;
    youtubeVideoId!: string ;
    twitterUsername!: string;
    facebookUserId!: string;
    instagramUsername!: string;
    image_url!: string;
    image_description!: string;
    image_copyright!: string;

    deserialize(input: any): this {
        return Object.assign(this, {
            item: input.item,
            images: input.images,
            countryLabel: input.countryLabel,
            link: input.link,
            categoryLabels: input.categoryLabels,
            categoryIDs: input.categoryIDs,
            coordinates: input.coordinates,
            description: input.description,
            label: input.label,
            cofinancingRate: input.cofinancingRate ? parseFloat(input.cofinancingRate) : 0,
            source: input.source,
            themeLabels: input.themeLabels,
            beneficiaries: input.beneficiaries,
            startTime: input.startTime ? new Date(input.startTime) : undefined,
            euBudget: input.euBudget,
            endTime: input.endTime ? new Date(input.endTime) : undefined,
            budget: input.budget,
            programLabel: input.programLabel,
            programFullLabel: input.programFullLabel,
            managingAuthorityLabel: input.managingAuthorityLabel,
            fundLabel: input.funds && input.funds.length ? input.funds[0].label + ' ('+input.funds[0].id + ')' : undefined,
            countryCode: this.getCountryCode(input.countryCode),
            objectiveId: input.objectiveId,
            themeIds: input.themeIds,
            projectWebsite: input.projectWebsite,
            programWebsite: input.programWebsite,
            programmingPeriodLabel: input.programmingPeriodLabel,
            region: this.getRegion(input),
            regionText: this.getRegionText(input),
            geoJson: input.geoJson ? this.parseJSON(input.geoJson) : null,
            infoRegioUrl: input.infoRegioUrl,
            keepUrl: input.keepUrl,
            programInfoRegioUrl: input.programInfoRegioUrl,
            videos: input.videos,
            tweets: input.tweets,
            program: input.program,
            fundWebsite: input.funds && input.funds.length ? input.funds[0].website : undefined,
            hasSubmitted: input.hasSubmitted,
            canEdit: input.canEdit,
            canApprove: input.canApprove,
            youtubeVideoId: input.youtubeVideoId,
            twitterUsername: input.twitterUsername,
            facebookUserId: input.facebookUserid,
            instagramUsername: input.instagramUsername,
            image_url: input.image_url,
            image_description: input.image_description,
            image_copyright: input.image_copyright
        });
    }

    getRegionText(input:any){
      if (input.countryCode.length > 1){
        const multipleLocation = $localize`:@@page.project-detail.label.multipleLocations:Multiple locations`
        return multipleLocation + ", " + input.countryLabel.join(", ");
      }else{
        return input.regionText;
      }
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

    getCountryCode(array: any){
        if (Array.isArray(array) && array.length && array.length > 1) {
            return "EU";
        }else{
            return array[0];
        }
    }

    youtube_parser(url:string): string | undefined{
      const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = url.match(regExp);
      return (match&&match[7].length==11)? match[7] : undefined;
    }

}
