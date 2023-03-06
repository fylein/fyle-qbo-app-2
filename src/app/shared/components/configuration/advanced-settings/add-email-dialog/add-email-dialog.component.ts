import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdvancedSettingAddEmailModel, AdvancedSettingWorkspaceSchedulePost } from 'src/app/core/models/configuration/advanced-setting.model';
import { AdvancedSettingService } from 'src/app/core/services/configuration/advanced-setting.service';

@Component({
  selector: 'app-add-email-dialog',
  templateUrl: './add-email-dialog.component.html',
  styleUrls: ['./add-email-dialog.component.scss']
})
export class AddEmailDialogComponent implements OnInit {

  form: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<AddEmailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AdvancedSettingAddEmailModel,
    private settingsService: AdvancedSettingService
  ) { }

  submit() {

    const adminData = {
      name: this.form.value.adminName,
      email: this.form.value.adminEmail
    };

    if (this.data.selectedEmails) {
      this.data.selectedEmails = [this.form.value.adminEmail, ...this.data.selectedEmails];
    } else {
      this.data.selectedEmails = [this.form.value.adminEmail];
    }
    const data: AdvancedSettingWorkspaceSchedulePost = {
      hours: this.data.hours,
      schedule_enabled: this.data.schedulEnabled,
      emails_selected: this.data.selectedEmails,
      email_added: adminData
    };
      this.dialogRef.close(data);
  }

  setupForm(){
    this.form = this.formBuilder.group({
      adminName: ['', Validators.required],
      adminEmail: ['', Validators.compose([Validators.email, Validators.required])]
    });
  }

  ngOnInit() {
    this.setupForm();
  }

}
