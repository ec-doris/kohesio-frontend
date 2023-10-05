import {AfterViewInit, Component } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {User} from "../../../models/user.model";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {environment} from "../../../../environments/environment";
import {forkJoin} from "rxjs";
import {FilterService} from "../../../services/filter.service";
import {DialogEclComponent} from "../../../components/ecl/dialog/dialog.ecl.component";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements AfterViewInit {

    public myForm!: UntypedFormGroup;

    public ccis_list: string[] = [];

    public editMode:boolean = false;

    public messages?:[{
      type:'info' | 'success' | 'warning' | 'error',
      message:string
    }];

    constructor(public userService: UserService,
                private filterService: FilterService,
                private formBuilder: UntypedFormBuilder,
                public dialog: MatDialog,
                private router: Router,
                private _route: ActivatedRoute){
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
      if (this._route.snapshot.queryParamMap.has("edit")){
        this.startEditMode();
      }
      if (this._route.snapshot.queryParamMap.has("update")){
        this.showMessage("info", "Please, update your profile data.");
        this.router.navigate([], {
          queryParams: {
            update:undefined
          },
          queryParamsHandling: "merge"
        });
      }
    }

    ngAfterViewInit(): void {
    }

    onEdit(){
      this.startEditMode();
    }

    onCancel(){
      this.finishEditMode();
    }

    startEditMode(){
      this.editMode = true;
      this.router.navigate([], {
        queryParams: {
          edit:true
        },
        queryParamsHandling: "merge"
      });
    }

    finishEditMode(){
      this.editMode = false;
      this.router.navigate([], {
        queryParams: {
          edit:undefined
        },
        queryParamsHandling: "merge"
      });
    }

    onSubmit() {
      this.userService.updateProfile(this.userService.user.user_id,
        this.myForm.value.name,
        this.myForm.value.email,
        this.myForm.value.organization).subscribe(user=>{
          this.showMessage("success", "Your profile was updated.");
          this.finishEditMode();
        })
    }

  onDeleteProfile(){
    const dialogRef = this.dialog.open(DialogEclComponent, {
      disableClose: false,
      data:{
        confirmMessage: "Are you sure you want to delete?"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.action=="primary") {
        this.userService.deleteUser(this.userService.user.user_id).subscribe(result=>{
          this.router.navigate(['/'])
            .then(() => {
              window.location.reload();
            });
        });
      }
    });
  }

  showMessage(type:'info' | 'success' | 'warning' | 'error', message:string){
      this.messages = [{
        type: type,
        message: message
      }];
  }


}
