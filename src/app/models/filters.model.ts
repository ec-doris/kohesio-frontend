import { environment } from "src/environments/environment";
import {Deserializable} from "./deserializable.model";

export class Filters implements Deserializable{

    public language: string = "en";
    public keywords: string | undefined;
    public name: string | undefined;
    public country: string = "";
    public region: string | undefined;
    public theme: string | undefined;
    public policyObjective: string | undefined;
    public fund: string | undefined;
    public program: string | undefined;
    public interventionField: string | undefined;
    public budgetSmallerThan: number | undefined;
    public budgetBiggerThan: number | undefined;
    public budgetEUSmallerThan: number | undefined;
    public budgetEUBiggerThan: number | undefined;
    public startDateAfter: string | undefined;
    public endDateBefore: string | undefined;
    public orderStartDate: boolean | undefined;
    public orderEndDate: boolean | undefined;
    public orderEuBudget: boolean | undefined;
    public orderTotalBudget: boolean | undefined;
    public orderNumProjects: boolean | undefined;
    public beneficiaryType: string | undefined;
    public interreg: string | undefined;
    public nuts3: string | undefined;
    public cci: string | undefined;
    public priority_axis: string | undefined;

    deserialize(input: any): this {

        let totalProjectBudget = null;
        if(input.totalProjectBudget) {
            totalProjectBudget = input.totalProjectBudget.split("-");
        }

        let amountEUSupport = null;
        if(input.amountEUSupport) {
            amountEUSupport = input.amountEUSupport.split("-");
        }

        return Object.assign(this, {
            keywords: input.keywords ? input.keywords.trim() : undefined,
            country: input.country ? input.country : undefined,
            region: input.region ? input.region : undefined,
            theme: input.theme ? input.theme : undefined,
            name: input.name ? input.name : undefined,
            policyObjective: input.policyObjective ? input.policyObjective : undefined,
            fund: input.fund ? input.fund : undefined,
            program: input.program ? input.program : undefined,
            interventionField: input.interventionField ? input.interventionField : undefined,
            budgetSmallerThan: input.totalProjectBudget ? totalProjectBudget[1] : undefined,
            budgetBiggerThan: input.totalProjectBudget ? totalProjectBudget[0] : undefined,
            budgetEUSmallerThan: input.amountEUSupport ? amountEUSupport[1] : undefined,
            budgetEUBiggerThan: input.amountEUSupport ? amountEUSupport[0] : undefined,
            startDateAfter: input.projectStart ? input.projectStart : undefined,
            endDateBefore: input.projectEnd ? input.projectEnd : undefined,
            orderStartDate: this.buildSort("orderStartDate",input.sort),
            orderEndDate:  this.buildSort("orderEndDate",input.sort),
            orderEuBudget:  this.buildSort("orderEuBudget",input.sort),
            orderTotalBudget:  this.buildSort("orderTotalBudget",input.sort),
            orderNumProjects:  this.buildSort("orderNumProjects",input.sort),
            beneficiaryType: input.beneficiaryType ? input.beneficiaryType : undefined,
            interreg: input.interreg ? input.interreg : undefined,
            nuts3: input.nuts3 ? input.nuts3 : undefined,
            cci: input.cci ? input.cci : undefined,
            priority_axis: input.priority_axis ? input.priority_axis : undefined,
        });
    }

    public getProjectsFilters(){
        return {
            ...(this.keywords) && {keywords: this.keywords},
            ...(this.country) && {country: environment.entityURL + this.country},
            ...(this.region) && {region: environment.entityURL + this.region},
            ...(this.theme) && {theme: environment.entityURL + this.theme},
            ...(this.policyObjective) && {policyObjective: environment.entityURL + this.policyObjective},
            ...(this.fund) && {fund: environment.entityURL + this.fund},
            ...(this.program) && {program: environment.entityURL + this.program},
            ...(this.interventionField) && {categoryOfIntervention: environment.entityURL + this.interventionField},
            ...(this.budgetSmallerThan) && {budgetSmallerThan: this.budgetSmallerThan},
            ...(this.budgetBiggerThan) && {budgetBiggerThan: this.budgetBiggerThan},
            ...(this.budgetEUSmallerThan) && {budgetEUSmallerThan: this.budgetEUSmallerThan},
            ...(this.budgetEUBiggerThan) && {budgetEUBiggerThan: this.budgetEUBiggerThan},
            ...(this.startDateAfter) && {startDateAfter: this.startDateAfter},
            ...(this.endDateBefore) && {endDateBefore: this.endDateBefore},
            ...(this.orderStartDate != undefined) && {orderStartDate: this.orderStartDate},
            ...(this.orderEndDate != undefined) && {orderEndDate: this.orderEndDate},
            ...(this.orderEuBudget != undefined) && {orderEuBudget: this.orderEuBudget},
            ...(this.orderTotalBudget != undefined) && {orderTotalBudget: this.orderTotalBudget},
            ...(this.interreg != undefined) && {interreg: this.interreg},
            ...(this.nuts3 != undefined) && {nuts3: environment.entityURL + this.nuts3},
            ...(this.priority_axis != undefined) && {priority_axis: environment.entityURL + this.priority_axis}
        }
    }

