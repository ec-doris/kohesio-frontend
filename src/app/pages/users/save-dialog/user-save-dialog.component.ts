import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {UserService} from "../../../services/user.service";
import {catchError} from "rxjs/operators";
import {EMPTY} from "rxjs";
import {User} from "../../../models/user.model";

@Component({
  selector: 'user-save-dialog',
  templateUrl: 'user-save-dialog.component.html',
  styleUrls: ['./user-save-dialog.component.scss']
})
export class UserSaveDialogComponent {

  public myForm!: UntypedFormGroup;
  public roles:any[] = [{
    id: "ADMIN",
    value: "ADMIN"
  },{
    id: "EDITOR",
    value: "EDITOR"
  },{
    id: "REVIEWER",
    value: "REVIEWER"
  },{
    id: "USER",
    value: "USER"
  }];
  public editMode:boolean = false;

  constructor(
    public dialogRef: MatDialogRef<UserSaveDialogComponent>,
    private formBuilder: UntypedFormBuilder,
    private userService:UserService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.myForm = this.formBuilder.group({
      'userid': data ? data.user_id : '',
      'role': data ? data.role : 'USER',
      'active': data ? data.active : true
    })

    if (data){
      this.editMode = true;
      this.myForm.get('userid')?.disable();
    }

  }

  cancel(): void{
    this.dialogRef.close();
  }

  onSubmit(){
    if (this.editMode){
      this.userService.editUser(this.data.user_id, this.myForm.value.role,this.myForm.value.active).subscribe(user => {
        this.dialogRef.close({refresh:true});
      })
    }else {
      this.userService.addUser(this.myForm.value.userid,
        this.myForm.value.role,
        this.myForm.value.active).pipe(
        catchError(err => {
          this.dialogRef.close({refresh:false,error:true,message:err});
          return EMPTY;
        })
      ).subscribe((user:User) => {
        this.dialogRef.close({refresh:true});
      })
    }
  }

}
