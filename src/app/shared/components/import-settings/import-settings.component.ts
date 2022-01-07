import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DestinationAttribute } from 'src/app/core/models/destination-attribute.model';
import { MappingDestinationField } from 'src/app/core/models/enum.model';
import { ExpenseFieldsFormOption, ImportSettingGet, ImportSettingModel } from 'src/app/core/models/import-setting.model';
import { MappingSetting } from 'src/app/core/models/mapping-setting.model';
import { ImportSettingService } from 'src/app/core/services/import-setting.service';
import { MappingService } from 'src/app/core/services/mapping.service';
import { WorkspaceService } from 'src/app/core/services/workspace.service';
import { ExpenseFieldCreationDialogComponent } from './expense-field-creation-dialog/expense-field-creation-dialog.component';

@Component({
  selector: 'app-import-settings',
  templateUrl: './import-settings.component.html',
  styleUrls: ['./import-settings.component.scss']
})
export class ImportSettingsComponent implements OnInit {

  isLoading: boolean = true;
  importSettings: ImportSettingGet;
  importSettingsForm: FormGroup;
  taxCodes: DestinationAttribute[];
  fyleExpenseFields: string[];
  qboExpenseFields: ExpenseFieldsFormOption[];
  chartOfAccountTypesList: string[] = [
    'Expense', 'Other Expense', 'Fixed Assets', 'Cost of Goods Sold', 'Current Liability', 'Equity',
    'Other Current Asset', 'Other Current Liability', 'Long Term Liability', 'Current Asset'
  ];

  constructor(
    public dialog: MatDialog,
    private importSettingService: ImportSettingService,
    private formBuilder: FormBuilder,
    private router: Router,
    private mappingService: MappingService,
    private workspaceService: WorkspaceService
  ) { }

  createChartOfAccountField(type: string): FormGroup {
    return this.formBuilder.group({
      enabled: [this.importSettings.workspace_general_settings.charts_of_accounts.includes(type) ? true : false],
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

  mandatorySourceFieldValidator(): ValidatorFn {
    // Validate mandatory source field if import to fyle is enabled
    return (control: AbstractControl): { [key: string]: object } | null => {
      let sourceFieldNotMapped = false;

      if (this.importSettingsForm) {
        if (control.value && typeof control.value === 'boolean' && !control.parent?.value.source_field && !control.parent?.value.disable_import_to_fyle) {
          sourceFieldNotMapped = true;
        }
      } else {
        // return null if form isn't created
        return null;
      }

      if (sourceFieldNotMapped) {
        return {
          forbiddenOption: { value: control.value }
        };
      } else {
        // clear errors
        control.parent?.get('import_to_fyle')?.setErrors(null);
        return null;
      }
    };
  }

  uniqueSourceMappingValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: object } | null => {
      // Validate duplicate sources
      if (this.importSettingsForm) {
        const existingSources = this.expenseFields.controls.map(field => field.value.source_field);
        if (control.value && existingSources.includes(control.value)) {
          return { duplicateSource: { value: control.value } };
        }
      }

      return null;
    };
  }

  private setupForm(): void {
    const chartOfAccountTypeFormArray = this.chartOfAccountTypesList.map((type) => this.createChartOfAccountField(type));
    const expenseFieldsFormArray = this.qboExpenseFields.map((field) => {
      return this.formBuilder.group({
        source_field: [field.source_field, Validators.compose([this.mandatorySourceFieldValidator(), this.uniqueSourceMappingValidator()])],
        destination_field: [field.destination_field],
        import_to_fyle: [field.import_to_fyle, this.mandatorySourceFieldValidator()],
        disable_import_to_fyle: [field.disable_import_to_fyle]
      })
    });

    this.importSettingsForm = this.formBuilder.group({
      chartOfAccount: [this.importSettings.workspace_general_settings.import_categories],
      chartOfAccountTypes: this.formBuilder.array(chartOfAccountTypeFormArray),
      expenseFields: this.formBuilder.array(expenseFieldsFormArray),
      taxCode: [this.importSettings.workspace_general_settings.import_tax_codes],
      defaultTaxCode: [this.importSettings.general_mappings.default_tax_code?.id]
    });

    this.createTaxCodeWatcher();
    this.isLoading = false;
  }

  private getSettingsAndSetupForm(): void {
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
          disable_import_to_fyle: false
        }
      });

      this.taxCodes = response[2];

      this.setupForm();
    });
  }

  private patchExpenseFieldValue(destinationType: string, sourceField: string = ''): void {
    const expenseField = {
      source_field: sourceField,
      destination_field: destinationType,
      import_to_fyle: true,
      disable_import_to_fyle: true
    };

    this.expenseFields.controls.filter(field => field.value.destination_field === destinationType)[0].patchValue(expenseField);
  }

  createExpenseField(destinationType: string): void {
    const existingFields = this.importSettings.mapping_settings.map(setting => setting.source_field.split('_').join(' '));
    const dialogRef = this.dialog.open(ExpenseFieldCreationDialogComponent, {
      width: '450px',
      data: existingFields
    });

    this.patchExpenseFieldValue(destinationType);

    dialogRef.afterClosed().subscribe((expenseFieldName) => {
      if (expenseFieldName) {
        const sourceType = expenseFieldName.split(' ').join('_').toUpperCase();
        this.fyleExpenseFields.push(sourceType);
        this.patchExpenseFieldValue(destinationType, sourceType);
      }
    });
  }

  save() : void {
    // TODO: check ImportSettingModel class
    const importSettingsPayload = ImportSettingModel.constructPayload(this.importSettingsForm);
    console.log('importSettingPayload',importSettingsPayload);
    this.isLoading = true;
    this.importSettingService.postImportSettings(importSettingsPayload).subscribe(() => {
      this.isLoading = false;
      this.router.navigate([`/workspaces/${this.workspaceService.getWorkspaceId()}/onboarding/advanced_settings`]);
    }, () => {
      this.isLoading = false;
      // TODO: handle error
    });
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}
