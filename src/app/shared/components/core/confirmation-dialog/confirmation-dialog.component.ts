import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ConfirmationDialog } from 'src/app/core/models/misc/confirmation-dialog.model';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

  hideSecondaryCTA: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialog,
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>
  ) { }

  ngOnInit(): void {
    this.hideSecondaryCTA = this.data.hideSecondaryCTA ? this.data.hideSecondaryCTA : false;
  }

}
