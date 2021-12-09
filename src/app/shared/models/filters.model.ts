import {Deserializable} from "./deserializable.model";
import {environment} from "../../../environments/environment";

export class Filters implements Deserializable{

    public keywords: string;
    public name: string;
    public country: string;
    public region: string;
    public theme: string;
    public policyObjective: string;
    public fund: string;
    public program: string;
    public interventionField: string;
    public budgetSmallerThan: number;
    public budgetBiggerThan: number;
    public budgetEUSmallerThan: number;
    public budgetEUBiggerThan: number;
    public startDateAfter: string;
    public endDateBefore: string;
    public orderStartDate: boolean;
    public orderEndDate: boolean;
    public orderEuBudget: boolean;
    public orderTotalBudget: boolean;
    public orderNumProjects: boolean;

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
            keywords: input.keywords ? input.keywords : undefined,
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
            ...(this.endDateBefore) && {endDateBefore: this.endDateBefore}
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
        }
    }

    private buildSort(column, value){
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
