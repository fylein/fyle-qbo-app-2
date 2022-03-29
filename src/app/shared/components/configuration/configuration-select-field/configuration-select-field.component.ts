import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdvancedSettingFormOption } from 'src/app/core/models/configuration/advanced-setting.model';
import { EmployeeSettingFormOption } from 'src/app/core/models/configuration/employee-setting.model';
import { ExportSettingFormOption } from 'src/app/core/models/configuration/export-setting.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { DefaultDestinationAttribute } from 'src/app/core/models/db/general-mapping.model';
import { EmployeeFieldMapping } from 'src/app/core/models/enum/enum.model';
import { HelperService } from 'src/app/core/services/core/helper.service';

@Component({
  selector: 'app-configuration-select-field',
  templateUrl: './configuration-select-field.component.html',
  styleUrls: ['./configuration-select-field.component.scss']
})
export class ConfigurationSelectFieldComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() options: EmployeeSettingFormOption[] | ExportSettingFormOption[] | AdvancedSettingFormOption[] | any[];
  @Input() qboAttributes: DestinationAttribute[];
  @Input() iconPath: string;
  @Input() label: string;
  @Input() subLabel: string;
  @Input() placeholder: string;
  @Input() formControllerName: string;
  @Input() isFieldMandatory: boolean;
  @Input() liveEntityExample: {[EmployeeFieldMapping.EMPLOYEE]: string | undefined, [EmployeeFieldMapping.VENDOR]: string | undefined};
  value: any;

  constructor(
    public helperService: HelperService
  ) { }

  ngOnInit(): void {
  }

}
