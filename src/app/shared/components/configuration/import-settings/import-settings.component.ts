import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ConfigurationCtaText, MappingDestinationField, OnboardingState } from 'src/app/core/models/enum/enum.model';
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
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { PreviewDialogComponent } from '../preview-dialog/preview-dialog.component';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';

@Component({
  selector: 'app-import-settings',
  templateUrl: './import-settings.component.html',
  styleUrls: ['./import-settings.component.scss']
})
export class ImportSettingsComponent implements OnInit {

  isLoading: boolean = true;
  saveInProgress: boolean;
  isOnboarding: boolean = false;
  isTaxGroupSyncAllowed: boolean;
  importSettings: ImportSettingGet;
  importSettingsForm: FormGroup;
  taxCodes: DestinationAttribute[];
  fyleExpenseFields: string[];
  qboExpenseFields: ExpenseFieldsFormOption[];
  chartOfAccountTypesList: string[] = [
    'Expense', 'Other Expense', 'Fixed Asset', 'Cost of Goods Sold', 'Current Liability', 'Equity',
    'Other Current Asset', 'Other Current Liability', 'Long Term Liability', 'Current Asset'
  ];
  windowReference: Window;
  @Output() isLoaded = new EventEmitter<boolean>();
  ConfigurationCtaText = ConfigurationCtaText;

  constructor(
    public dialog: MatDialog,
    private importSettingService: ImportSettingService,
    private formBuilder: FormBuilder,
    public helperService: HelperService,
    private router: Router,
    private mappingService: MappingService,
    private qboConnectorService: QboConnectorService,
    private snackBar: MatSnackBar,
    private windowService: WindowService,
    private workspaceService: WorkspaceService
  ) {
    this.windowReference = this.windowService.nativeWindow;
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
        control.parent?.get('source_field')?.setValidators(Validators.required)
      } else {
        // Reset Fyle field if toggle is disabled
        control.parent?.get('source_field')?.clearValidators();
        control.parent?.get('source_field')?.setValue(null);
      }

      return null;
    };
  }

  private setupForm(): void {
    const chartOfAccountTypeFormArray = this.chartOfAccountTypesList.map((type) => this.createChartOfAccountField(type));
    const expenseFieldsFormArray = this.qboExpenseFields.map((field) => {
      return this.formBuilder.group({
        source_field: [field.source_field, RxwebValidators.unique()],
        destination_field: [field.destination_field],
        import_to_fyle: [field.import_to_fyle, this.importToggleWatcher()],
        disable_import_to_fyle: [field.disable_import_to_fyle],
        source_placeholder: ['']
      })
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
    this.isLoaded.emit(true);
  }

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.windowReference.location.pathname.includes('onboarding');
    forkJoin([
      this.importSettingService.getImportSettings(),
      this.mappingService.getFyleExpenseFields(),
      this.mappingService.getQBODestinationAttributes('TAX_CODE')
    ]).subscribe(response => {
      this.importSettings = response[0];
      const qboAttributes = [MappingDestinationField.CLASS, MappingDestinationField.DEPARTMENT, MappingDestinationField.CUSTOMER];

      this.fyleExpenseFields = response[1].map(field => field.attribute_type);

      this.qboExpenseFields = qboAttributes.map(attribute => {
        const mappingSetting = this.importSettings.mapping_settings.filter((mappingSetting: MappingSetting) => mappingSetting.destination_field === attribute);
        return {
          source_field: mappingSetting.length > 0 ? mappingSetting[0].source_field : '',
          destination_field: attribute,
          import_to_fyle: mappingSetting.length > 0 ? mappingSetting[0].import_to_fyle : false,
          disable_import_to_fyle: false,
          source_placeholder: ''
        }
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

  save(): void {
    if (this.importSettingsForm.valid && !this.saveInProgress) {
      const importSettingsPayload = ImportSettingModel.constructPayload(this.importSettingsForm);
      this.saveInProgress = true;

      this.importSettingService.postImportSettings(importSettingsPayload).subscribe(() => {
        this.saveInProgress = false;
        this.snackBar.open('Import settings saved successfully');
        if (this.isOnboarding) {
          this.workspaceService.setOnboardingState(OnboardingState.ADVANCED_CONFIGURATION);
          this.router.navigate([`/workspaces/onboarding/advanced_settings`]);
        } else {
          const navigationExtras: NavigationExtras = {
            queryParams: {
              refreshMappings: true
            }
          };
          this.router.navigate(['/workspaces/main/dashboard'], navigationExtras);
        }
      }, () => {
        this.saveInProgress = false;
        this.snackBar.open('Error saving import settings, please try again later');
      });
    }
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}
