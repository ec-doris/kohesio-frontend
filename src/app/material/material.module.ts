import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

const materialModules = [
  MatBadgeModule,
  MatDialogModule,
  MatTooltipModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatAutocompleteModule,
  MatChipsModule
];
@NgModule({
  imports: materialModules,
  exports: materialModules,
})
export class MaterialModule {
}
