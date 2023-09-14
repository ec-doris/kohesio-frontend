import {AfterViewInit, Component } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {User} from "../../../models/user.model";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {environment} from "../../../../environments/environment";
import {forkJoin} from "rxjs";
import {FilterService} from "../../../services/filter.service";

@Component({
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements AfterViewInit {

    public myForm!: UntypedFormGroup;

    public ccis_list: string[] = [];

    public editMode:boolean = false;

    constructor(public userService: UserService,
                private filterService: FilterService,
                private formBuilder: UntypedFormBuilder){
      this.myForm = this.formBuilder.group({
        user_id: userService.user.user_id,
        name: userService.user.name,
        email: userService.user.email,
        organization: userService.user.organization,
        role: userService.user.role,
        active: userService.user.active ? "YES" : "NO"
      });
      if (userService.user.allowed_cci_qids && userService.user.allowed_cci_qids.length){
        const programLabelsObservables:any[] = []
        userService.user.allowed_cci_qids.forEach((allowed_ccid:string)=>{
          programLabelsObservables.push(this.filterService.getFilter("programs",
            {qid:environment.entityURL+allowed_ccid}));
        })
        forkJoin(programLabelsObservables).subscribe((results:any)=>{
          results.forEach((result:any,index:number)=>{
            if (result && result.programs && result.programs.length){
              this.ccis_list.push(result.programs[0].value)
            }
          })
        })
      }
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
