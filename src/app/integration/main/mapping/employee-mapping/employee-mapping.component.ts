import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { EmployeeMapping, EmployeeMappingsResponse } from 'src/app/core/models/db/employee-mapping.model';
import { MappingList } from 'src/app/core/models/db/mapping.model';
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
  // TODO: update this
  autoMapEmployee: AutoMapEmployee = AutoMapEmployee.NAME;
  isLoading: boolean = true;
  limit: number;
  offset: number;
  totalCount: number;
  employeeFieldMapping: EmployeeFieldMapping;
  qboData: DestinationAttribute[];
  mappings: MatTableDataSource<MappingList> = new MatTableDataSource<MappingList>([]);
  displayedColumns: string[] = ['fyle', 'qbo', 'state'];
  filterOptions: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  form: FormGroup;
  mappingForm: FormGroup[];

  constructor(
    private formBuilder: FormBuilder,
    public helperService: HelperService,
    private mappingService: MappingService,
    private paginatorService: PaginatorService,
    private workspaceService: WorkspaceService
  ) { }

  triggerAutoMapEmployee(): void {
    // TODO: trigger auto map employee
  }

  addAllFilterHandler(): void {
    this.form.value.filterOption = this.filterOptions.concat();
  }

  filterOptionUpdateHandler(alphabet: string): void {
    const index = this.form.value.filterOption.indexOf(alphabet);

    if (index > -1) {
      this.form.value.filterOption.splice(index, 1);
    } else {
      this.form.value.filterOption.push(alphabet);
    }
  }

  private setupForm(mappings: MappingList[]): void {
    const fyleQboMappingFormArray = mappings.map((mapping: MappingList) => {
      return this.formBuilder.group({
        searchOption: [''],
        source: [mapping.fyle],
        destination: [mapping.qbo]
      });
    });

    this.form = this.formBuilder.group({
      map: [''],
      fyleQboMapping: this.formBuilder.array(fyleQboMappingFormArray),
      searchOption: [''],
      filterOption: [this.filterOptions.concat()]
    });

    const mappingForm = this.form.controls.fyleQboMapping as FormArray;
    this.mappingForm = mappingForm.controls as FormGroup[];
  }

  getMappings(data: Paginator): void {
    this.isLoading = true;
    const mappings: MappingList[] = [];

    // Store page size when user changes it
    if (this.limit !== data.limit) {
      this.paginatorService.storePageSize(PaginatorPage.MAPPING, data.limit);
    }

    this.limit = data.limit;
    this.offset = data.offset;

    this.mappingService.getEmployeeMappings('ALL', data.limit, data.offset).subscribe((employeeMappingResponse: EmployeeMappingsResponse) => {
      this.totalCount = employeeMappingResponse.count;
      employeeMappingResponse.results.forEach((employeeMapping: EmployeeMapping, index: number) => {
        mappings.push({
          fyle: employeeMapping.source_employee.value,
          qbo: employeeMapping.destination_employee.value,
          state: MappingState.MAPPED,
          autoMapped: employeeMapping.source_employee.auto_mapped,
          index: index
        });
      });

      this.mappings = new MatTableDataSource(mappings);
      this.mappings.filterPredicate = this.searchByText;
      this.setupForm(mappings);

      this.isLoading = false;
    });
  }

  private searchByText(mapping: MappingList, filterText: string) {
    return mapping.fyle.includes(filterText);
  }

  private getMappingsAndSetupPage(): void {
    this.workspaceService.getWorkspaceGeneralSettings().subscribe((workspaceGeneralSetting: WorkspaceGeneralSetting) => {
      this.employeeFieldMapping = workspaceGeneralSetting.employee_field_mapping;
      let qboData$;
      if (this.employeeFieldMapping === EmployeeFieldMapping.EMPLOYEE) {
        qboData$ = this.mappingService.getQBOEmployees();
      } else {
        qboData$ = this.mappingService.getQBOVendors();
      }
      qboData$.subscribe((qboData: DestinationAttribute[]) => {
        this.qboData = qboData;

        const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.MAPPING);
        this.getMappings(paginator);
      });
    });
  }

  save(selectedOption: DestinationAttribute, searchForm: FormGroup): void {
    searchForm.patchValue({
      destination: selectedOption.value,
      searchOption: [''],
      source: searchForm.value.source
    });
    this.helperService.clearSearchText(searchForm);

    // TODO: POST API
  }

  ngOnInit(): void {
    this.getMappingsAndSetupPage();
  }

}
