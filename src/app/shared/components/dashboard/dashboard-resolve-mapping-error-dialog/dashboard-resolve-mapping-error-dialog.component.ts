import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { EmployeeMappingModel } from 'src/app/core/models/db/employee-mapping.model';
import { Error } from 'src/app/core/models/db/error.model';
import { MinimalMappingSetting } from 'src/app/core/models/db/mapping-setting.model';
import { MappingList, MappingModel, ResolveMappingError } from 'src/app/core/models/db/mapping.model';
import { WorkspaceGeneralSetting } from 'src/app/core/models/db/workspace-general-setting.model';
import { EmployeeFieldMapping, MappingState, SimpleSearchPage, SimpleSearchType } from 'src/app/core/models/enum/enum.model';
import { HelperService } from 'src/app/core/services/core/helper.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';

@Component({
  selector: 'app-dashboard-resolve-mapping-error-dialog',
  templateUrl: './dashboard-resolve-mapping-error-dialog.component.html',
  styleUrls: ['./dashboard-resolve-mapping-error-dialog.component.scss']
})
export class DashboardResolveMappingErrorDialogComponent implements OnInit {

  isLoading: boolean = true;

  workspaceGeneralSetting: WorkspaceGeneralSetting;

  mappings: MatTableDataSource<MappingList> = new MatTableDataSource<MappingList>([]);

  mappingForm: UntypedFormGroup[];

  qboData: DestinationAttribute[];

  displayedColumns: string[] = ['fyle', 'qbo'];

  form: UntypedFormGroup;

  fyleQboMappingFormArray: UntypedFormGroup[];

  SimpleSearchPage = SimpleSearchPage;

  SimpleSearchType = SimpleSearchType;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ResolveMappingError,
    public dialogRef: MatDialogRef<DashboardResolveMappingErrorDialogComponent>,
    private formBuilder: UntypedFormBuilder,
    public helperService: HelperService,
    private mappingService: MappingService,
    private snackBar: MatSnackBar,
    private workspaceService: WorkspaceService
  ) { }

  private showSuccessMessage(): void {
    this.snackBar.open('Changes saved', '', {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: 'dashboard-snackbar'
    });
  }

  private postMapping(selectedRow: MappingList): void {
    if (this.data.destinationType === EmployeeFieldMapping.EMPLOYEE || this.data.destinationType === EmployeeFieldMapping.VENDOR) {
      const employeeMappingPayload = EmployeeMappingModel.constructPayload(this.data.destinationType, selectedRow, this.data.workspaceId);
      this.mappingService.postEmployeeMapping(employeeMappingPayload).subscribe(() => this.showSuccessMessage());
    } else {
      const mappingSetting: MinimalMappingSetting = {
        source_field: this.data.sourceType,
        destination_field: this.data.destinationType
      };
      const mappingPayload = MappingModel.constructPayload(mappingSetting, selectedRow);
      this.mappingService.postMapping(mappingPayload).subscribe(() => this.showSuccessMessage());
    }
  }

  saveMapping(selectedRow: MappingList, selectedOption: DestinationAttribute, searchForm: UntypedFormGroup): void {
    searchForm.patchValue({
      destination: selectedOption.value,
      searchOption: '',
      source: searchForm.value.source
    });

    if (this.data.sourceType.toUpperCase() === EmployeeFieldMapping.EMPLOYEE) {
      selectedRow.qbo.id = selectedOption.id;
    } else {
      selectedRow.qbo.id = selectedOption.destination_id;
    }
    selectedRow.qbo.value = selectedOption.value;


    this.postMapping(selectedRow);
  }

  displayDestinationTypeHeader():string| undefined{
    if (this.data.destinationType === 'ACCOUNT' && this.workspaceGeneralSetting.import_items){
      return 'Account/ Products and Services';
    }
    return this.data.destinationType;
  }

  private setupFyleQboMappingFormArray(mappings: MappingList[]): void {
    this.fyleQboMappingFormArray = mappings.map((mapping: MappingList) => {
      return this.formBuilder.group({
        searchOption: [''],
        source: [mapping.fyle.value],
        destination: [mapping.qbo.value]
      });
    });
  }

  private setupForm(): void {
    this.form = this.formBuilder.group({
      map: [''],
      fyleQboMapping: this.formBuilder.array(this.fyleQboMappingFormArray)
    });

    const mappingForm = this.form.controls.fyleQboMapping as UntypedFormArray;
    this.mappingForm = mappingForm.controls as UntypedFormGroup[];
  }

  private setupPage(): void {
    this.workspaceService.getWorkspaceGeneralSettings().subscribe(workspaceGeneralSetting => {
      this.workspaceGeneralSetting = workspaceGeneralSetting;
      let displayName = undefined;
      if (this.data.destinationType === 'ACCOUNT') {
        displayName = this.workspaceGeneralSetting.import_items ? 'Item,Account': 'Account';
      }

      this.mappingService.getQBODestinationAttributes(this.data.destinationType, displayName).subscribe((qboData: DestinationAttribute[]) => {
        this.qboData = qboData;
        const mappings: MappingList[] = [];
        this.data.fyleAttributes.forEach((error: Error, index: number) => {
          mappings.push({
            fyle: {
              id: error.expense_attribute.id,
              value: error.expense_attribute.value
            },
            qbo: {
              id: '',
              value: ''
            },
            state: MappingState.MAPPED,
            autoMapped: error.expense_attribute.auto_mapped,
            index: index
          });
        });

        this.mappings = new MatTableDataSource(mappings);
        this.setupFyleQboMappingFormArray(mappings);
        this.setupForm();
        this.isLoading = false;
      });
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
