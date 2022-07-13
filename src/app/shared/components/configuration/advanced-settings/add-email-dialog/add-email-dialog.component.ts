import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdvancedSettingService } from 'src/app/core/services/configuration/advanced-setting.service';

@Component({
  selector: 'app-add-email-dialog',
  templateUrl: './add-email-dialog.component.html',
  styleUrls: ['./add-email-dialog.component.scss']
})
export class AddEmailDialogComponent implements OnInit {

  form: FormGroup;

  isLoading: boolean;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddEmailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private settingsService: AdvancedSettingService
  ) { }

  submit() {
    this.isLoading = true;

    const adminData = {
      name: this.form.value.adminName,
      email: this.form.value.adminEmail
    };

    if (this.data.selectedEmails) {
      this.data.selectedEmails = [this.form.value.adminEmail, ...this.data.selectedEmails];
    } else {
      this.data.selectedEmails = [this.form.value.adminEmail];
    }

    this.settingsService.postScheduleSettings(this.data.hours, this.data.schedulEnabled, this.data.selectedEmails, adminData).subscribe(() => {
      this.isLoading = false;
      this.dialogRef.close();
    });

  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      adminName: ['', Validators.required],
      adminEmail: ['', Validators.compose([Validators.email, Validators.required])]
    });
  }

}
