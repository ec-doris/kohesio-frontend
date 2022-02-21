import {Deserializable} from "./deserializable.model";

export class FiltersApi implements Deserializable{

    public thematic_objectives: [] = [];
    public policy_objective: [] | undefined;
    public funds: [] | undefined;
    public programs: [] | undefined;
    public categoriesOfIntervention: [] | undefined;
    public regions: [] | undefined;


    //Static
    public countries: any[] | undefined;
    public programmingPeriods: any[] | undefined;
    public totalProjectBudget: any[] | undefined;
    public amountEUSupport: any[] | undefined;
    public sort: any[] | undefined;
    public sortBeneficiaries: any[] | undefined;
    public beneficiaryType: any[] | undefined;

    protected static SInit = (() => {
        FiltersApi.prototype.programmingPeriods = [{
            id: '2014-2020',
            value: '2014 - 2020',
        },{
            id: '2021-2027',
            value: '2021 - 2027',
        }];
        FiltersApi.prototype.totalProjectBudget = [{
            id: '0-1000',
            value: '0 - 1 000',
        },{
            id: '1000-10000',
            value: '1 000 - 10 000',
        },{
            id: '10000-100000',
            value: '10 000 - 100 000',
        },{
            id: '100000-1000000',
            value: '100 000 - 1 000 000',
        },{
            id: '1000000-10000000',
            value: '1 000 000 - 10 000 000',
        },{
            id: '10000000-100000000',
            value: '10 000 000 - 100 000 000',
        },{
            id: '100000000-1000000000',
            value: '100 000 000 - 1 000 000 000',
        },{
            id: '1000000000-10000000000',
            value: '1 000 000 000 - 10 000 000 000'
        }];
        FiltersApi.prototype.amountEUSupport = FiltersApi.prototype.totalProjectBudget;
        FiltersApi.prototype.sort = [
        {
            id: null,
            value: 'Relevance'
        },{
            id: 'orderStartDate-true',
            value: 'Start Date (ascending)'
        },{
            id: 'orderStartDate-false',
            value: 'Start Date (descending)'
        },{
           id: 'orderEndDate-true',
           value: 'End Date (ascending)'
        },{
            id: 'orderEndDate-false',
            value: 'End Date (descending)'
        },{
            id: 'orderTotalBudget-true',
            value: 'Total Budget (ascending)'
        },{
            id: 'orderTotalBudget-false',
            value: 'Total Budget (descending)'
        }];
        FiltersApi.prototype.sortBeneficiaries = [{
            id: 'orderNumProjects-true',
            value: 'Number of Projects (ascending)'
        },{
            id: 'orderNumProjects-false',
            value: 'Number of Projects (descending)'
        },{
            id: 'orderEuBudget-true',
            value: 'EU Contribution (ascending)'
        },{
            id: null,
            value: 'EU Contribution (descending)'
        },{
            id: 'orderTotalBudget-true',
            value: 'Total Budget (ascending)'
        },{
            id: 'orderTotalBudget-false',
            value: 'Total Budget (descending)'
        }];
        FiltersApi.prototype.beneficiaryType = [{
            id: 'public',
            value: 'Public',
        },{
            id: 'private',
            value: 'Private',
        }];
    })();

    deserialize(input: any): this {
        return Object.assign(this, {
            thematic_objectives : this.themes(input.thematic_objectives),
            policy_objective: input.policy_objective,
            funds: input.funds,
            programs: input.programs,
            categoriesOfIntervention: this.createGroupsOfInterventionField(input.categoriesOfIntervention),
            countries: input.countries,
            programmingPeriods: this.programmingPeriods,
            totalProjectBudget: this.totalProjectBudget,
            amountEUSupport: this.amountEUSupport
        });
    }

    private shortString(rawOptions:any){
        const options:any = [];
        rawOptions.forEach((cat:any)=>{
            options.push({
                id: this.cleanId(cat.instance),
                value: cat.instanceLabel.length > 100 ? 
                            cat.instanceLabel.substring(0,100) + '...' : cat.instanceLabel,
                fullValue: cat.instanceLabel,
                shortValue: cat.instanceLabel.split("-")[0].trim()
            });
        });
        return options;
    }

    private createGroupsOfInterventionField(categoriesOfIntervention:any){
        if (categoriesOfIntervention){
            const categories:any = [];
            categoriesOfIntervention.forEach((cat:any)=>{
                categories.push({
                    value: cat.areaOfInterventionLabel,
                    options: this.shortString(cat.options)
                });
            });
            return categories;
        }
    }

    private themes(themes:any){
        if (themes) {
            let i = 1;
            themes.forEach((theme:any) => {
                theme["pk"] = "TO" + String(i).padStart(2, '0');
                ++i;
            })
        }
        return themes;
    }

    private cleanId(id:string){
        if (id){
        return id.replace("https://linkedopendata.eu/entity/", "")
            .replace("fund=", "")
            .replace("to=", "")
            .replace("program=", "")
            .replace("instance=", "");
        }else{
            return null
        }
    }

}
