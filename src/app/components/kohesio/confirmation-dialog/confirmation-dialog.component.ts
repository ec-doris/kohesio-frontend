import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>) {}

  public confirmMessage?:string;
}
