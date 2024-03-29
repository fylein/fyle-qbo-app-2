import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ClickEvent, ConfigurationCtaText, MappingDestinationField, OnboardingState, OnboardingStep, ProgressPhase, SimpleSearchPage, SimpleSearchType, UpdateEvent, ReimbursableExpensesObject, CorporateCreditCardExpensesObject } from 'src/app/core/models/enum/enum.model';
import { ExpenseFieldsFormOption, ImportSettingGet, ImportSettingModel } from 'src/app/core/models/configuration/import-setting.model';
import { MappingSetting } from 'src/app/core/models/db/mapping-setting.model';
import { ImportSettingService } from 'src/app/core/services/configuration/import-setting.service';
import { HelperService } from 'src/app/core/services/core/helper.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { ExpenseFieldCreationDialogComponent } from './expense-field-creation-dialog/expense-field-creation-dialog.component';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { QboConnectorService } from 'src/app/core/services/configuration/qbo-connector.service';
import { QBOCredentials } from 'src/app/core/models/configuration/qbo-connector.model';
import { WindowService } from 'src/app/core/services/core/window.service';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { PreviewDialogComponent } from '../preview-dialog/preview-dialog.component';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { ClickEventAdditionalProperty } from 'src/app/core/models/misc/tracking.model';
import { WorkspaceGeneralSetting } from 'src/app/core/models/db/workspace-general-setting.model';

@Component({
  selector: 'app-import-settings',
  templateUrl: './import-settings.component.html',
  styleUrls: ['./import-settings.component.scss']
})
export class ImportSettingsComponent implements OnInit, OnDestroy {

  isLoading: boolean = true;

  saveInProgress: boolean;

  workspaceGeneralSettings: WorkspaceGeneralSetting;

  isOnboarding: boolean = false;

  isTaxGroupSyncAllowed: boolean;

  importSettings: ImportSettingGet;

  autoCreateMerchantsAsVendors: boolean;

  importSettingsForm: UntypedFormGroup;

  taxCodes: DestinationAttribute[];

  fyleExpenseFields: string[];

  qboExpenseFields: ExpenseFieldsFormOption[];

  chartOfAccountTypesList: string[] = [
    'Expense', 'Other Expense', 'Fixed Asset', 'Cost of Goods Sold', 'Current Liability', 'Equity',
    'Other Current Asset', 'Other Current Liability', 'Long Term Liability', 'Current Asset', 'Income', 'Other Income'
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
    private formBuilder: UntypedFormBuilder,
    public helperService: HelperService,
    private router: Router,
    private mappingService: MappingService,
    private qboConnectorService: QboConnectorService,
    private snackBar: MatSnackBar,
    private trackingService: TrackingService,
    private windowService: WindowService,
    private workspaceService: WorkspaceService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  createChartOfAccountField(type: string): UntypedFormGroup {
    return this.formBuilder.group({
      enabled: [this.importSettings.workspace_general_settings.charts_of_accounts.includes(type) || type === 'Expense' ? true : false],
      name: [type]
    });
  }

  get chartOfAccountTypes() {
    return this.importSettingsForm.get('chartOfAccountTypes') as UntypedFormArray;
  }

  get expenseFields() {
    return this.importSettingsForm.get('expenseFields') as UntypedFormArray;
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

  private setupExpenseFieldWatcher(): void {
    this.importSettingService.patchExpenseFieldEmitter.subscribe((expenseField) => {
      if (expenseField.addSourceField) {
        this.fyleExpenseFields.push(expenseField.source_field);
      }
      this.expenseFields.controls.filter(field => field.value.destination_field === expenseField.destination_field)[0].patchValue(expenseField);
    });
  }

  private setCustomValidatorsAndWatchers(): void {
    this.setupExpenseFieldWatcher();
    this.updateTaxGroupVisibility();
    this.createTaxCodeWatcher();
  }

  showImportVendors(): boolean {
    return !this.autoCreateMerchantsAsVendors;
  }

  private setupForm(): void {
    const chartOfAccountTypeFormArray = this.chartOfAccountTypesList.map((type) => this.createChartOfAccountField(type));
    const expenseFieldsFormArray = this.importSettingService.getExpenseFieldsFormArray(this.qboExpenseFields, true);

    this.importSettingsForm = this.formBuilder.group({
      chartOfAccount: [this.importSettings.workspace_general_settings.import_categories],
      importItems: [this.importSettings.workspace_general_settings.import_items],
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
      this.workspaceService.getWorkspaceGeneralSettings()
    ]).subscribe(response => {
      this.importSettings = response[0];
      this.fyleExpenseFields = response[1].map(field => field.attribute_type);
      this.autoCreateMerchantsAsVendors = response[3].auto_create_merchants_as_vendors;
      this.workspaceGeneralSettings = response[3];

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
