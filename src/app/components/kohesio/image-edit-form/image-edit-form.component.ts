import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-image-edit-form',
  templateUrl: './image-edit-form.component.html',
  styleUrl: './image-edit-form.component.scss'
})
export class ImageEditFormComponent implements OnInit {
  imageForm!: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<ImageEditFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.imageForm = this.fb.group({
      image_url: [ this.data.image_url || '', Validators.required ],
      image_description: [ this.data.image_description || '', Validators.required ],
      image_copyright: [ this.data.image_copyright || '', Validators.required ]
    });
  }

  onSubmit(): void {
    if (this.imageForm.valid) {
      this.dialogRef.close(this.imageForm.value);
    }
  }
}
