import {AfterViewInit, Component } from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {EditService} from "../../../services/edit.service";
import {UserService} from "../../../services/user.service";
import {DialogEclComponent} from "../../../components/ecl/dialog/dialog.ecl.component";
import {EditFilterDialogComponent} from "../filter-dialog/edit-filter-dialog.component";
import {Edit} from "../../../models/edit.model";

@Component({
    templateUrl: './edits-dashboard.component.html',
    styleUrls: ['./edits-dashboard.component.scss']
})
export class EditsDashboardComponent implements AfterViewInit {

    public editsList?:Edit[];

    public filters:any = {
    };
    public filtersCount?:number;

    constructor(private editService: EditService,
                public userService: UserService,
                public dialog: MatDialog){
    }

    ngOnInit(){
      if (this.userService.isEditor()){
        this.filters = {
          latest_status:['DRAFT']
        }
        this.filtersCount = 1;
      }else if (this.userService.isReviewer()){
        this.filters = {
          latest_status:['SUBMITTED']
        }
        this.filtersCount = 1;
      }
      this.getEditsList();
    }

    ngAfterViewInit(): void {
    }

    getEditsList(){
      this.editService.list(this.filters).subscribe((edits:Edit[])=>{
        this.editsList = edits;
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

}