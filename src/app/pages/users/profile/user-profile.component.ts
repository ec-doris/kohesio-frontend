import {AfterViewInit, Component } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {User} from "../../../models/user.model";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";

@Component({
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements AfterViewInit {

    public myForm!: UntypedFormGroup;

    public editMode:boolean = false;

    constructor(public userService: UserService,
                private formBuilder: UntypedFormBuilder){
      this.myForm = this.formBuilder.group({
        user_id: userService.user.user_id,
        name: userService.user.name,
        email: userService.user.email,
        organization: userService.user.organization,
        role: userService.user.role,
        active: userService.user.active ? "YES" : "NO"
      });
    }

    ngOnInit(){

    }

    ngAfterViewInit(): void {
    }

    onEdit(){
      this.editMode = true;
    }

    onCancel(){
      this.editMode = false;
    }

    onSubmit() {
      this.userService.updateProfile(this.userService.user.user_id,
        this.myForm.value.name,
        this.myForm.value.email,
        this.myForm.value.organization).subscribe(user=>{
        this.editMode = false;
      })
    }


}
