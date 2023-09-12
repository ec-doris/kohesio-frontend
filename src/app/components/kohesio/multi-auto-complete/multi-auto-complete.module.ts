import { NgModule } from '@angular/core';
import {KohesioMultiAutoCompleteComponent} from "./multi-auto-complete.component";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {AsyncPipe, CommonModule} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {MatCheckboxModule} from "@angular/material/checkbox";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatCheckboxModule,
    AsyncPipe
  ],
    exports: [KohesioMultiAutoCompleteComponent],
    declarations: [KohesioMultiAutoCompleteComponent]
})
export class KohesioMultiAutoCompleteModule {

}
