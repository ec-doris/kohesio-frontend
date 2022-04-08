import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { StatisticsService } from "./statistics.service";
import { Statistics } from '../models/statistics.model';

describe('StatisticsService', () => {
    let service: StatisticsService;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(async () => { 

        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ],
            providers: [
                StatisticsService
            ]
        });
      
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);

        service = TestBed.inject(StatisticsService);
       
    });
  
    it('#getObservableValue should return value from observable', (done) => {
        const statsResults = new Statistics();
        statsResults.numberBene = 1;
        statsResults.numberProjects = 1;
        statsResults.themes = Object({ lowCarbonEconomy: 1, greenerAndCarbonFreeEurope: 1, climateChangeAdaptation: 1, enviromentProtection: 1 })
        statsResults.totalEuBudget = 1;

        service.getKeyFigures().subscribe((data:Statistics) => {
            expect(data).toEqual(statsResults);
            done();
        });
        const req = httpTestingController.expectOne('/statistics');
        expect(req.request.method).toEqual('GET');
        req.flush({
            numberBeneficiaries: 1,
            numberProjects: 1,
            themes: {
                lowCarbonEconomy: 1,
                greenerAndCarbonFreeEurope: 1,
                climateChangeAdaptation: 1,
                enviromentProtection: 1
            },
            totalEuBudget: 1
        });

    });

    afterEach(() => {
        httpTestingController.verify();
    });
  
  });