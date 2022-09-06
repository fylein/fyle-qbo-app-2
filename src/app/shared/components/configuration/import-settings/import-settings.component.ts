import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ClickEvent, ConfigurationCtaText, MappingDestinationField, OnboardingState, OnboardingStep, ProgressPhase, SimpleSearchPage, SimpleSearchType, UpdateEvent } from 'src/app/core/models/enum/enum.model';
import { ExpenseFieldsFormOption, ImportSettingGet, ImportSettingModel } from 'src/app/core/models/configuration/import-setting.model';
import { MappingSetting } from 'src/app/core/models/db/mapping-setting.model';
import { ImportSettingService } from 'src/app/core/services/configuration/import-setting.service';
import { HelperService } from 'src/app/core/services/core/helper.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { ExpenseFieldCreationDialogComponent } from './expense-field-creation-dialog/expense-field-creation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QboConnectorService } from 'src/app/core/services/configuration/qbo-connector.service';
import { QBOCredentials } from 'src/app/core/models/configuration/qbo-connector.model';
import { WindowService } from 'src/app/core/services/core/window.service';
import { AdvancedSettingGet } from 'src/app/core/models/configuration/advanced-setting.model';
import { AdvancedSettingService } from 'src/app/core/services/configuration/advanced-setting.service';
import { ConfirmationDialog } from 'src/app/core/models/misc/confirmation-dialog.model';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { PreviewDialogComponent } from '../preview-dialog/preview-dialog.component';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { ClickEventAdditionalProperty } from 'src/app/core/models/misc/tracking.model';
import { ConfirmationDialogComponent } from '../../core/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-import-settings',
  templateUrl: './import-settings.component.html',
  styleUrls: ['./import-settings.component.scss']
})
export class ImportSettingsComponent implements OnInit, OnDestroy {

  isLoading: boolean = true;

  saveInProgress: boolean;

  isOnboarding: boolean = false;

  isTaxGroupSyncAllowed: boolean;

  importSettings: ImportSettingGet;

  advancedSettings: AdvancedSettingGet;

  importSettingsForm: FormGroup;

  taxCodes: DestinationAttribute[];

  fyleExpenseFields: string[];

  qboExpenseFields: ExpenseFieldsFormOption[];

  chartOfAccountTypesList: string[] = [
    'Expense', 'Other Expense', 'Fixed Asset', 'Cost of Goods Sold', 'Current Liability', 'Equity',
    'Other Current Asset', 'Other Current Liability', 'Long Term Liability', 'Current Asset'
  ];

  windowReference: Window;

  ConfigurationCtaText = ConfigurationCtaText;

  ProgressPhase = ProgressPhase;

  private readonly sessionStartTime = new Date();

  private timeSpentEventRecorded: boolean = false;

  SimpleSearchPage = SimpleSearchPage;

  SimpleSearchType = SimpleSearchType;

