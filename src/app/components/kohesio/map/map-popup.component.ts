import {AfterViewInit, Component, ViewChild, Input} from '@angular/core';
import {environment} from "../../../../environments/environment";
import { Project } from 'src/app/models/project.model';
import {MatDialog} from '@angular/material/dialog';
import { ProjectDetailModalComponent } from '../project-detail-modal/project-detail-modal.component';
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "../../../services/translate.service";

@Component({
    templateUrl: './map-popup.component.html',
    styleUrls: ['./map-popup.component.scss']
})
export class MapPopupComponent {

    public selectedProject!: Project;

    @Input() projects!: any[];

    @Input() openProjectInner: boolean = true;

    constructor(private dialog: MatDialog, private _router: Router,
                private _route: ActivatedRoute,
                public translateService: TranslateService){}

    onSelectedProject(project: any){
      if (this.openProjectInner) {
        this.selectedProject = project;
        this.dialog.open(ProjectDetailModalComponent, {
          width: "90%",
          height: "85vh",
          maxWidth: "1300px",
          maxHeight: "100%",
          data: {
            id: project.item.replace(environment.entityURL, "")
          }
        }).afterClosed().subscribe(() => {
          this.updateCoordsQueryParam(undefined);
        });
        this.updateCoordsQueryParam(project.item.replace(environment.entityURL, ""));
      }else{

      }
    }

    updateCoordsQueryParam(project:string | undefined){
      let fragment:string | undefined = this._route.snapshot.fragment + "";
      if (!this._route.snapshot.fragment){
        fragment = undefined;
      }
      this._router.navigate([], {
        relativeTo: this._route,
        fragment: fragment,
        queryParams: {
          project: project
        },
        queryParamsHandling: 'merge'
      });
    }

    cleanQID(item:string){
      return item.replace(environment.entityURL,"");
    }

}
