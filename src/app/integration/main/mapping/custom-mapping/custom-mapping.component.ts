import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { forkJoin } from 'rxjs';
import { MappingSetting, MappingSettingList } from 'src/app/core/models/db/mapping-setting.model';
import { MappingList, MappingStats } from 'src/app/core/models/db/mapping.model';
import { MappingDestinationField, MappingSourceField, ZeroStatePage } from 'src/app/core/models/enum/enum.model';
import { ExpenseField } from 'src/app/core/models/misc/expense-field.model';
import { MappingService } from 'src/app/core/services/misc/mapping.service';

@Component({
  selector: 'app-custom-mapping',
  templateUrl: './custom-mapping.component.html',
  styleUrls: ['./custom-mapping.component.scss']
})
export class CustomMappingComponent implements OnInit {

  isLoading: boolean = true;

  showAddButton: boolean;

  mappingStats: Partial<MappingStats> = {
    all_attributes_count: 3
  };

  showMappingList: boolean = false;

  ZeroStatePage = ZeroStatePage;

  mappingRows: MatTableDataSource<MappingSettingList> = new MatTableDataSource<MappingSettingList>([]);

  qboFields: MappingDestinationField[] = [MappingDestinationField.CLASS, MappingDestinationField.DEPARTMENT, MappingDestinationField.CUSTOMER];

  fyleFields: ExpenseField[];

  displayedColumns: string[] = ['qbo', 'fyle', 'cta', 'clear', 'delete'];

  mappingSettingForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private mappingService: MappingService
  ) { }

  displayMappingList(): void {
    this.mappingRows.data = this.mappingRows.data.concat([{ qboField: '', fyleField: '', index: this.mappingRows.data.length, existingMapping: false, isDeleteButtonAllowed: false }]);

    const row = this.formBuilder.group({
      qboField: ['', [Validators.required, RxwebValidators.unique()]],
      fyleField: ['', [Validators.required, RxwebValidators.unique()]],
      index: [this.mappingRows.data.length],
      existingMapping: [false]
    });
    this.mappingSetting.push(row);
    this.showMappingList = true;
  }

  updateMappingRow(index: number, qboField: MappingDestinationField | '' = '', fyleField: MappingSourceField | string | '' = ''): void {
    if (qboField) {
      this.mappingRows.data[index].qboField = qboField;
    } else if (fyleField) {
      this.mappingRows.data[index].fyleField = fyleField;
    }
  }

  clearMappingRow(index: number): void {
    this.mappingSetting.controls[index].get('qboField')?.setValue('');
    this.mappingSetting.controls[index].get('fyleField')?.setValue('');
    this.mappingRows.data[index].qboField = '';
    this.mappingRows.data[index].fyleField = '';
  }

  saveMappingSetting(index: number): void {
    if (this.mappingSettingForm.valid) {
      // TODO: save mapping setting
    }
  }

  showDeleteButton(mappingRow: MappingSettingList, allowed: boolean): void {
    mappingRow.isDeleteButtonAllowed = allowed;
  }

  get mappingSetting() {
    return this.mappingSettingForm.get('mappingSetting') as FormArray;
  }

  private setupPage(): void {
    forkJoin([
      this.mappingService.getMappingSettings(),
      this.mappingService.getFyleExpenseFields()
    ]).subscribe(responses => {
      this.fyleFields = responses[1];
      const importedQBOFields = responses[0].results.filter((mappingSetting: MappingSetting) => {
        return (mappingSetting.destination_field === MappingDestinationField.CLASS || mappingSetting.destination_field === MappingDestinationField.DEPARTMENT || mappingSetting.destination_field === MappingDestinationField.CUSTOMER) && mappingSetting.import_to_fyle;
      }).map((mappingSetting: MappingSetting) => mappingSetting.destination_field);

      this.qboFields = this.qboFields.filter((qboField: MappingDestinationField) => !importedQBOFields.includes(qboField));

      const mappedRows = responses[0].results.filter((mappingSetting: MappingSetting) => {
        return (mappingSetting.destination_field === MappingDestinationField.CLASS || mappingSetting.destination_field === MappingDestinationField.DEPARTMENT || mappingSetting.destination_field === MappingDestinationField.CUSTOMER) && !mappingSetting.import_to_fyle;
      }).map((mappingSetting, index) => {
        const mappedRow: MappingSettingList = {
          qboField: mappingSetting.destination_field,
          fyleField: mappingSetting.source_field,
          index: index,
          existingMapping: true,
          isDeleteButtonAllowed: true
        };
        return mappedRow;
      });

      const mappedRowsFormArray = mappedRows.map((mappingSetting, index) => {
        return this.formBuilder.group({
          qboField: [mappingSetting.qboField, [Validators.required, RxwebValidators.unique()]],
          fyleField: [mappingSetting.fyleField, [Validators.required, RxwebValidators.unique()]],
          index: [index],
          existingMapping: [true]
        });
      });

      this.mappingSettingForm = this.formBuilder.group({
        mappingSetting: this.formBuilder.array(mappedRowsFormArray)
      });

      this.mappingRows = new MatTableDataSource(mappedRows);

      if (this.mappingRows.data) {
        this.showMappingList = true;
      }

      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
