import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { DestinationAttribute } from 'src/app/core/models/destination-attribute.model';
import { MappingDestinationField, MappingSourceField } from 'src/app/core/models/enum.model';
import { ExpenseField } from 'src/app/core/models/expense-field.model';
import { ExpenseFieldsFormOption, ImportSettingGet, ImportSettingMappingSetting, ImportSettingModel } from 'src/app/core/models/import-setting.model';
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
  fyleExpenseFields: ExpenseFieldsFormOption[];
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
    // TODO: implement import to fyle toggle
    const chartOfAccountTypeFormArray = this.chartOfAccountTypesList.map((type) => this.createChartOfAccountField(type));
    const classMapping = this.importSettings.mapping_settings.filter(setting => setting.destination_field === MappingDestinationField.CLASS);
    const departmentMapping = this.importSettings.mapping_settings.filter(setting => setting.destination_field === MappingDestinationField.DEPARTMENT);
    const customerMapping = this.importSettings.mapping_settings.filter(setting => setting.destination_field === MappingDestinationField.CUSTOMER);

    this.importSettingsForm = this.formBuilder.group({
      chartOfAccount: [this.importSettings.workspace_general_settings.import_categories],
      chartOfAccountTypes: this.formBuilder.array(chartOfAccountTypeFormArray),
      class: [classMapping.length > 0],
      classMapping: [classMapping.length > 0 ? classMapping[0] : null],
      department: [departmentMapping.length > 0],
      departmentMapping: [departmentMapping.length > 0 ? departmentMapping[0] : null],
      customer: [customerMapping.length > 0],
      customerMapping: [customerMapping.length > 0 ? customerMapping[0] : null],
      taxCode: [this.importSettings.workspace_general_settings.import_tax_codes],
      defaultTaxCode: [this.importSettings.general_mappings.default_tax_code]
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
      console.log(response[0])
      this.importSettings = response[0];

      this.fyleExpenseFields = response[1].map(field => {
        const mappingSetting = this.importSettings.mapping_settings.filter((mappingSetting: MappingSetting) => mappingSetting.source_field === field.attribute_type);
        return {
          display_name: field.display_name,
          source_field: field.attribute_type,
          destination_field: '',
          import_to_fyle: mappingSetting.length > 0 ? mappingSetting[0].import_to_fyle : false,
          is_custom: field.attribute_type !== MappingSourceField.COST_CENTER && field.attribute_type !== MappingSourceField.PROJECT ? true : false
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
          display_name: expenseFieldName,
          source_field: attributeType,
          destination_field: destinationType,
          import_to_fyle: true,
          is_custom: true
        };
        this.fyleExpenseFields.push(expenseField);
        destinationType === MappingDestinationField.CLASS ? this.importSettingsForm.get('classMapping')?.setValue(expenseField) : null;
        destinationType === MappingDestinationField.DEPARTMENT ? this.importSettingsForm.get('departmentMapping')?.setValue(expenseField) : null;
        destinationType === MappingDestinationField.CUSTOMER ? this.importSettingsForm.get('customerMapping')?.setValue(expenseField) : null;
      }
    });
  }

  save() : void {
    console.log('this.importSettingsForm.value',this.importSettingsForm.value)
    // TODO: check ImportSettingModel class
    const importSettingsPayload = new ImportSettingModel().constructPayload(this.importSettingsForm);
    console.log('importSettingPayload',importSettingsPayload);
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}
