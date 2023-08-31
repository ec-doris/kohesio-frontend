import {AfterViewInit, Component } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {User} from "../../../models/user.model";
import {MatDialog} from "@angular/material/dialog";
import {UserSaveDialogComponent} from "../save-dialog/user-save-dialog.component";
import {DialogEclComponent} from "../../../components/ecl/dialog/dialog.ecl.component";
import {Router} from "@angular/router";

@Component({
    templateUrl: './user-dashboard.component.html',
    styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements AfterViewInit {

    public usersList?:User[];

    messages:any[] = [];

    constructor(private userService: UserService,
                public dialog: MatDialog,
                private router: Router){
    }

    ngOnInit(){
      this.getListUsers();
    }

    ngAfterViewInit(): void {
    }

    saveUser(user?:User){
      const dialogRef = this.dialog.open(DialogEclComponent,{
        disableClose: false,
        autoFocus: false,
        data:{
          childComponent: UserSaveDialogComponent,
          title: user ? "Edit user" : "Add user",
          primaryActionLabel: "Save",
          secondaryActionLabel: "Cancel",
          data: user
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result && result.action=="primary" && result.data) {
          this.getListUsers();
          this.addMessage("success","The user was updated with success");
        }
      });
    }

    inviteUser(){

    }

    deleteUser(user: User){
      const dialogRef = this.dialog.open(DialogEclComponent, {
        disableClose: false,
        data:{
          confirmMessage: "Are you sure you want to delete?"
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result && result.action=="primary") {
          this.userService.deleteUser(user.user_id).subscribe(result=>{
            this.getListUsers();
            this.addMessage("success","The user was deleted with success");
          });
        }
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

  impersonateUser(user: User){
    this.userService.impersonateUser(user.user_id).subscribe((user:User)=>{
      console.log("impersonateUser");
      this.router.navigate(['/'])
        .then(() => {
          window.location.reload();
        });
    })
  }


}
