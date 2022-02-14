import { NgModule } from '@angular/core';
import { KohesioEclFormGroupModule } from './form-group/form-group.ecl.module';
import { KohesioEclFormLabelModule } from './label/form-label.ecl.module';
import { KohesioEclFormTextInputModule } from './text-input/form-text-input.ecl.module';
import { KohesioEclFormSelectModule } from './select/form-select.ecl.module';

const MODULES = [
    KohesioEclFormGroupModule,
    KohesioEclFormLabelModule,
    KohesioEclFormTextInputModule,
    KohesioEclFormSelectModule
]

@NgModule({
    imports: [
        ...MODULES
    ],
    exports: [
        ...MODULES
    ]
})
export class KohesioEclFormModule {
}
