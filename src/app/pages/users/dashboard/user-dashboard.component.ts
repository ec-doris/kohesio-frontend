import {AfterViewInit, Component } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {User} from "../../../models/user.model";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {
  ConfirmationDialogComponent
} from "../../../components/kohesio/confirmation-dialog/confirmation-dialog.component";
import {UserSaveDialogComponent} from "../save-dialog/user-save-dialog.component";

@Component({
    templateUrl: './user-dashboard.component.html',
    styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements AfterViewInit {

    public usersList?:User[];

    messages:any[] = [];

    dialogRef?: MatDialogRef<ConfirmationDialogComponent>;

    constructor(private userService: UserService,
                public dialog: MatDialog){
    }

    ngOnInit(){
      this.getListUsers();
    }

    ngAfterViewInit(): void {
    }

    saveUser(user?:User){
      const dialogRef = this.dialog.open(UserSaveDialogComponent,{
        data:user
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.refresh) {
          this.getListUsers();
          this.addMessage("success","The user was updated with success");
        }else if(result && result.error){
          this.addMessage("error",result.message.error);
        }
      });
    }

    deleteUser(user: User){
      this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false
      });
      this.dialogRef.componentInstance.confirmMessage = "Are you sure you want to delete?"
      this.dialogRef.afterClosed().subscribe(result => {
        if(result) {
          this.userService.deleteUser(user.user_id).subscribe(result=>{
            this.getListUsers();
            this.addMessage("success","The user was deleted with success");
          });
        }
        this.dialogRef = undefined;
      });

    }

    getListUsers(){
      this.userService.getUsers().subscribe((users:User[])=>{
        this.usersList = users;
      })
    }

    dismissMessage(type:string){
      this.messages.splice(this.messages.findIndex(a => a.type === type) , 1)
    }

    addMessage(type:string, message:string){
      this.messages.push({
        type:type,
        message:message
      })
    }


}
