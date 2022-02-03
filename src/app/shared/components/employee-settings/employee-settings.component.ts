import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeSettingFormOption, EmployeeSettingGet, EmployeeSettingModel } from 'src/app/core/models/employee-setting.model';
import { AutoMapEmployee, EmployeeFieldMapping } from 'src/app/core/models/enum.model';
import { EmployeeSettingService } from 'src/app/core/services/employee-setting.service';
import { WorkspaceService } from 'src/app/core/services/workspace.service';

@Component({
  selector: 'app-employee-settings',
  templateUrl: './employee-settings.component.html',
  styleUrls: ['./employee-settings.component.scss']
})
export class EmployeeSettingsComponent implements OnInit {

  employeeSettingsForm: FormGroup;
  isLoading: boolean = true;
  workspaceId: string = this.workspaceService.getWorkspaceId();
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

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private employeeSettingService: EmployeeSettingService,
    private workspaceService: WorkspaceService
  ) { }

  navigateToPreviousStep(): void {
    this.router.navigate([`/workspaces/${this.workspaceId}/onboarding/qbo_connector`]);
  }

  save(): void {
    const employeeSettingPayload = EmployeeSettingModel.constructPayload(this.employeeSettingsForm);
    console.log('Employee setting payload: ', employeeSettingPayload);
    this.isLoading = true;
    this.employeeSettingService.postEmployeeSettings(employeeSettingPayload).subscribe(() => {
      this.isLoading = false;
      this.router.navigate([`/workspaces/${this.workspaceId}/onboarding/export_settings`]);
    }, () => {
      this.isLoading = false;
      // TODO: handle error
    });
  }

  private setupForm(): void {
    this.employeeSettingService.getEmployeeSettings().subscribe((employeeSettings: EmployeeSettingGet) => {
      this.employeeSettingsForm = this.formBuilder.group({
        employeeMapping: [employeeSettings.workspace_general_settings.employee_field_mapping, Validators.required],
        autoMapEmployee: [employeeSettings.workspace_general_settings.auto_map_employees, Validators.nullValidator]
      });
      this.isLoading = false;
    }, () => {
      this.employeeSettingsForm = this.formBuilder.group({
        employeeMapping: [null, Validators.required],
        autoMapEmployee: [null, Validators.nullValidator]
      });
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupForm();
  }

}
