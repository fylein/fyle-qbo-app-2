import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CorporateCreditCardExpensesObject, ReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { PreviewPage } from 'src/app/core/models/misc/preview-page.model';

@Component({
  selector: 'app-preview-dialog',
  templateUrl: './preview-dialog.component.html',
  styleUrls: ['./preview-dialog.component.scss']
})
export class PreviewDialogComponent implements OnInit {

  ReimbursableExpensesObject = ReimbursableExpensesObject;

  CorporateCreditCardExpensesObject = CorporateCreditCardExpensesObject;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PreviewPage
  ) { }

  ngOnInit(): void {
  }

}
