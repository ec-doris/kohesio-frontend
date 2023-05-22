import {AfterViewInit, Component } from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Draft} from "../../../models/draft.model";
import {EditService} from "../../../services/edit.service";
import {UserService} from "../../../services/user.service";
import {DialogEclComponent} from "../../../components/ecl/dialog/dialog.ecl.component";
import {UserSaveDialogComponent} from "../../users/save-dialog/user-save-dialog.component";
import {EditFilterDialogComponent} from "../filter-dialog/edit-filter-dialog.component";

@Component({
    templateUrl: './edits-dashboard.component.html',
    styleUrls: ['./edits-dashboard.component.scss']
})
export class EditsDashboardComponent implements AfterViewInit {

    public editsList?:Draft[];

    public filters:any;
    public filtersCount?:number;

    constructor(private editService: EditService,
                public userService: UserService,
                public dialog: MatDialog){
    }

    ngOnInit(){
      this.getEditsList();
    }

    ngAfterViewInit(): void {
    }

    getEditsList(params:any = {}){
      this.editService.list(params).subscribe((drafts:Draft[])=>{
        this.editsList = drafts;
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
          secondaryActionLabel: "Cancel"
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result && result.action=="primary" && result.data) {
          this.filters = result.data;
          this.filtersCount = Object.keys(this.filters).length ? Object.keys(this.filters).length : undefined;
          this.getEditsList(this.filters);
        }
      });
    }

}
