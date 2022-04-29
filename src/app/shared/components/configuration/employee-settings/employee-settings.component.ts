import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EmployeeSettingFormOption, EmployeeSettingGet, EmployeeSettingModel } from 'src/app/core/models/configuration/employee-setting.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { AutoMapEmployee, EmployeeFieldMapping, OnboardingState, ReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { ConfirmationDialog } from 'src/app/core/models/misc/confirmation-dialog.model';
import { EmployeeSettingService } from 'src/app/core/services/configuration/employee-setting.service';
import { ExportSettingService } from 'src/app/core/services/configuration/export-setting.service';
import { WindowService } from 'src/app/core/services/core/window.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { ConfirmationDialogComponent } from '../../core/confirmation-dialog/confirmation-dialog.component';

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
  reimbursableExportType: ReimbursableExpensesObject | undefined | null;
  existingEmployeeFieldMapping: EmployeeFieldMapping | undefined;
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
      value: null,
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
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private employeeSettingService: EmployeeSettingService,
    private exportSettingService: ExportSettingService,
    private mappingService: MappingService,
    private router: Router,
    private snackBar: MatSnackBar,
    private windowService: WindowService,
    private workspaceService: WorkspaceService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  navigateToPreviousStep(): void {
    this.router.navigate(['/workspaces/onboarding/qbo_connector']);
  }

  private showConfirmationDialog(): void {
    const existingEmployeeFieldMapping = this.existingEmployeeFieldMapping?.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
    const updatedEmployeeFieldMapping = this.employeeSettingsForm.value.employeeMapping?.toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase());

    const data: ConfirmationDialog = {
      title: 'Change in Configuration',
      contents: `You are changing your employee representation from <b>${existingEmployeeFieldMapping}</b> to 
        <b>${updatedEmployeeFieldMapping}</b>
        <br>
        This might effect other configurations
        <br><br>
        Do you wish to continue?`,
      primaryCtaText: 'Continue',
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '551px',
      data: data
    });

    dialogRef.afterClosed().subscribe((ctaClicked) => {
      if (ctaClicked) {
        this.constructPayloadAndSave();
      }
    });
  }

  private constructPayloadAndSave(): void {
    const employeeSettingPayload = EmployeeSettingModel.constructPayload(this.employeeSettingsForm);
    this.saveInProgress = true;

    this.employeeSettingService.postEmployeeSettings(employeeSettingPayload).subscribe(() => {
      this.saveInProgress = false;
      this.snackBar.open('Employee settings saved successfully');
      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(OnboardingState.EXPORT_SETTINGS);
        this.router.navigate(['/workspaces/onboarding/export_settings']);
      } else if (this.exportSettingAffected()) {
        this.router.navigate(['/workspaces/main/configuration/export_settings']);
      } else {
        this.router.navigate(['/workspaces/main/dashboard']);
      }
    }, () => {
      this.saveInProgress = false;
      this.snackBar.open('Error saving employee settings, please try again later');
    });
  }

  private exportSettingAffected(): boolean | undefined {
    return this.isNonCompatibleExportType() && this.existingEmployeeFieldMapping && this.existingEmployeeFieldMapping !== this.employeeSettingsForm.value.employeeMapping;
  }

  private isNonCompatibleExportType(): boolean {
    return this.reimbursableExportType === ReimbursableExpensesObject.BILL || this.reimbursableExportType === ReimbursableExpensesObject.CHECK;
  }

  save(): void {
    if (this.employeeSettingsForm.valid && !this.saveInProgress) {
      if (this.exportSettingAffected()) {
        // Show warning dialog
        this.showConfirmationDialog();
        return;
      }
      this.constructPayloadAndSave();
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
      this.mappingService.getDistinctQBODestinationAttributes([EmployeeFieldMapping.EMPLOYEE, EmployeeFieldMapping.VENDOR]),
      this.exportSettingService.getExportSettings()
    ]).subscribe((responses) => {
      this.existingEmployeeFieldMapping = responses[0].workspace_general_settings?.employee_field_mapping;
      this.setLiveEntityExample(responses[1]);
      this.employeeSettingsForm = this.formBuilder.group({
        employeeMapping: [this.existingEmployeeFieldMapping, Validators.required],
        autoMapEmployee: [responses[0].workspace_general_settings?.auto_map_employees, Validators.nullValidator]
      });
      this.reimbursableExportType = responses[2].workspace_general_settings?.reimbursable_expenses_object;
      this.isLoading = false;
      this.isLoaded.emit(true);
    });
  }

  ngOnInit(): void {
    this.setupForm();
  }

}
