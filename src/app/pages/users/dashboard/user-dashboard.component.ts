import {AfterViewInit, Component } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {User} from "../../../models/user.model";
import {MatDialog} from "@angular/material/dialog";
import {UserSaveDialogComponent} from "../save-dialog/user-save-dialog.component";
import {DialogEclComponent} from "../../../components/ecl/dialog/dialog.ecl.component";
import {Router} from "@angular/router";
import {UserInviteDialogComponent} from "../invite-dialog/user-invite-dialog.component";
import {TranslateService} from "../../../services/translate.service";

@Component({
    templateUrl: './user-dashboard.component.html',
    styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements AfterViewInit {

    public usersList?:User[];

    messages:any[] = [];

    constructor(public userService: UserService,
                public translateService: TranslateService,
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
          title: user ? this.translateService.userManagement.labels.dialogTitleEditUser :
            this.translateService.userManagement.labels.dialogTitleAddUser,
          primaryActionLabel: this.translateService.userManagement.buttons.actionSave,
          secondaryActionLabel: this.translateService.userManagement.buttons.actionCancel,
          data: user
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result && result.action=="primary" && result.data) {
          if (result.data.formType == 'invitation'){
            this.addMessage("success",this.translateService.userManagement.messages.invitedUser);
          }else {
            this.getListUsers();
            this.addMessage("success", this.translateService.userManagement.messages.updatedUser);
          }
        }
      });
    }

    inviteUser(){
      const dialogRef = this.dialog.open(DialogEclComponent,{
        disableClose: false,
        autoFocus: false,
        data:{
          childComponent: UserInviteDialogComponent,
          title: this.translateService.userManagement.labels.dialogTitleInviteUser,
          primaryActionLabel: this.translateService.userManagement.buttons.sendInvitation,
          secondaryActionLabel: this.translateService.userManagement.buttons.actionCancel
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result && result.action=="primary" && result.data) {
          this.getListUsers();
          this.addMessage("success",this.translateService.userManagement.messages.invitedUser);
        }
      });
    }

    deleteUser(user: User){
      const dialogRef = this.dialog.open(DialogEclComponent, {
        disableClose: false,
        data:{
          confirmMessage: this.translateService.userManagement.messages.confirmDelete
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result && result.action=="primary") {
          this.userService.deleteUser(user.user_id).subscribe(result=>{
            this.getListUsers();
            this.addMessage("success",this.translateService.userManagement.messages.deletedUser);
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
      this.router.navigate(['/'])
        .then(() => {
          window.location.reload();
        });
    })
  }


}