  constructor(
    public dialog: MatDialog,
    private importSettingService: ImportSettingService,
    private formBuilder: FormBuilder,
    public helperService: HelperService,
    private router: Router,
    private mappingService: MappingService,
    private qboConnectorService: QboConnectorService,
    private snackBar: MatSnackBar,
    private trackingService: TrackingService,
    private windowService: WindowService,
    private workspaceService: WorkspaceService,
    private advancedSettingService: AdvancedSettingService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  private showConfirmationDialog(): void {
    const data: ConfirmationDialog = {
      title: 'Change in Configuration',
      contents: `Importing vendors from QuickBooks Online as Merchants in Fyle will allow employees to choose only from the imported list, and they cannot add any new merchants.<br>
      Are you sure you'd like to import vendors from QuickBooks Online?<br><br>`,
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

  createChartOfAccountField(type: string): FormGroup {
    return this.formBuilder.group({
      enabled: [this.importSettings.workspace_general_settings.charts_of_accounts.includes(type) || type === 'Expense' ? true : false],
      name: [type]
    });
  }

  get chartOfAccountTypes() {
    return this.importSettingsForm.get('chartOfAccountTypes') as FormArray;
  }

  get expenseFields() {
    return this.importSettingsForm.get('expenseFields') as FormArray;
  }

  private createTaxCodeWatcher(): void {
    this.importSettingsForm.controls.taxCode.valueChanges.subscribe((isTaxCodeEnabled) => {
      if (isTaxCodeEnabled) {
        this.importSettingsForm.controls.defaultTaxCode.setValidators(Validators.required);
      } else {
        this.importSettingsForm.controls.defaultTaxCode.clearValidators();
        this.importSettingsForm.controls.defaultTaxCode.setValue(null);
      }
    });
  }

  private updateTaxGroupVisibility(): void {
    this.qboConnectorService.getQBOCredentials().subscribe((qboCredentials: QBOCredentials) => {
      if (qboCredentials && qboCredentials.country !== 'US') {
        this.isTaxGroupSyncAllowed = true;
      }
    });
  }

  private setCustomValidatorsAndWatchers(): void {
    this.updateTaxGroupVisibility();
    this.createTaxCodeWatcher();
  }

  private importToggleWatcher(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: object} | null => {
      if (control.value) {
        // Mark Fyle field as mandatory if toggle is enabled
        control.parent?.get('source_field')?.setValidators(Validators.required);
        control.parent?.get('source_field')?.setValidators(RxwebValidators.unique());
      } else {
        // Reset Fyle field if toggle is disabled
        control.parent?.get('source_field')?.clearValidators();
        control.parent?.get('source_field')?.setValue(null);
      }

      return null;
    };
  }

  showImportVendors(): boolean {
    return this.advancedSettings.workspace_general_settings.auto_create_merchants_as_vendors === false;
  }

  private setupForm(): void {
    const chartOfAccountTypeFormArray = this.chartOfAccountTypesList.map((type) => this.createChartOfAccountField(type));
    const expenseFieldsFormArray = this.qboExpenseFields.map((field) => {
      return this.formBuilder.group({
        source_field: [field.source_field],
        destination_field: [field.destination_field],
        import_to_fyle: [field.import_to_fyle, this.importToggleWatcher()],
        disable_import_to_fyle: [field.disable_import_to_fyle],
        source_placeholder: ['']
      });
    });

    this.importSettingsForm = this.formBuilder.group({
      chartOfAccount: [this.importSettings.workspace_general_settings.import_categories],
      chartOfAccountTypes: this.formBuilder.array(chartOfAccountTypeFormArray),
      expenseFields: this.formBuilder.array(expenseFieldsFormArray),
      taxCode: [this.importSettings.workspace_general_settings.import_tax_codes],
      defaultTaxCode: [this.importSettings.general_mappings?.default_tax_code?.id ? this.importSettings.general_mappings.default_tax_code : null],
      searchOption: [],
      importVendorsAsMerchants: [this.importSettings.workspace_general_settings.import_vendors_as_merchants]
    });

    this.setCustomValidatorsAndWatchers();
    this.isLoading = false;
  }

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.windowReference.location.pathname.includes('onboarding');
    forkJoin([
      this.importSettingService.getImportSettings(),
      this.mappingService.getFyleExpenseFields(),
      this.mappingService.getQBODestinationAttributes('TAX_CODE'),
      this.advancedSettingService.getAdvancedSettings()
    ]).subscribe(response => {
      this.importSettings = response[0];
      this.fyleExpenseFields = response[1].map(field => field.attribute_type);
      this.advancedSettings = response[3];

      // Remove custom mapped Fyle options
      const customMappedFyleFields = this.importSettings.mapping_settings.filter(setting => !setting.import_to_fyle).map(setting => setting.source_field);
      const customMappedQboFields = this.importSettings.mapping_settings.filter(setting => !setting.import_to_fyle).map(setting => setting.destination_field);
      if (customMappedFyleFields.length) {
        this.fyleExpenseFields = this.fyleExpenseFields.filter(field => !customMappedFyleFields.includes(field));
      }

      // Remove custom mapped QBO fields
      const qboAttributes = [MappingDestinationField.CLASS, MappingDestinationField.DEPARTMENT, MappingDestinationField.CUSTOMER].filter(
        field => !customMappedQboFields.includes(field)
      );

      this.qboExpenseFields = qboAttributes.map(attribute => {
        const mappingSetting = this.importSettings.mapping_settings.filter((mappingSetting: MappingSetting) => mappingSetting.destination_field === attribute);
        return {
          source_field: mappingSetting.length > 0 ? mappingSetting[0].source_field : '',
          destination_field: attribute,
          import_to_fyle: mappingSetting.length > 0 ? mappingSetting[0].import_to_fyle : false,
          disable_import_to_fyle: false,
          source_placeholder: ''
        };
      });

      this.taxCodes = response[2];

      this.setupForm();
    });
  }

  private patchExpenseFieldValue(destinationType: string, sourceField: string = '', source_placeholder: string = ''): void {
    const expenseField = {
      source_field: sourceField,
      destination_field: destinationType,
      import_to_fyle: sourceField ? true : false,
      disable_import_to_fyle: sourceField ? true : false,
      source_placeholder: source_placeholder
    };

    this.expenseFields.controls.filter(field => field.value.destination_field === destinationType)[0].patchValue(expenseField);
  }

  showFyleExpenseFormPreview(): void {
    const additionalProperties: Partial<ClickEventAdditionalProperty> = {
      phase: this.isOnboarding ? ProgressPhase.ONBOARDING : ProgressPhase.POST_ONBOARDING
    };

    this.trackingService.onClickEvent(ClickEvent.PREVIEW_FYLE_EXPENSE_FORM, additionalProperties);
    this.dialog.open(PreviewDialogComponent, {
      width: '560px',
      height: '770px',
      data: {
        fyleExpense: true
      }
    });
  }

  createExpenseField(destinationType: string): void {
    const existingFields = this.importSettings.mapping_settings.map(setting => setting.source_field.split('_').join(' '));
    const dialogRef = this.dialog.open(ExpenseFieldCreationDialogComponent, {
      width: '551px',
      data: existingFields
    });

    this.patchExpenseFieldValue(destinationType);

    dialogRef.afterClosed().subscribe((expenseField) => {
      if (expenseField) {
        const sourceType = expenseField.name.split(' ').join('_').toUpperCase();
        this.fyleExpenseFields.push(sourceType);
        this.patchExpenseFieldValue(destinationType, sourceType, expenseField.source_placeholder);
      }
    });
  }

  navigateToPreviousStep(): void {
    this.router.navigate([`/workspaces/onboarding/export_settings`]);
  }

  private getPhase(): ProgressPhase {
    return this.isOnboarding ? ProgressPhase.ONBOARDING : ProgressPhase.POST_ONBOARDING;
  }

  private trackSessionTime(eventState: 'success' | 'navigated'): void {
    const differenceInMs = new Date().getTime() - this.sessionStartTime.getTime();

    this.timeSpentEventRecorded = true;
    this.trackingService.trackTimeSpent(OnboardingStep.IMPORT_SETTINGS, {phase: this.getPhase(), durationInSeconds: Math.floor(differenceInMs / 1000), eventState: eventState});
  }

  private importSettingAffected(): boolean | undefined {
    return this.importSettingsForm.value.importVendorsAsMerchants;
  }

  private constructPayloadAndSave(): void {
    const customMappingSettings = this.importSettings.mapping_settings.filter(setting => !setting.import_to_fyle);
    const importSettingsPayload = ImportSettingModel.constructPayload(this.importSettingsForm, customMappingSettings);
    this.saveInProgress = true;

    this.importSettingService.postImportSettings(importSettingsPayload).subscribe((response: ImportSettingGet) => {
      if (this.workspaceService.getOnboardingState() === OnboardingState.IMPORT_SETTINGS) {
        this.trackingService.onOnboardingStepCompletion(OnboardingStep.IMPORT_SETTINGS, 4, importSettingsPayload);
      } else {
        this.trackingService.onUpdateEvent(
          UpdateEvent.IMPORT_SETTINGS,
          {
            phase: this.getPhase(),
            oldState: this.importSettings,
            newState: response
          }
        );
      }

      this.saveInProgress = false;
      this.snackBar.open('Import settings saved successfully');
      this.trackSessionTime('success');
      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(OnboardingState.ADVANCED_CONFIGURATION);
        this.router.navigate([`/workspaces/onboarding/advanced_settings`]);
      } else {
        this.mappingService.refreshMappingPages();
        this.router.navigate(['/workspaces/main/dashboard']);
      }
    }, () => {
      this.saveInProgress = false;
      this.snackBar.open('Error saving import settings, please try again later');
    });
  }

  save(): void {
    if (this.importSettingsForm.valid && !this.saveInProgress) {
      if (this.importSettingAffected()) {
        this.showConfirmationDialog();
        return;
      }
      this.constructPayloadAndSave();
    }
  }

  ngOnDestroy(): void {
    if (!this.timeSpentEventRecorded) {
      this.trackSessionTime('navigated');
    }
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}
