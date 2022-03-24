import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EmployeeSettingFormOption, EmployeeSettingGet, EmployeeSettingModel } from 'src/app/core/models/configuration/employee-setting.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { AutoMapEmployee, EmployeeFieldMapping } from 'src/app/core/models/enum/enum.model';
import { EmployeeSettingService } from 'src/app/core/services/configuration/employee-setting.service';
import { WindowService } from 'src/app/core/services/core/window.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';

@Component({
  selector: 'app-employee-settings',
  templateUrl: './employee-settings.component.html',
  styleUrls: ['./employee-settings.component.scss']
})
export class EmployeeSettingsComponent implements OnInit {

  employeeSettingsForm: FormGroup;
  isLoading: boolean = true;
  isOnboarding: boolean = false;
  saveInProgress: boolean;
  liveEntityExample: {[EmployeeFieldMapping.EMPLOYEE]: string | undefined, [EmployeeFieldMapping.VENDOR]: string | undefined};
  employeeMappingOptions: EmployeeSettingFormOption[] = [
    {
      value: EmployeeFieldMapping.EMPLOYEE,
      label: 'Employee'
    },
    {
      value: EmployeeFieldMapping.VENDOR,
      label: 'Vendor'
    }
  ];
  autoMapEmployeeOptions: EmployeeSettingFormOption[] = [
    {
      value: '',
      label: 'None'
    },
    {
      value: AutoMapEmployee.NAME,
      label: 'Fyle Name to QBO Display name'
    },
    {
      value: AutoMapEmployee.EMAIL,
      label: 'Fyle Email to QBO Email'
    },
    {
      value: AutoMapEmployee.EMPLOYEE_CODE,
      label: 'Fyle Employee Code to QBO dispay name'
    }
  ];
  windowReference: Window;
  @Output() isLoaded = new EventEmitter<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private employeeSettingService: EmployeeSettingService,
    private mappingService: MappingService,
    private snackBar: MatSnackBar,
    private windowService: WindowService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  navigateToPreviousStep(): void {
    this.router.navigate([`/workspaces/onboarding/qbo_connector`]);
  }

  save(): void {
    if (this.employeeSettingsForm.valid && !this.saveInProgress) {
      const employeeSettingPayload = EmployeeSettingModel.constructPayload(this.employeeSettingsForm);
      console.log('Employee setting payload: ', employeeSettingPayload);
      this.saveInProgress = true;
      this.employeeSettingService.postEmployeeSettings(employeeSettingPayload).subscribe(() => {
        this.saveInProgress = false;
        this.router.navigate([`/workspaces/onboarding/export_settings`]);
      }, () => {
        this.saveInProgress = false;
        this.snackBar.open('Error saving employee settings, please try again later');
      });
    }
  }

  private setLiveEntityExample(destinationAttributes: DestinationAttribute[]): void {
    this.liveEntityExample = {
      [EmployeeFieldMapping.EMPLOYEE]: destinationAttributes.find((attribute: DestinationAttribute) => attribute.attribute_type === EmployeeFieldMapping.EMPLOYEE)?.value,
      [EmployeeFieldMapping.VENDOR]: destinationAttributes.find((attribute: DestinationAttribute) => attribute.attribute_type === EmployeeFieldMapping.VENDOR)?.value
    };
  }

  private setupForm(): void {
    this.isOnboarding = this.windowReference.location.pathname.includes('onboarding');

    forkJoin([
      this.employeeSettingService.getEmployeeSettings(),
      this.mappingService.getDistinctQBODestinationAttributes([EmployeeFieldMapping.EMPLOYEE, EmployeeFieldMapping.VENDOR])
    ]).subscribe((responses) => {
      this.setLiveEntityExample(responses[1]);
      this.employeeSettingsForm = this.formBuilder.group({
        employeeMapping: [responses[0].workspace_general_settings.employee_field_mapping, Validators.required],
        autoMapEmployee: [responses[0].workspace_general_settings.auto_map_employees, Validators.nullValidator]
      });
      this.isLoading = false;
      this.isLoaded.emit(true);
    });
  }

  ngOnInit(): void {
    this.setupForm();
  }

}
