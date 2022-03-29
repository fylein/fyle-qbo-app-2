import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-export-log-child-dialog',
  templateUrl: './export-log-child-dialog.component.html',
  styleUrls: ['./export-log-child-dialog.component.scss']
})
export class ExportLogChildDialogComponent implements OnInit {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: number[],
    private dialogRef: MatDialogRef<ExportLogChildDialogComponent>,
  ) { }

  private setupForm(): void {
    this.form = this.formBuilder.group({
      searchOption: ['']
    });
  }

  private getExpensesAndSetupPage(): void {
    this.setupForm();
    console.log(this.data)
  }

  ngOnInit(): void {
    this.getExpensesAndSetupPage();
  }

}