    public getMapProjectsFilters(){
        return {
            ...(this.keywords) && {keywords: this.keywords},
            ...(this.country) && {country: environment.entityURL + this.country},
            ...(this.region) && {region: environment.entityURL + this.region},
            ...(this.theme) && {theme: environment.entityURL + this.theme},
            ...(this.policyObjective) && {policyObjective: environment.entityURL + this.policyObjective},
            ...(this.fund) && {fund: environment.entityURL + this.fund},
            ...(this.program) && {program: environment.entityURL + this.program},
            ...(this.interventionField) && {categoryOfIntervention: environment.entityURL + this.interventionField},
            ...(this.budgetSmallerThan) && {budgetSmallerThan: this.budgetSmallerThan},
            ...(this.budgetBiggerThan) && {budgetBiggerThan: this.budgetBiggerThan},
            ...(this.budgetEUSmallerThan) && {budgetEUSmallerThan: this.budgetEUSmallerThan},
            ...(this.budgetEUBiggerThan) && {budgetEUBiggerThan: this.budgetEUBiggerThan},
            ...(this.startDateAfter) && {startDateAfter: this.startDateAfter},
            ...(this.endDateBefore) && {endDateBefore: this.endDateBefore},
            ...(this.interreg != undefined) && {interreg: this.interreg},
            ...(this.nuts3 != undefined) && {nuts3: environment.entityURL + this.nuts3},
            ...(this.cci != undefined) && {cci: this.cci},
            ...(this.priority_axis != undefined) && {priority_axis: environment.entityURL + this.priority_axis}
        }
    }

    public getAssetsFilters(){
        return {
            ...(this.keywords) && {keywords: this.keywords},
            ...(this.country) && {country: environment.entityURL + this.country},
            ...(this.region) && {region: environment.entityURL + this.region},
            ...(this.theme) && {theme: environment.entityURL + this.theme},
            ...(this.policyObjective) && {policyObjective: environment.entityURL + this.policyObjective},
            ...(this.fund) && {fund: environment.entityURL + this.fund},
            ...(this.program) && {program: environment.entityURL + this.program},
            ...(this.interventionField) && {categoryOfIntervention: environment.entityURL + this.interventionField},
            ...(this.budgetSmallerThan) && {budgetSmallerThan: this.budgetSmallerThan},
            ...(this.budgetBiggerThan) && {budgetBiggerThan: this.budgetBiggerThan},
            ...(this.budgetEUSmallerThan) && {budgetEUSmallerThan: this.budgetEUSmallerThan},
            ...(this.budgetEUBiggerThan) && {budgetEUBiggerThan: this.budgetEUBiggerThan},
            ...(this.startDateAfter) && {startDateAfter: this.startDateAfter},
            ...(this.endDateBefore) && {endDateBefore: this.endDateBefore},
            ...(this.interreg != undefined) && {interreg: this.interreg},
            ...(this.nuts3 != undefined) && {nuts3: environment.entityURL + this.nuts3},
            ...(this.priority_axis != undefined) && {priority_axis: environment.entityURL + this.priority_axis}
        }
    }

    public getBeneficiariesFilters(){
        return {
            ...(this.name) && {name: this.name},
            ...(this.country) && {country: environment.entityURL + this.country},
            ...(this.region) && {region: environment.entityURL + this.region},
            ...(this.fund) && {fund: environment.entityURL + this.fund},
            ...(this.program) && {program: environment.entityURL + this.program},
            ...(this.orderNumProjects != undefined) && {orderNumProjects: this.orderNumProjects},
            ...(this.orderEuBudget != undefined) && {orderEuBudget: this.orderEuBudget},
            ...(this.orderTotalBudget != undefined) && {orderTotalBudget: this.orderTotalBudget},
            ...(this.beneficiaryType != undefined) && {beneficiaryType: this.beneficiaryType},
        }
    }

    private buildSort(column:any, value:string){
        if (value) {
            const orderColumn = value.split("-")[0];
            if (orderColumn == column){
                const orderDirection = value.split("-")[1];
                return orderDirection == 'true';
            }else{
                return undefined;
            }
        }
        return undefined;
    }

}
