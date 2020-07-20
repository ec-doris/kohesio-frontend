import {Deserializable} from "./deserializable.model";

export class FiltersApi implements Deserializable{

    public thematic_objectives: [];
    public policy_objective: [];
    public funds: [];
    public programs: [];
    public categoriesOfIntervention: [];
    public regions: [];

    //Static
    public countries: any[];
    public programmingPeriods: any[];
    public totalProjectBudget: any[];
    public amountEUSupport: any[];

    protected static SInit = (() => {
        FiltersApi.prototype.countries = [{
                id:"Q12",
                value:"Denmark"
            },{
                id: "Q13",
                value:"Poland"
            },{
                id:"Q15",
                value:"Italy"
            },{
                id:"Q2",
                value:"Ireland"
            },{
                id:"Q20",
                value:"France"
            },{
                id:"Q25",
                value:"Czech Republic"
        }];
        FiltersApi.prototype.programmingPeriods = [{
            id: '2021-2027',
            value: '2021 - 2027',
        }];
    })();

    deserialize(input: any): this {
        return Object.assign(this, {
            thematic_objectives : this.themes(input.thematic_objectives),
            policy_objective: input.policy_objective,
            funds: input.funds,
            programs: input.programs,
            categoriesOfIntervention: input.categoriesOfIntervention,
            countries: this.countries,
            programmingPeriods: this.programmingPeriods,
            totalProjectBudget: this.totalProjectBudget,
            amountEUSupport: this.amountEUSupport
        });
    }

    private themes(themes){
        if (themes) {
            let i = 1;
            themes.forEach(theme => {
                theme["pk"] = "TO" + String(i).padStart(2, '0');
                ++i;
            })
        }
        return themes;
    }

}
