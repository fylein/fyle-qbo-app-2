import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-disconnect-qbo-dialog',
  templateUrl: './disconnect-qbo-dialog.component.html',
  styleUrls: ['./disconnect-qbo-dialog.component.scss']
})
export class DisconnectQboDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {companyName: string},
    public dialogRef: MatDialogRef<DisconnectQboDialogComponent>,
  ) { }

  ngOnInit(): void {
  }

}
