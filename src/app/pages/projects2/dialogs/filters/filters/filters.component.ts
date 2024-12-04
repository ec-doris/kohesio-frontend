import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, filter, forkJoin, Observable, of } from 'rxjs';
import { concatMap, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { FiltersApi } from '../../../../../models/filters-api.model';
import { FilterService } from '../../../../../services/filter.service';
import { MetaService } from '../../../../../services/meta.service';
import { TranslateService } from '../../../../../services/translate.service';

@Component({
  selector: 'kohesio-filters',
  templateUrl: './filters.component.html',
  styleUrls: [ './filters.component.scss' ]
})
export class FiltersComponent implements OnInit {
  title = this.translateService.editManagement.labels.dialogTitleFilters;
  interventionField: any = [];
  filters: FiltersApi = new FiltersApi();
  themeSelection = this.service.filters.thematic_objectives;
  advancedFilterIsExpanded = false;
  form = this.formBuilder.group({
    keywords: this.route.snapshot.queryParamMap.get(this.translateService.queryParams.keywords),
    town: this.route.snapshot.queryParamMap.get(this.translateService.queryParams.town),
    country: [ this.getFilterKey('countries', this.translateService.queryParams.country) ],
    region: [],
    policyObjective: '',
    theme: '',
    programPeriod: [],
    fund: [],
    program: [],
    interventionField: [ this.interventionField ],
    totalProjectBudget: [],
    amountEUSupport: [],
    projectStart: [],
    projectEnd: [],
    interreg: [],
    nuts3: [],
    priority_axis: [],
    projectCollection: [],
    sdg: []
  });
  infoPopup: boolean = false;
  semanticTerms: String[] = [];
  private notOutside = false;

  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<FiltersComponent>,
              private translateService: TranslateService,
              private route: ActivatedRoute,
              public service: FilterService,
              private metaService: MetaService) {
  }

  geCountryFilters$$ = (which: string) => this.service.getFilter(which, { country: environment.entityURL + this.form.getRawValue().country });
  getRegionFilters$$ = (which: string) => {
    const { country, region } = this.form.getRawValue();
    return this.service.getFilter(which, { country: environment.entityURL + country, region: environment.entityURL + region });
  };

  handleFilterResponse(filterName: string, propertyName: string, deserialize: boolean = true) {
    return (res: any) => {
      let value: FiltersApi = deserialize ? new FiltersApi().deserialize({ [propertyName]: res[propertyName] }) : res[propertyName];
      this.service.filters[filterName] = (this.filters as any)[filterName] = (value as any)[propertyName];
    };
  }

  onSubmit() {
    this.service.showResult$$.next({ filters: this.service.getFormFilters(this.form), source: 'filters submit' });
  }

  getDate(dateStringFormat: any) {
    if (dateStringFormat) {
      const dateSplit = dateStringFormat.split('-');
      const javascriptFormat = dateSplit[1] + '/' + dateSplit[0] + '/' + dateSplit[2];
      return dateStringFormat ? new Date(javascriptFormat) : undefined;
    }
    return undefined;
  }

  ngOnInit(): void {
    this.form.controls.country.valueChanges.pipe(filter(val => !!val), switchMap(val => this.onCountryChange(val))).subscribe();
    this.form.controls.region.valueChanges.pipe(switchMap(_ => this.onRegionChange())).subscribe();
    this.form.controls.policyObjective.valueChanges.pipe(switchMap(_ => this.onPolicyObjectivesChange())).subscribe();
    this.form.controls.theme.valueChanges.pipe(switchMap(_ => this.onThemeChange())).subscribe();
    this.form.controls.fund.valueChanges
      .pipe(tap(_ => this.form.patchValue({ program: null }, { emitEvent: false })), switchMap(_ => this.getPrograms())).subscribe();
    this.form.controls.interreg.valueChanges
      .pipe(switchMap(_ => this.getPrograms()), tap(_ => this.form.patchValue({ program: null }))).subscribe();
    this.form.controls.program.valueChanges
      .pipe(switchMap(_ => this.getPriorityAxis()), tap(_ => this.form.patchValue({ priority_axis: null }))).subscribe();
    this.form.controls.sdg.valueChanges.subscribe(_ => this.onSDGChange());


    this.handleRouterParamsSequentially().pipe(filter(_ => !!this.route.snapshot.queryParamMap.keys.length))
      .subscribe(() => {
        this.metaService.changeProjectListMetadata();
        // this.service.showResult.next(this.service.getFormFilters(this.form));
      });

  }

  onCountryChange(country: string) {
    this.form.patchValue({ region: null, program: null, nuts3: null, priority_axis: null }, { emitEvent: false });
    return this.service.getRegions(country).pipe(
      filter(_ => !!country),
      concatMap(() => this.geCountryFilters$$('programs').pipe(tap(this.handleFilterResponse('programs', 'programs')))),
      concatMap(() => this.geCountryFilters$$('nuts3').pipe(tap(this.handleFilterResponse('nuts3', 'nuts3')))),
      concatMap(() => this.geCountryFilters$$('priority_axis').pipe(tap(this.handleFilterResponse('priority_axis', 'priority_axis', false))))
    );
  }

  getPrograms() {
    const { country, region, fund, interreg } = this.form.getRawValue();
    let params: any = { country: environment.entityURL + country };
    fund && (params.fund = environment.entityURL + fund);
    region && (params.region = environment.entityURL + region);
    interreg && (params.interreg = interreg);

    return this.service.getFilter('programs', params)
      .pipe(tap(({ programs }) => this.service.filters.programs = this.filters.programs = programs));
  }

  getPriorityAxis(): Observable<any> {
    const { country, program } = this.form.getRawValue();
    const params: any = { country: environment.entityURL + country, program: environment.entityURL + program };

    return this.service.getFilter('priority_axis', params)
      .pipe(tap(({ priority_axis }) => this.service.filters.priority_axis = this.filters.priority_axis = priority_axis));
  }

  onRegionChange() {
    this.form.patchValue({ nuts3: null, program: null }, { emitEvent: false });

    return forkJoin([
      this.getRegionFilters$$('nuts3').pipe(tap(this.handleFilterResponse('nuts3', 'nuts3'))),
      this.getRegionFilters$$('programs').pipe(tap(this.handleFilterResponse('programs', 'programs')))
    ]);
  }

  onThemeChange() {
    const params = { theme: environment.entityURL + this.form.getRawValue().theme };
    return this.service.getFilter('policy_objectives', params).pipe(tap(policies => {
      policies?.policy_objectives?.length
        ? this.form.patchValue({ policyObjective: policies.policy_objectives[0].id }, { emitEvent: false })
        : this.form.patchValue({ policyObjective: null }, { emitEvent: false });
    }));
  }

  onPolicyObjectivesChange() {
    this.form.patchValue({ theme: null }, { emitEvent: false });
    const policy = this.form.getRawValue().policyObjective;
    if (policy) {
      const params = { policy: environment.entityURL + policy };
      return this.service.getFilter('thematic_objectives', params).pipe(tap(themes => this.themeSelection = themes.thematic_objectives));
    } else {
      this.themeSelection = this.filters.thematic_objectives;
      return of();
    }
  }

  onToggleAdvancedFilters(collapse: boolean) {
    this.advancedFilterIsExpanded = !collapse;
  }

  onSDGChange() {
    const sdgValue = this.filters.sdg?.find((value) => value.id == this.form.getRawValue().sdg);
    this.form.patchValue({ 'interventionField': undefined });
    if (sdgValue?.interventionField) {
      let qids: any[] = [];
      sdgValue.interventionField.forEach((intFieldCode: string) => {
        const ifValue: any = this.service.getFilterKey('categoriesOfIntervention', intFieldCode);
        qids.push(ifValue);
      });
      if (qids.length) {
        this.form.patchValue({ 'interventionField': qids });
      }
    }
  }

  resetForm() {
    this.form.reset();
    this.themeSelection = this.filters.thematic_objectives;
    this.semanticTerms = [];
    this.service.showResult$$.next({ filters: this.service.getFormFilters(this.form), source: 'filters reset' });
  }

  onOutsideClick() {
    if (this.notOutside) {
      this.notOutside = false;
      return;
    }
    this.infoPopup = false;
  }

  toggleInfoBtn() {
    this.notOutside = true;
    this.infoPopup = !this.infoPopup;
  }

  onClickRelatedTerm(term: any) {
    this.form.patchValue({ 'keywords': term });
    this.onSubmit();

  }

  onRestrictSearch(event: any) {
    if (this.semanticTerms?.length) {
      const keywordsValue = '"' + this.form.getRawValue().keywords + '"';
      this.form.patchValue({ 'keywords': keywordsValue });
      this.semanticTerms = [];
      this.onSubmit();
    }
  }

  onActionClick() {
    this.dialogRef.close();
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
      concatMap(() => {
        return this.route.snapshot.queryParamMap.has(this.translateService.queryParams.region) ? this.patchFormValue('region', 'regions', 'region')
          .pipe(filter(() => !!this.route.snapshot.queryParamMap.get(this.translateService.queryParams.region)), switchMap(_ => this.onRegionChange())) : of('');
      }),
      concatMap(() => {
        const policy = this.route.snapshot.queryParamMap.has(this.translateService.queryParams.policyObjective);
        return policy ? this.patchFormValue('policyObjective', 'policy_objectives', 'policyObjective')
          .pipe(switchMap(() => this.onPolicyObjectivesChange())) : of('');
      }),
      concatMap(() => this.patchFormValue('priority_axis', 'priority_axis', 'priorityAxis')),
      concatMap(() => this.patchFormValue('program', 'programs', 'programme')),
      concatMap(() => this.patchFormValue('theme', 'thematic_objectives', 'theme')),
      concatMap(() => this.patchFormValue('projectCollection', 'project_types', 'projectCollection')),
      concatMap(() => this.patchFormValue('fund', 'funds', 'fund')),
      concatMap(() => this.patchFormValue('interreg', 'interreg', 'interreg')),
      concatMap(() => this.patchFormValue('nuts3', 'nuts3', 'nuts3')),
      concatMap(() => this.patchFormValue('totalProjectBudget', 'totalProjectBudget', 'totalProjectBudget')),
      concatMap(() => this.patchFormValue('amountEUSupport', 'amountEUSupport', 'amountEUSupport')),
      concatMap(() => {
        const town = this.route.snapshot.queryParamMap.has(this.translateService.queryParams.town);
        town && this.form.patchValue({ town: queryParams.get(this.translateService.queryParams.town) });
        return of(null);
      }),
      concatMap(() => {
        const interventionField = queryParams.get(this.translateService.queryParams.interventionField)?.split(',');
        if (interventionField?.length) {
          this.interventionField = [];
          interventionField.forEach(key => {
            const ifValue = this.service.getFilterKey('categoriesOfIntervention', key);
            this.interventionField.push(ifValue);
          });
          this.form.patchValue({ interventionField: this.interventionField }, { emitEvent: false });
        }
        return of('');
      }),
      concatMap(() => {
        const sdg = queryParams.get(this.translateService.queryParams.sdg);
        if (sdg) {
          // @ts-ignore
          this.form.patchValue({ sdg: parseInt(sdg.match(/^\d+/)[0], 10) });
        }
        return of('');
      }),
      concatMap(() => {
        const projectStart = queryParams.get(this.translateService.queryParams.projectStart);
        const projectEnd = queryParams.get(this.translateService.queryParams.projectEnd);
        if (projectStart && projectEnd) {
          this.form.patchValue({ projectStart: <any>this.getDate(projectStart) });
          this.form.patchValue({ projectEnd: <any>this.getDate(projectEnd) });
        }
        return of('');
      }),
    );
  }

  private patchFormValue(controlName: string, filterKey: string, param: string) {
    const filterValue = this.getFilterKey(filterKey, param);
    this.form.patchValue({ [controlName]: filterValue }, { emitEvent: false });
    return of(null);
  }

  private getFilterKey(type: string, queryParam: string) {
    return this.service.getFilterKey(type, this.route.snapshot.queryParamMap.get(this.translateService.queryParams[queryParam]));
  }
}
