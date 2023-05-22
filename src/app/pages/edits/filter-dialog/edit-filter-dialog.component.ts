import {Component, Input} from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {DialogChildInterface} from "../../../components/ecl/dialog/dialog.child.interface";

@Component({
  selector: 'user-save-dialog',
  templateUrl: 'edit-filter-dialog.component.html',
  styleUrls: ['./edit-filter-dialog.component.scss']
})
export class EditFilterDialogComponent implements DialogChildInterface{

  public myForm!: UntypedFormGroup;
  public errorMessage?:string;

  @Input('data') data: any;
  public statuses:any[] = [{
    id: null,
    value: "ALL"
  },{
    id: "DRAFT",
    value: "DRAFT"
  },{
    id: "SUBMITTED",
    value: "SUBMITTED"
  },{
    id: "APPROVED",
    value: "APPROVED"
  },{
    id: "REJECTED",
    value: "REJECTED"
  },{
    id: "PUBLISHED",
    value: "PUBLISHED"
  }];
  public editMode:boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      'status': this.data ? this.data.status : null,
    })

  }

  getData(): any {
    const filters = this.myForm.value
    if (filters.status == null){
      delete filters.status;
    }
    return filters;
  }

}
