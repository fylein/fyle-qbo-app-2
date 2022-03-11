import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS } from '@angular/forms';
import { noop } from 'rxjs';
import { EmployeeSettingFormOption } from 'src/app/core/models/configuration/employee-setting.model';
import { ExportSettingFormOption } from 'src/app/core/models/configuration/export-setting.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { EmployeeFieldMapping } from 'src/app/core/models/enum/enum.model';
import { HelperService } from 'src/app/core/services/core/helper.service';

@Component({
  selector: 'app-configuration-select-field',
  templateUrl: './configuration-select-field.component.html',
  styleUrls: ['./configuration-select-field.component.scss'],
  // TODO: check if this is needed
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ConfigurationSelectFieldComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: ConfigurationSelectFieldComponent,
      multi: true,
    }
  ]
})
export class ConfigurationSelectFieldComponent implements ControlValueAccessor, OnInit {

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

  writeValue(obj: any) {
    this.value = obj;
  }

  private onChangeCallback: (_: any) => void = noop;

  private onTouchedCallback: () => void = noop;

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  ngOnInit(): void {
  }

}
