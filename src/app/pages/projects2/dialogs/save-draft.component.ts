import { Component, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogChildInterface } from '../../../components/ecl/dialog/dialog.child.interface';

@Component({
  templateUrl: 'save-draft.component.html',
  styleUrls: ['./save-draft.component.scss']
})
export class SaveDraftComponent implements DialogChildInterface{

  public myForm!: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.myForm = this.formBuilder.group({
      'comment': ''
    })

  }

  getData():any {
    return {
      comment: this.myForm.value.comment
    }
  }


}
