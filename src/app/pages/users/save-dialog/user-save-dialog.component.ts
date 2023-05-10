import {Component, Inject, Input} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../services/user.service";
import {catchError} from "rxjs/operators";
import {EMPTY, Observable, Subscriber} from "rxjs";
import {User} from "../../../models/user.model";
import {DialogChildInterface} from "../../../components/ecl/dialog/dialog.child.interface";

@Component({
  selector: 'user-save-dialog',
  templateUrl: 'user-save-dialog.component.html',
  styleUrls: ['./user-save-dialog.component.scss']
})
export class UserSaveDialogComponent implements DialogChildInterface{

  public myForm!: UntypedFormGroup;
  public errorMessage?:string;

  @Input('data') data: any;
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
    private formBuilder: UntypedFormBuilder,
    private userService:UserService
  ) {

  }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      'userid': new FormControl(this.data ? this.data.user_id : '',Validators.required),
      'role': this.data ? this.data.role : 'USER',
      'active': this.data ? this.data.active : true
    })

    if (this.data){
      this.editMode = true;
      this.myForm.get('userid')?.disable();
    }
  }

  beforeSave():Observable<boolean>{
    return new Observable<boolean>((observer:Subscriber<boolean>)=>{
      if (this.myForm.valid) {
        if (this.editMode) {
          this.userService.editUser(this.data.user_id, this.myForm.value.role, this.myForm.value.active).subscribe(user => {
            observer.next(true);
          })
        } else {
          this.userService.addUser(this.myForm.value.userid,
            this.myForm.value.role,
            this.myForm.value.active).pipe(
            catchError(err => {
              this.errorMessage = err.error;
              observer.next(false);
              return EMPTY;
            })
          ).subscribe((user: User) => {
            observer.next(true);
          })
        }
      }else{
        this.errorMessage = "UserID is mandatory.";
      }
    })
  }

  getData(): any {
    return {refresh:true}
  }

}
