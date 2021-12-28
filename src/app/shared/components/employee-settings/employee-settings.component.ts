import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeSettingFormOptions, EmployeeSettingModel } from 'src/app/core/models/employee-setting.model';
import { AutoMapEmployee, EmployeeFieldMapping } from 'src/app/core/models/enum.model';
import { WorkspaceGeneralSettings } from 'src/app/core/models/workspace-general-setting.model';
import { WorkspaceService } from 'src/app/core/services/workspace.service';

@Component({
  selector: 'app-employee-settings',
  templateUrl: './employee-settings.component.html',
  styleUrls: ['./employee-settings.component.scss']
})
export class EmployeeSettingsComponent implements OnInit {

  employeeSettingsForm: FormGroup;
  workspaceGeneralSettings: WorkspaceGeneralSettings;
  isLoading: boolean;
  employeeMappingOptions: EmployeeSettingFormOptions[] = [
    {
      value: EmployeeFieldMapping.EMPLOYEE,
      label: 'Employee'
    },
    {
      value: EmployeeFieldMapping.VENDOR,
      label: 'Vendor'
    }
  ];
  autoMapEmployeeOptions: EmployeeSettingFormOptions[] = [
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
    },
    {
      value: '',
      label: 'None'
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private workspaceService: WorkspaceService
  ) { }

  save(): void {
    console.log('this.employeeSettingsForm',this.employeeSettingsForm)
    const employeeSettingPayload = EmployeeSettingModel.constructPayload(this.employeeSettingsForm);
    console.log('Employee setting payload: ', employeeSettingPayload);
    this.router.navigate([`/workspaces/${this.workspaceService.getWorkspaceId()}/onboarding/import_settings`]);
  }

  setupForm(): void {
    this.employeeSettingsForm = this.formBuilder.group({
      employeeMapping: [this.workspaceGeneralSettings ? this.workspaceGeneralSettings.reimbursable_expenses_object : null, Validators.required],
      autoMapEmployee: [this.workspaceGeneralSettings ? this.workspaceGeneralSettings.auto_map_employees : null, Validators.nullValidator]
    });
    this.isLoading = false;
  }

  ngOnInit(): void {
    this.setupForm();
  }

}
