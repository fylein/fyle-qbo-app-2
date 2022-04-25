import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CorporateCreditCardExpensesObject, PreviewPage, ReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-preview-dialog',
  templateUrl: './preview-dialog.component.html',
  styleUrls: ['./preview-dialog.component.scss']
})
export class PreviewDialogComponent implements OnInit {

  PreviewPage = PreviewPage;
  ReimbursableExpensesObject = ReimbursableExpensesObject;
  CorporateCreditCardExpensesObject = CorporateCreditCardExpensesObject;
  // TODO: check ReimbursableExpensesObject and CorporateCreditCardExpensesObject comparision for JE
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ReimbursableExpensesObject | CorporateCreditCardExpensesObject | PreviewPage.FYLE_EXPENSE
  ) { }

  ngOnInit(): void {
  }

}
