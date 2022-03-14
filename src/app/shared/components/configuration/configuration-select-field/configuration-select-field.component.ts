import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EmployeeSettingFormOption } from 'src/app/core/models/configuration/employee-setting.model';
import { ExportSettingFormOption } from 'src/app/core/models/configuration/export-setting.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { EmployeeFieldMapping } from 'src/app/core/models/enum/enum.model';
import { HelperService } from 'src/app/core/services/core/helper.service';

@Component({
  selector: 'app-configuration-select-field',
  templateUrl: './configuration-select-field.component.html',
  styleUrls: ['./configuration-select-field.component.scss']
})
export class ConfigurationSelectFieldComponent implements OnInit {

  @Input() form: FormGroup;
  // Having any here is okay, we get a different types of array of objects
  // TODO: Later convert it to DestinationAttribute[] | string[] etc.., 
  @Input() options: EmployeeSettingFormOption[] | ExportSettingFormOption[] | any[];
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
