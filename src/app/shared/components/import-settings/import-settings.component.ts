import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { MappingDestinationField } from 'src/app/core/models/enum.model';
import { ImportSettingGet } from 'src/app/core/models/import-setting.model';
import { ImportSettingService } from 'src/app/core/services/import-setting.service';

@Component({
  selector: 'app-import-settings',
  templateUrl: './import-settings.component.html',
  styleUrls: ['./import-settings.component.scss']
})
export class ImportSettingsComponent implements OnInit {

  isLoading: boolean = true;
  importSettings: ImportSettingGet;
  importSettingsForm: FormGroup;
  chartOfAccountTypesList: string[] = [
    'Expense', 'Other Expense', 'Fixed Assets', 'Cost of Goods Sold', 'Current Liability', 'Equity',
    'Other Current Asset', 'Other Current Liability', 'Long Term Liability', 'Current Asset'
  ];

  constructor(
    private importSettingService: ImportSettingService,
    private formBuilder: FormBuilder
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

  private setupForm(): void {
    const chartOfAccountTypeFormArray = this.chartOfAccountTypesList.map((type) => this.createChartOfAccountField(type));

    this.importSettingsForm = this.formBuilder.group({
      chartOfAccount: [this.importSettings.workspace_general_settings.import_categories],
      chartOfAccountTypes: this.formBuilder.array(chartOfAccountTypeFormArray),
      class: [this.importSettings.mapping_settings.filter(setting => setting.destination_field === MappingDestinationField.CLASS).length > 0],
      department: [this.importSettings.mapping_settings.filter(setting => setting.destination_field === MappingDestinationField.DEPARTMENT).length > 0],
      customer: [this.importSettings.mapping_settings.filter(setting => setting.destination_field === MappingDestinationField.CUSTOMER).length > 0],
    });

    // this.setCustomValidators();
    this.isLoading = false;
  }

  private getSettingsAndSetupForm(): void {
    forkJoin([
      this.importSettingService.getImportSettings()
    ]).subscribe(response => {
      this.importSettings = response[0];

      this.setupForm();
    });
  }

  save() : void {
    console.log('this.importSettingsForm.value',this.importSettingsForm.value)
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}
