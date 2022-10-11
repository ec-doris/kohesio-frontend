import {AfterViewInit, Component, ViewChild, Input} from '@angular/core';
import {environment} from "../../../../environments/environment";
import { Project } from 'src/app/models/project.model';
import {MatDialog} from '@angular/material/dialog';
import { ProjectDetailModalComponent } from '../project-detail-modal/project-detail-modal.component';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    templateUrl: './map-popup.component.html',
    styleUrls: ['./map-popup.component.scss']
})
export class MapPopupComponent {

    public selectedProject!: Project;

    @Input() projects!: any[];

    constructor(private dialog: MatDialog, private _router: Router, private _route: ActivatedRoute){}

    onSelectedProject(project: any){
        this.selectedProject = project;
        this.dialog.open(ProjectDetailModalComponent,{
            width: "90%",
            height: "85vh",
            maxWidth: "100%",
            maxHeight: "100%",
            data: {
                id: project.item.replace(environment.entityURL, "")
            }
        }).afterClosed().subscribe(()=>{
          history.replaceState && history.replaceState(
            null, '', location.pathname + location.search.replace(/[\?&]project=[^&]+/, '').replace(/^&/, '?') + location.hash
          );
        });
        this._router.navigate([], {
          relativeTo: this._route,
          queryParams: {
            project: project.item.replace(environment.entityURL, "")
          },
          queryParamsHandling: 'merge'
        });
    }

}
