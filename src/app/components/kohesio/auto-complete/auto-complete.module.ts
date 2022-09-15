import { NgModule } from '@angular/core';
import {KohesioAutoCompleteComponent} from "./auto-complete.component";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {AsyncPipe, CommonModule} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    AsyncPipe
  ],
    exports: [KohesioAutoCompleteComponent],
    declarations: [KohesioAutoCompleteComponent]
})
export class KohesioAutoCompleteModule {

}
