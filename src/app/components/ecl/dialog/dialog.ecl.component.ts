import {Component, ComponentRef, Inject, Input, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {AdDirective} from "./ad.directive";
import {DialogChildInterface} from "./dialog.child.interface";
import {SaveDraftComponent} from "../../../pages/projects/dialogs/save-draft.component";

@Component({
    selector: 'app-ecl-dialog',
    templateUrl: './dialog.ecl.component.html',
    styleUrls: ['./dialog.ecl.component.scss']
})
export class DialogEclComponent {

  @ViewChild(AdDirective, {static: true}) adHost!: AdDirective;

  public confirmMessage?:string;
  public primaryAction:string = "Yes";
  public secondaryAction:string = "No";
  public title:string = "Confirmation";

  public childComponent?:ComponentRef<DialogChildInterface>;

  constructor(public dialogRef: MatDialogRef<DialogEclComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data){
      if (data.title){
        this.title = data.title;
      }
      if (data.primaryActionLabel){
        this.primaryAction = data.primaryActionLabel;
      }
      if (data.secondaryActionLabel){
        this.secondaryAction = data.secondaryActionLabel;
      }
      if (data.confirmMessage){
        this.confirmMessage = data.confirmMessage;
      }
    }
  }

  ngOnInit(): void {
    if (this.data && this.data.childComponent){
      const viewContainerRef = this.adHost.viewContainerRef;
      viewContainerRef.clear();
      this.childComponent = viewContainerRef.createComponent<DialogChildInterface>(this.data.childComponent);
      if (this.data.data){
        this.childComponent.instance.data = this.data.data;
      }
    }
  }

  onActionClick(type:string){
    let result:any = {
      action:type
    };
    if (this.childComponent){
      if ( typeof this.childComponent.instance['beforeSave'] === 'function' && type=="primary") {
        this.childComponent.instance.beforeSave!().subscribe((beforeSaveResult:boolean)=>{
          if (beforeSaveResult && this.childComponent!.instance.getData){
            result.data = this.childComponent!.instance.getData();
            this.dialogRef.close(result);
          }
        })
      }else if (this.childComponent!.instance.getData){
        result.data = this.childComponent.instance.getData();
        this.dialogRef.close(result);
      }
    }else{
      this.dialogRef.close(result);
    }

  }

}
