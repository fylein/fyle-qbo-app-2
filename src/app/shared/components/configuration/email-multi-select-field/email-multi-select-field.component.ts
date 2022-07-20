import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdvancedSettingFormOption } from 'src/app/core/models/configuration/advanced-setting.model';
import { EmployeeSettingFormOption } from 'src/app/core/models/configuration/employee-setting.model';
import { ExportSettingFormOption } from 'src/app/core/models/configuration/export-setting.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ProgressPhase, SimpleSearchPage, SimpleSearchType } from 'src/app/core/models/enum/enum.model';
import { HelperService } from 'src/app/core/services/core/helper.service';

@Component({
  selector: 'app-email-multi-select-field',
  templateUrl: './email-multi-select-field.component.html',
  styleUrls: ['./email-multi-select-field.component.scss']
})
export class EmailMultiSelectFieldComponent implements OnInit {

  @Input() form: FormGroup;

  @Input() options: EmployeeSettingFormOption[] | ExportSettingFormOption[] | AdvancedSettingFormOption[] | any[];

  @Input() qboAttributes: DestinationAttribute[];

  @Input() iconPath: string;

  @Input() label: string;

  @Input() subLabel: string;

  @Input() placeholder: string;

  @Input() formControllerName: string;

  @Input() isFieldMandatory: boolean;

  @Input() mandatoryErrorListName: string;

  @Input() customErrorMessage: string;

  @Input() phase: ProgressPhase;

  SimpleSearchPage = SimpleSearchPage;

  SimpleSearchType = SimpleSearchType;

  constructor(
    public helperService: HelperService
  ) { }

  delete(event: Event, email: string, deleteAll: boolean = false) {
    event.preventDefault();
    event.stopPropagation();
    if (deleteAll) {
      this.form.controls.emails.patchValue(null);
    } else {
      const emails = this.form.value.emails.filter((value: string) => value !== email);
      this.form.controls.emails.patchValue(emails);
    }
  }

  ngOnInit(): void {
  }

}
