import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {EditService} from "../../../services/edit.service";
import {UserService} from "../../../services/user.service";
import {DialogEclComponent} from "../../../components/ecl/dialog/dialog.ecl.component";
import {EditFilterDialogComponent} from "../filter-dialog/edit-filter-dialog.component";
import {Edit, EditWrapper} from "../../../models/edit.model";
import {environment} from "../../../../environments/environment";
import {forkJoin} from "rxjs";
import {FilterService} from "../../../services/filter.service";
import {ProjectService} from "../../../services/project.service";
import {MatPaginator} from "@angular/material/paginator";
import {TranslateService} from "../../../services/translate.service";

@Component({
    templateUrl: './edits-dashboard.component.html',
    styleUrls: ['./edits-dashboard.component.scss']
})
export class EditsDashboardComponent implements AfterViewInit {

    public editsList?:Edit[];
    public editCount:number = 0;
    public filters:any = {
      page:0,
      page_size:5
    };
    public filtersCount?:number;
    public isLoading = false;
    @ViewChild("paginator") paginator!: MatPaginator;

    constructor(private editService: EditService,
                public userService: UserService,
                private filterService: FilterService,
                private projectService: ProjectService,
                public translateService: TranslateService,
                public dialog: MatDialog){
    }

    ngOnInit(){
      if (this.userService.isEditor()){
        this.filters.latest_status = ['DRAFT'];
        this.filtersCount = 1;
      }else if (this.userService.isReviewer()){
        this.filters.latest_status = ['SUBMITTED']
        this.filtersCount = 1;
      }
      this.getEditsList();
    }

    ngAfterViewInit(): void {
    }

    getEditsList(){
      this.isLoading = true;
      this.editsList = [];
      this.editService.list(this.filters).subscribe((editData:EditWrapper)=>{
        if (editData && editData.count) {
          const projectObservables: any[] = [];
          editData.data.forEach((edit: Edit) => {
            projectObservables.push(this.projectService.getProjectDetail(edit.qid));
          })
          forkJoin(projectObservables).subscribe((results: any) => {
            results.forEach((result: any, index: number) => {
              if (result && result.program && result.program.length) {
                editData.data[index].cci_label = result.program[0].programFullLabel;
                editData.data[index].projectTitle = result.label;
              }
            })
            this.editsList = editData.data;
            this.editCount = editData.count;
            this.isLoading = false;
          })
        }else{
          this.isLoading = false;
        }
      })
    }

    deleteEdit(){
      let dialogRef: MatDialogRef<DialogEclComponent> = this.dialog.open(DialogEclComponent, {
        disableClose: false,
        data: {
          confirmMessage: "Are you sure you want to delete this item?"
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.action == 'primary') {

        }
      });
    }

    onAction(id: number, action:string){
      this.editService.action(id, action).subscribe(item=>{
        this.getEditsList();
      })
    }

    openFilterDialog(){
      const dialogRef = this.dialog.open(DialogEclComponent,{
        disableClose: false,
        autoFocus: false,
        data:{
          childComponent: EditFilterDialogComponent,
          title: "Filters",
          primaryActionLabel: "Apply",
          secondaryActionLabel: "Cancel",
          data:{
            filters:this.filters
          }
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result && result.action=="primary" && result.data) {
          this.filters = result.data;
          this.filtersCount = Object.keys(this.filters).length ? Object.keys(this.filters).length : undefined;
          this.getEditsList();
        }
      });
    }

    showEditVersion(edit:Edit){
      if (!edit.edit_versions || !edit.edit_versions.length){
        this.editService.getEdit(edit.id).subscribe((result:Edit)=>{
          edit.showHistory = !edit.showHistory;
          edit.edit_versions = result.edit_versions;
        })
      }else{
        edit.showHistory = !edit.showHistory;
      }
    }

    onPaginate(event: any) {
      this.filters.page=event.pageIndex;
      this.filters.page_size=event.pageSize;
      this.getEditsList();
    }

}
