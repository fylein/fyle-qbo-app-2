import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Validators, UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EmployeeSettingFormOption, EmployeeSettingGet, EmployeeSettingModel } from 'src/app/core/models/configuration/employee-setting.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ConfigurationCtaText, EmployeeFieldMapping, OnboardingState, OnboardingStep, ProgressPhase, ReimbursableExpensesObject, UpdateEvent } from 'src/app/core/models/enum/enum.model';
import { ConfirmationDialog } from 'src/app/core/models/misc/confirmation-dialog.model';
import { EmployeeSettingService } from 'src/app/core/services/configuration/employee-setting.service';
import { ExportSettingService } from 'src/app/core/services/configuration/export-setting.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { WindowService } from 'src/app/core/services/core/window.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { ConfirmationDialogComponent } from '../../core/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-employee-settings',
  templateUrl: './employee-settings.component.html',
  styleUrls: ['./employee-settings.component.scss']
})
export class EmployeeSettingsComponent implements OnInit, OnDestroy {

  employeeSettingsForm: UntypedFormGroup;

  isLoading: boolean = true;

  isOnboarding: boolean = false;

  saveInProgress: boolean;

  liveEntityExample: {[EmployeeFieldMapping.EMPLOYEE]: string | undefined, [EmployeeFieldMapping.VENDOR]: string | undefined};

  reimbursableExportType: ReimbursableExpensesObject | undefined | null;

  existingEmployeeFieldMapping: EmployeeFieldMapping | undefined;

  employeeMappingOptions: EmployeeSettingFormOption[] = this.employeeSettingService.getEmployeeFieldMappingOptions();

  autoMapEmployeeOptions: EmployeeSettingFormOption[] = this.employeeSettingService.getAutoMapEmployeeOptions();

  windowReference: Window;

  ConfigurationCtaText = ConfigurationCtaText;

  private employeeSetting: EmployeeSettingGet;

  private readonly sessionStartTime = new Date();

  private timeSpentEventRecorded: boolean = false;

  constructor(
    private dialog: MatDialog,
    private formBuilder: UntypedFormBuilder,
    private employeeSettingService: EmployeeSettingService,
    private exportSettingService: ExportSettingService,
    private mappingService: MappingService,
    private router: Router,
    private snackBar: MatSnackBar,
    private trackingService: TrackingService,
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
      contents: `You are changing your employee representation from <b>${existingEmployeeFieldMapping}</b> to <b>${updatedEmployeeFieldMapping}</b>
        <br><br>This will impact the configuration in the <b>Export settings</b> on How the export of expenses
        can be exported from Fyle to QuickBooks Online.<br><br>
        Would you like to continue? If yes, you will be redirected to <b>Export settings</b> to revisit the configuration and complete it.`,
      primaryCtaText: 'Continue'
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

  private getPhase(): ProgressPhase {
    return this.isOnboarding ? ProgressPhase.ONBOARDING : ProgressPhase.POST_ONBOARDING;
  }

  private trackSessionTime(eventState: 'success' | 'navigated'): void {
    const differenceInMs = new Date().getTime() - this.sessionStartTime.getTime();

    this.timeSpentEventRecorded = true;
    this.trackingService.trackTimeSpent(OnboardingStep.MAP_EMPLOYEES, {phase: this.getPhase(), durationInSeconds: Math.floor(differenceInMs / 1000), eventState: eventState});
  }

  private constructPayloadAndSave(): void {
    const employeeSettingPayload = EmployeeSettingModel.constructPayload(this.employeeSettingsForm);
    this.saveInProgress = true;

    this.employeeSettingService.postEmployeeSettings(employeeSettingPayload).subscribe((response: EmployeeSettingGet) => {
      if (!this.existingEmployeeFieldMapping) {
        this.trackingService.onOnboardingStepCompletion(OnboardingStep.MAP_EMPLOYEES, 2, employeeSettingPayload);
      } else {
        this.trackingService.onUpdateEvent(
          UpdateEvent.MAP_EMPLOYEES,
          {
            phase: this.getPhase(),
            oldState: this.employeeSetting,
            newState: response
          }
        );
      }

      this.saveInProgress = false;
      this.snackBar.open('Employee settings saved successfully');
      this.trackSessionTime('success');
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
    return this.existingEmployeeFieldMapping && this.existingEmployeeFieldMapping !== this.employeeSettingsForm.value.employeeMapping;
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
      this.employeeSetting = responses[0];
      this.existingEmployeeFieldMapping = responses[0].workspace_general_settings?.employee_field_mapping;
      this.setLiveEntityExample(responses[1]);
      this.employeeSettingsForm = this.formBuilder.group({
        employeeMapping: [this.existingEmployeeFieldMapping, Validators.required],
        autoMapEmployee: [responses[0].workspace_general_settings?.auto_map_employees]
      });
      this.reimbursableExportType = responses[2].workspace_general_settings?.reimbursable_expenses_object;
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    if (!this.timeSpentEventRecorded) {
      this.trackSessionTime('navigated');
    }
  }

  ngOnInit(): void {
    this.setupForm();
  }
}
