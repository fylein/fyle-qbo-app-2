import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { DestinationAttribute } from 'src/app/core/models/destination-attribute.model';
import { MappingDestinationField, MappingSourceField } from 'src/app/core/models/enum.model';
import { ExpenseFieldsFormOption, ImportSettingGet, ImportSettingModel } from 'src/app/core/models/import-setting.model';
import { MappingSetting } from 'src/app/core/models/mapping-setting.model';
import { ImportSettingService } from 'src/app/core/services/import-setting.service';
import { MappingService } from 'src/app/core/services/mapping.service';
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
    private mappingService: MappingService
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

  private setupForm(): void {
    const chartOfAccountTypeFormArray = this.chartOfAccountTypesList.map((type) => this.createChartOfAccountField(type));
    const expenseFieldsFormArray = this.qboExpenseFields.map((field) => this.formBuilder.group(field));

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

  createExpenseField(destinationType: string): void {
    const existingFields = this.importSettings.mapping_settings.map(setting => setting.source_field.split('_').join(' '));
    const dialogRef = this.dialog.open(ExpenseFieldCreationDialogComponent, {
      width: '450px',
      data: existingFields
    });

    dialogRef.afterClosed().subscribe((expenseFieldName) => {
      if (expenseFieldName) {
        const attributeType = expenseFieldName.split(' ').join('_').toUpperCase();
        const expenseField = {
          source_field: attributeType,
          destination_field: destinationType,
          import_to_fyle: true,
          disable_import_to_fyle: true
        };
        this.fyleExpenseFields.push(attributeType);
        this.expenseFields.controls.filter(field => field.value.destination_field === destinationType)[0].setValue(expenseField);
      }
    });
  }

  save() : void {
    console.log('this.importSettingsForm.value',this.importSettingsForm.value)
    // TODO: check ImportSettingModel class
    const importSettingsPayload = ImportSettingModel.constructPayload(this.importSettingsForm);
    console.log('importSettingPayload',importSettingsPayload);
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}
