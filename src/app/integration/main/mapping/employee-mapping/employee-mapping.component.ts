import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { EmployeeMappingModel, ExtendedEmployeeAttribute, ExtendedEmployeeAttributeResponse } from 'src/app/core/models/db/employee-mapping.model';
import { MappingList, MappingStats } from 'src/app/core/models/db/mapping.model';
import { WorkspaceGeneralSetting } from 'src/app/core/models/db/workspace-general-setting.model';
import { AutoMapEmployee, EmployeeFieldMapping, MappingState, PaginatorPage } from 'src/app/core/models/enum/enum.model';
import { Paginator } from 'src/app/core/models/misc/paginator.model';
import { HelperService } from 'src/app/core/services/core/helper.service';
import { PaginatorService } from 'src/app/core/services/core/paginator.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';

@Component({
  selector: 'app-employee-mapping',
  templateUrl: './employee-mapping.component.html',
  styleUrls: ['./employee-mapping.component.scss']
})
export class EmployeeMappingComponent implements OnInit {

  totalCardActive: boolean = true;
  autoMapEmployee: AutoMapEmployee | null;
  isLoading: boolean = true;
  limit: number;
  offset: number;
  totalCount: number;
  mappingStats: MappingStats;
  employeeFieldMapping: EmployeeFieldMapping;
  qboData: DestinationAttribute[];
  mappings: MatTableDataSource<MappingList> = new MatTableDataSource<MappingList>([]);
  fyleQboMappingFormArray: FormGroup[];
  filterOptions: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  form: FormGroup;
  mappingForm: FormGroup[];

  constructor(
    private formBuilder: FormBuilder,
    public helperService: HelperService,
    private mappingService: MappingService,
    private paginatorService: PaginatorService,
    private snackBar: MatSnackBar,
    private workspaceService: WorkspaceService
  ) { }

  mappingCardUpdateHandler(totalCardActive: boolean): void {
    this.totalCardActive = totalCardActive;
    this.form.controls.cardUpdated.patchValue(true);

    this.getMappings();
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
      fyleQboMapping: this.formBuilder.array(this.fyleQboMappingFormArray),
      searchOption: [''],
      filterOption: [[]],
      cardUpdated: [false]
    });

    this.form.controls.searchOption.valueChanges.subscribe((searchTerm: string) => {
      if (searchTerm) {
        this.mappings.filter = searchTerm.trim().toLowerCase();
      } else {
        this.mappings.filter = '';
      }
    });

    const mappingForm = this.form.controls.fyleQboMapping as FormArray;
    this.mappingForm = mappingForm.controls as FormGroup[];
  }

  getMappings(data: Paginator | void): void {
    this.isLoading = true;
    if (this.form && data?.pageSizeChange) {
      this.form.controls.cardUpdated.patchValue(true);
    }
    const paginator: Paginator = data ? data : this.getPaginator();

    const mappings: MappingList[] = [];

    // Store page size when user changes it
    if (this.limit !== data?.limit) {
      this.paginatorService.storePageSize(PaginatorPage.MAPPING, paginator.limit);
    }

    this.limit = paginator.limit;
    this.offset = paginator.offset;
    const mappingState = this.totalCardActive ? MappingState.ALL : MappingState.UNMAPPED;

    let alphabetsFilter: string[] = [];
    let allAlphabets: boolean = true;

    if (this.form && !this.form.value.cardUpdated) {
      allAlphabets = this.form.value.filterOption.length === 0;

      if (!allAlphabets) {
        alphabetsFilter = this.form.value.filterOption;
      }
    }

    this.mappingService.getEmployeeMappings(mappingState, allAlphabets, paginator.limit, paginator.offset, alphabetsFilter, this.employeeFieldMapping).subscribe((extendedEmployeeAttributeResponse: ExtendedEmployeeAttributeResponse) => {
      this.totalCount = extendedEmployeeAttributeResponse.count;
      extendedEmployeeAttributeResponse.results.forEach((extendedEmployeeAttribute: ExtendedEmployeeAttribute, index: number) => {

        const qbo: {id: string | number, value: string} = {
          id: '',
          value: ''
        };

        const preserveDestination: {id: string | number} = {
          id: ''
        };

        if (extendedEmployeeAttribute.employeemapping.length) {
          if (this.employeeFieldMapping === EmployeeFieldMapping.EMPLOYEE) {
            qbo.id = extendedEmployeeAttribute.employeemapping[0].destination_employee?.id;
            qbo.value = extendedEmployeeAttribute.employeemapping[0].destination_employee?.value;
            preserveDestination.id = extendedEmployeeAttribute.employeemapping[0].destination_vendor?.id;
          } else {
            qbo.id = extendedEmployeeAttribute.employeemapping[0].destination_vendor?.id;
            qbo.value = extendedEmployeeAttribute.employeemapping[0].destination_vendor?.value;
            preserveDestination.id = extendedEmployeeAttribute.employeemapping[0].destination_employee?.id;
          }
        }

        mappings.push({
          fyle: {
            id: extendedEmployeeAttribute.id,
            value: extendedEmployeeAttribute.value
          },
          qbo: qbo,
          preserveDestination: preserveDestination,
          state: qbo.id ? MappingState.MAPPED : MappingState.UNMAPPED,
          autoMapped: extendedEmployeeAttribute.auto_mapped,
          index: index
        });
      });

      this.mappings = new MatTableDataSource(mappings);
      this.mappings.filterPredicate = this.searchByText;
      this.setupFyleQboMappingFormArray(mappings);

      // Reinitialize form when the card changes or when the component is loaded for first time
      if (!this.form || (this.form && this.form.value.cardUpdated)) {
        this.setupForm();
      }

      this.isLoading = false;
    });
  }

  private searchByText(mapping: MappingList, filterText: string) {
    return mapping.fyle.value.toLowerCase().includes(filterText.toLowerCase());
  }

  private getPaginator(): Paginator {
    return this.paginatorService.getPageSize(PaginatorPage.MAPPING);
  }

  private getMappingsAndSetupPage(): void {
    this.workspaceService.getWorkspaceGeneralSettings().subscribe((workspaceGeneralSettings: WorkspaceGeneralSetting) => {
    this.employeeFieldMapping = workspaceGeneralSettings.employee_field_mapping;
    this.autoMapEmployee = workspaceGeneralSettings.auto_map_employees;

    this.mappingService.getMappingStats(EmployeeFieldMapping.EMPLOYEE, this.employeeFieldMapping).subscribe((mappingStats: MappingStats) => {
      this.mappingStats = mappingStats;
      let qboData$;
      if (this.employeeFieldMapping === EmployeeFieldMapping.EMPLOYEE) {
        qboData$ = this.mappingService.getQBOEmployees();
      } else {
        qboData$ = this.mappingService.getQBOVendors();
      }
      qboData$.subscribe((qboData: DestinationAttribute[]) => {
        this.qboData = qboData;
        this.getMappings();
      });
    });
  });
  }

  save(selectedRow: MappingList): void {
    const employeeMappingPayload = EmployeeMappingModel.constructPayload(this.employeeFieldMapping, selectedRow, this.workspaceService.getWorkspaceId());

    this.mappingService.postEmployeeMapping(employeeMappingPayload).subscribe(() => {
      if (selectedRow.state === MappingState.UNMAPPED) {
        this.mappingStats.unmapped_attributes_count -= 1;
        selectedRow.state = MappingState.MAPPED;
      }

      this.snackBar.open('Changes saved', '', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: 'mapping-snackbar'
      });
    });
  }

  ngOnInit(): void {
    this.getMappingsAndSetupPage();
  }

}
