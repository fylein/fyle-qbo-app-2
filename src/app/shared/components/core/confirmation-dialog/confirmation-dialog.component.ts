import { Component, Inject, OnInit } from '@angular/core';
import { ConfirmationDialog } from 'src/app/core/models/misc/confirmation-dialog.model';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

  hideSecondaryCTA: boolean;

  hideWarningIcon: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialog,
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>
  ) { }

  ngOnInit(): void {
    this.hideSecondaryCTA = this.data.hideSecondaryCTA ? this.data.hideSecondaryCTA : false;
    this.hideWarningIcon = this.data.hideWarningIcon ? this.data.hideWarningIcon : false;
  }

}
