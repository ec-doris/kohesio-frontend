import {Component, Input} from "@angular/core";
import {FormControl, UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {DialogChildInterface} from "../../../components/ecl/dialog/dialog.child.interface";
import {TranslateService} from "../../../services/translate.service";

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
    id: "DRAFT",
    value: this.translateService.editManagement.status.draft
  },{
    id: "SUBMITTED",
    value: this.translateService.editManagement.status.submitted
  },{
    id: "APPROVED",
    value: this.translateService.editManagement.status.approved
  },{
    id: "PUBLISHED",
    value: this.translateService.editManagement.status.published
  }];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    const filters = this.data.filters;
    this.myForm = this.formBuilder.group({
      'latest_status': new FormControl(filters && filters.latest_status ? filters.latest_status : [])
    })

  }

  getData(): any {
    const filters = {...this.myForm.value}
    if (!filters.latest_status || !filters.latest_status.length){
      delete filters.latest_status;
    }
    return filters;
  }

}
