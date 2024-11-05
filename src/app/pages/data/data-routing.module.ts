import {inject, NgModule} from '@angular/core';
import {ResolveFn, RouterModule, Routes} from '@angular/router';
import {DataPageComponent} from "./data.component";
import {ExportDataService} from "../../services/export-data.service";

export const projectResolver: ResolveFn<any> = () => {
  return inject(ExportDataService).getProjectsData();
};
export const beneficiariesResolver: ResolveFn<any> = () => {
  return inject(ExportDataService).getBeneficiariesData();
};
export const nutsResolver: ResolveFn<any> = () => {
  return inject(ExportDataService).getNutsData();
};


const routes: Routes = [
  {
    path: '',
    component: DataPageComponent
  },
  {
    path: 'projects',
    component: DataPageComponent,
    resolve: {
      data: projectResolver
    }
  },
  {
    path: 'beneficiaries',
    component: DataPageComponent,
    resolve: {
      data: beneficiariesResolver
    }
  },
  {
    path: 'nuts',
    component: DataPageComponent,
    resolve: {
      data: nutsResolver
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
})
export class DataRoutingModule {}
