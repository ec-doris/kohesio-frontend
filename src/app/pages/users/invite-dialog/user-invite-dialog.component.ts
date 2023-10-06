import {Component, Inject, Input} from "@angular/core";
import {FormControl, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../services/user.service";
import {EMPTY, forkJoin, Observable, Subscriber} from "rxjs";
import {DialogChildInterface} from "../../../components/ecl/dialog/dialog.child.interface";

@Component({
  selector: 'user-invite-dialog',
  templateUrl: 'user-invite-dialog.component.html',
  styleUrls: ['./user-invite-dialog.component.scss']
})
export class UserInviteDialogComponent implements DialogChildInterface{

  public myForm!: UntypedFormGroup;
  public errorMessage?:string;
  @Input('data') data: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService:UserService
  ) {}

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      'email': new FormControl('',Validators.required)
    })
  }

  beforeSave():Observable<boolean>{
    return new Observable<boolean>((observer:Subscriber<boolean>)=>{
      if (this.myForm.valid) {
          this.userService.inviteUser(this.myForm.value.email).subscribe(user => {
            observer.next(true);
          })
      }else{
        this.errorMessage = "Email is mandatory.";
      }
    })
  }

  getData(): any {
    return {refresh:true}
  }

}
