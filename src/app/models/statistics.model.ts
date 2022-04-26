import { Expose } from 'class-transformer';

export class Statistics {

    @Expose({ name: 'numberBeneficiaries' })
    numberBene!: number;
    
    numberProjects!: number;
    themes!: {
        lowCarbonEconomy: number;
        greenerAndCarbonFreeEurope: number;
        climateChangeAdaptation: number;
        enviromentProtection: number;
    };
    totalEuBudget!: number;

}
