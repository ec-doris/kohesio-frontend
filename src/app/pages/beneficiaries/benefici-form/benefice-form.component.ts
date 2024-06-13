import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, filter, of } from 'rxjs';
import { concatMap, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { FiltersApi } from '../../../models/filters-api.model';
import { FilterService } from '../../../services/filter.service';
import { TranslateService } from '../../../services/translate.service';

@Component({
  selector: 'app-benefice-form',
  templateUrl: './benefice-form.component.html',
  styleUrls: [ './benefice-form.component.scss' ]
})
export class BeneficeFormComponent implements OnInit {
  title = this.translateService.editManagement.labels.dialogTitleFilters;
  filters: FiltersApi = new FiltersApi();
  form = this.formBuilder.group({
    name: [ this.route.snapshot.queryParamMap.get(this.translateService.queryParams.name) ],
    country: [ this.getFilterKey('countries', this.translateService.queryParams.country) ],
    region: [],
    fund: [ this.getFilterKey('funds', this.translateService.queryParams.fund) ],
    program: [],
    beneficiaryType: [ this.getFilterKey('beneficiaryType', this.translateService.queryParams.beneficiaryType) ]
  });
  infoPopupLabelType = false;
  advancedFilterIsExpanded = false;
  private notOutside = false;

  constructor(private formBuilder: FormBuilder,
              public service: FilterService,
              public dialogRef: MatDialogRef<BeneficeFormComponent>,
              private route: ActivatedRoute,
              private translateService: TranslateService,
              private filterService: FilterService) {
  }

  geCountryFilters$$ = (which: string) => this.service.getFilter(which, { country: environment.entityURL + this.form.getRawValue().country });

  ngOnInit(): void {
    this.form.controls.country.valueChanges.pipe(filter(val => !!val), switchMap(val => this.onCountryChange(val))).subscribe();
    this.handleRouterParamsSequentially().pipe(filter(_ => !!this.route.snapshot.queryParamMap.keys.length)).subscribe()
  }

  onCountryChange(country: string) {
    this.form.patchValue({ region: null, program: null }, { emitEvent: false });
    return this.service.getRegions(country).pipe(
      filter(_ => !!country),
      concatMap(() => this.geCountryFilters$$('programs').pipe(tap(this.handleFilterResponse('programs', 'programs'))))
    );
  }

  onOutsideClick() {
    if (this.notOutside) {
      this.notOutside = false;
      return;
    }
    this.infoPopupLabelType = false;

  }

  onToggleAdvancedFilters(collapse: boolean) {
    this.advancedFilterIsExpanded = !collapse;
  }

  toggleInfoBtn() {
    this.notOutside = true;
    this.infoPopupLabelType = !this.infoPopupLabelType;
  }

  resetForm() {
    this.form.reset();
    this.service.showResult.next(this.service.getFormFilters(this.form));
  }

  onSubmit() {
    this.service.showResult.next(this.service.getFormFilters(this.form));
  }

  onActionClick() {
    this.dialogRef.close();
  }

  private handleFilterResponse(filterName: string, propertyName: string, deserialize: boolean = true) {
    return (res: any) => {
      let value: FiltersApi = deserialize ? new FiltersApi().deserialize({ [propertyName]: res[propertyName] }) : res[propertyName];
      this.service.filters[filterName] = (this.filters as any)[filterName] = (value as any)[propertyName];
    };
  }

  private getFilterKey(type: string, queryParam: string) {
    return this.filterService.getFilterKey(type, this.route.snapshot.queryParamMap.get(queryParam));
  }

  private handleRouterParamsSequentially() {
    if (!this.route.snapshot.queryParamMap.keys.length) return EMPTY;

    const queryParams = this.route.snapshot.queryParamMap;
    return of(queryParams).pipe(
      concatMap(params => {
        const country = this.route.snapshot.queryParamMap.has(this.translateService.queryParams.country);
        return country ? this.patchFormValue('country', 'countries', 'country')
          .pipe(switchMap(_ => this.onCountryChange(this.getFilterKey('countries', 'country')))) : of('');
      }),
      concatMap(() => this.patchFormValue('region', 'regions', 'region')),
      concatMap(() => this.patchFormValue('program', 'programs', 'programme'))
    );
  }

  private patchFormValue(controlName: string, filterKey: string, param: string) {
    const filterValue = this.getFilterKey(filterKey, param);
    this.form.patchValue({ [controlName]: filterValue }, { emitEvent: false });
    return of(null);
  }
}
