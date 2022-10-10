import { Category } from "./category.model";
import {Deserializable} from "./deserializable.model";
import {AutoCompleteItem} from "../components/kohesio/auto-complete/item.model";
export class FiltersApi implements Deserializable{

    public thematic_objectives: [] = [];
    public policy_objectives: [] | undefined;
    public funds: [] | undefined;
    public programs: [] | undefined;
    public categoriesOfIntervention: AutoCompleteItem[] = [];
    public regions: [] | undefined;
    public nuts3: AutoCompleteItem[] = [];


    //Static
    public countries: any[] | undefined;
    public programmingPeriods: any[] | undefined;
    public totalProjectBudget: any[] | undefined;
    public amountEUSupport: any[] | undefined;
    public sort: any[] | undefined;
    public sortBeneficiaries: any[] | undefined;
    public beneficiaryType: any[] | undefined;
    public interreg:any[] | undefined;

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
            value: $localize`:@@translate.filter.sortProjects.relevance:Relevance`
        },{
            id: 'orderStartDate-true',
            value: $localize`:@@translate.filter.sortProjects.orderStartDateAsc:Start Date (ascending)`
        },{
            id: 'orderStartDate-false',
            value: $localize`:@@translate.filter.sortProjects.orderStartDateDesc:Start Date (descending)`
        },{
           id: 'orderEndDate-true',
           value: $localize`:@@translate.filter.sortProjects.orderEndDateAsc:End Date (ascending)`
        },{
            id: 'orderEndDate-false',
            value: $localize`:@@translate.filter.sortProjects.orderEndDateDesc:End Date (descending)`
        },{
            id: 'orderTotalBudget-true',
            value: $localize`:@@translate.filter.sortProjects.orderTotalBudgetAsc:Total Budget (ascending)`
        },{
            id: 'orderTotalBudget-false',
            value: $localize`:@@translate.filter.sortProjects.orderTotalBudgetDesc:Total Budget (descending)`
        }];
        FiltersApi.prototype.sortBeneficiaries = [{
            id: 'orderNumProjects-true',
            value: $localize`:@@translate.filter.sortBeneficiaries.numProjectsAsc:Number of Projects (ascending)`
        },{
            id: 'orderNumProjects-false',
            value: $localize`:@@translate.filter.sortBeneficiaries.numProjectsDesc:Number of Projects (descending)`
        },{
            id: 'orderEuBudget-true',
            value: $localize`:@@translate.filter.sortBeneficiaries.euContributionAsc:EU Contribution (ascending)`
        },{
          id: 'orderEuBudget-false',
            value: $localize`:@@translate.filter.sortBeneficiaries.euContributionDesc:EU Contribution (descending)`
        },{
            id: 'orderTotalBudget-true',
            value: $localize`:@@translate.filter.sortBeneficiaries.totalBudgetAsc:Total Budget (ascending)`
        },{
            id: null,
            value: $localize`:@@translate.filter.sortBeneficiaries.totalBudgetDesc:Total Budget (descending)`
        }];
        FiltersApi.prototype.beneficiaryType = [{
            id: 'public',
            value: $localize`:@@translate.filter.beneficiaryType.public:Public`,
        },{
            id: 'private',
            value: $localize`:@@translate.filter.beneficiaryType.private:Private`,
        }];
        FiltersApi.prototype.interreg = [{
          id: 'true',
          value: $localize`:@@translate.filter.interreg.interreg:Interreg`
        },{
          id: 'false',
          value: $localize`:@@translate.filter.interreg.investGrowthJobs:Investment in Growth and Jobs`
        }];
    })();

    deserialize(input: any): this {
        return Object.assign(this, {
            thematic_objectives : this.themes(input.thematic_objectives),
            policy_objectives: input.policy_objectives,
            funds: input.funds,
            programs: input.programs,
            categoriesOfIntervention: this.createGroupsOfInterventionField(input.categoriesOfIntervention),
            countries: input.countries,
            nuts3: this.normalizeNuts3(input.nuts3),
            programmingPeriods: this.programmingPeriods,
            totalProjectBudget: this.totalProjectBudget,
            amountEUSupport: this.amountEUSupport,
            interreg: this.interreg
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

    private createGroupsOfInterventionField(categoriesOfIntervention:any): AutoCompleteItem[]{
      const list:AutoCompleteItem[] = [];
      if (categoriesOfIntervention){
          categoriesOfIntervention.forEach((cat:any)=>{
            const subItems:AutoCompleteItem[] = [];
            cat.options.forEach((option:any)=>{
              subItems.push({
                id:this.cleanId(option.instance),
                label: option.instanceLabel.length > 100 ?
                  option.instanceLabel.substring(0,100) + '...' : option.instanceLabel,
                shortValue: option.instanceLabel.split("-")[0].trim()
              })
            })
            list.push({
                label: cat.areaOfInterventionLabel,
                subItems: subItems
            });
          });
      }
      return list;
    }

    private normalizeNuts3(nuts3:any): AutoCompleteItem[]{
      const list:AutoCompleteItem[] = [];
      if (nuts3){
        nuts3.forEach((n3:any)=>{
          list.push({
            id:n3.id,
            label: n3.value.length > 100 ?
              n3.value.substring(0,100) + '...' : n3.value,
            shortValue: n3.value
          })
        })
      }
      return list;
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

    private cleanId(id:string): string | undefined{
        if (id){
        return id.replace("https://linkedopendata.eu/entity/", "")
            .replace("fund=", "")
            .replace("to=", "")
            .replace("program=", "")
            .replace("instance=", "");
        }else{
            return undefined
        }
    }

}
