import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { KohesioEclAccordionModule } from '../app/components/ecl/accordion/accordion.ecl.module';
import { KohesioEclButtonModule } from '../app/components/ecl/button/button.ecl.module';
import { KohesioEclFormGroupModule } from '../app/components/ecl/forms/form-group/form-group.ecl.module';
import { KohesioEclFormLabelModule } from '../app/components/ecl/forms/label/form-label.ecl.module';
import { KohesioEclFormSelectModule } from '../app/components/ecl/forms/select/form-select.ecl.module';
import { KohesioEclFormTextInputModule } from '../app/components/ecl/forms/text-input/form-text-input.ecl.module';
import { KohesioAutoCompleteModule } from '../app/components/kohesio/auto-complete/auto-complete.module';
import { KohesioMultiAutoCompleteModule } from '../app/components/kohesio/multi-auto-complete/multi-auto-complete.module';
import { MaterialModule } from '../app/material/material.module';
import { FiltersComponent } from '../app/pages/projects2/dialogs/filters/filters/filters.component';
import { FiltersPipe } from '../app/pages/projects2/filters.pipe';

const sharedModules = [
  MaterialModule,
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  KohesioAutoCompleteModule,
  KohesioEclButtonModule,
  KohesioEclFormTextInputModule,
  HttpClientModule,
  KohesioEclFormGroupModule,
  KohesioEclFormLabelModule,
  KohesioEclFormSelectModule,
  KohesioMultiAutoCompleteModule,
  KohesioEclAccordionModule,
];


@NgModule({
  declarations: [ FiltersComponent, FiltersPipe ],
  imports: sharedModules,
  exports: [ ...sharedModules, FiltersPipe, FiltersComponent ]
})
export class SharedModule {
}
