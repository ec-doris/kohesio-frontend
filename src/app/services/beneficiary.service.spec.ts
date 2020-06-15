import { TestBed } from '@angular/core/testing';

import {BeneficiaryService} from "./beneficiary.service";

describe('BeneficiaryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BeneficiaryService = TestBed.get(BeneficiaryService);
    expect(service).toBeTruthy();
  });
});
