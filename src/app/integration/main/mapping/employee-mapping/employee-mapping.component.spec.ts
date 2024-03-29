import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { MappingList } from 'src/app/core/models/db/mapping.model';
import { EmployeeFieldMapping } from 'src/app/core/models/enum/enum.model';
import { Paginator } from 'src/app/core/models/misc/paginator.model';
import { PaginatorService } from 'src/app/core/services/core/paginator.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { mappingList } from 'src/app/shared/components/mapping/mapping-table/mapping-table.fixture';
import { environment } from 'src/environments/environment';
import { EmployeeMappingComponent } from './employee-mapping.component';
import { employeeMappingResponse, getEmployeeMappingResponse, getEmployeeMappingResponse1, mappinglist, MappingStatsResponse, qboData, qboData2, workspaceGeneralSettingResponse } from './employee-mapping.fixture';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

describe('EmployeeMappingComponent', () => {
  let component: EmployeeMappingComponent;
  let fixture: ComponentFixture<EmployeeMappingComponent>;
  let workspace: WorkspaceService;
  let mappingService: MappingService;
  let paginator: PaginatorService;
  let formBuilder: UntypedFormBuilder;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };
  const workspaceId = environment.tests.workspaceId;
  beforeEach(async () => {
    const service1 = {
      getWorkspaceGeneralSettings: () => of(workspaceGeneralSettingResponse),
      getWorkspaceId: () => workspaceId
    };
    const service2 = {
      getMappingStats: () => of(MappingStatsResponse),
      getQBOEmployees: () => of(qboData),
      getQBOVendors: () => of(qboData),
      postEmployeeMapping: () => of(employeeMappingResponse),
      getEmployeeMappings: () => of(getEmployeeMappingResponse1)
    };
    const service3 = {
      storePageSize: () => undefined,
      getPageSize: () => 10
    };
    await TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, HttpClientModule, MatSnackBarModule, MatDialogModule, HttpClientTestingModule, NoopAnimationsModule ],
      declarations: [ EmployeeMappingComponent ],
      providers: [
        { provide: WorkspaceService, useValue: service1 },
        { provide: MappingService, useValue: service2 },
        { provide: PaginatorService, useValue: service3 }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeMappingComponent);
    component = fixture.componentInstance;
    workspace = TestBed.inject(WorkspaceService);
    mappingService = TestBed.inject(MappingService);
    paginator = TestBed.inject(PaginatorService);
    formBuilder = TestBed.inject(UntypedFormBuilder);
    dialogSpy = spyOn(TestBed.get(MatSnackBar), 'open').and.returnValue(dialogRefSpyObj);
    component.fyleQboMappingFormArray = mappingList.map((mapping: MappingList) => {
      return formBuilder.group({
        searchOption: [[' fyle ']],
        source: [mapping.fyle.value],
        destination: [mapping.qbo.value]
      });
    });
    component.form = formBuilder.group({
      map: [''],
      fyleQboMapping: formBuilder.array(component.fyleQboMappingFormArray),
      searchOption: [[' fyle ']],
      filterOption: [''],
      cardUpdated: [false]
    });
    component.qboData = qboData2.results;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.fyleQboMappingFormArray = mappingList.map((mapping: MappingList) => {
      return formBuilder.group({
        searchOption: [[' fyle ']],
        source: [mapping.fyle.value],
        destination: [mapping.qbo.value]
      });
    });
    component.form = formBuilder.group({
      map: [''],
      fyleQboMapping: formBuilder.array(component.fyleQboMappingFormArray),
      searchOption: [[' fyle ']],
      filterOption: [''],
      cardUpdated: [false]
    });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('ngOning function check', () => {
    workspaceGeneralSettingResponse.employee_field_mapping = EmployeeFieldMapping.VENDOR;
    spyOn(workspace, 'getWorkspaceGeneralSettings').and.callThrough();
    expect(component.ngOnInit()).toBeUndefined();
    fixture.detectChanges();
    expect(workspace.getWorkspaceGeneralSettings).toHaveBeenCalled();
  });

  it('save function check', () => {
    spyOn(mappingService, 'postEmployeeMapping').and.callThrough();
    expect(component.save(mappinglist[0])).toBeUndefined();
    fixture.detectChanges();
    expect(mappingService.postEmployeeMapping).toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('searchByText function check', () => {
    const ans = (component as any).searchByText(mappinglist[0], 'string');
    expect(ans).toBeTrue();
    const ans1 = (component as any).searchByText(mappinglist[0], ' fyle ');
    expect(ans1).toBeFalse();
  });

  it('mappingCardUpdateHandler function check', () => {
    component.form = formBuilder.group({
      map: [''],
      fyleQboMapping: formBuilder.array(component.fyleQboMappingFormArray),
      filterOption: [['dh', 'fy']],
      searchOption: [[' fyle ']],
      cardUpdated: [false]
    });
    fixture.detectChanges();
    expect(component.mappingCardUpdateHandler(true)).toBeUndefined();
    expect(component.mappingCardUpdateHandler(false)).toBeUndefined();
  });

  it('setupForm function check', () => {
    component.fyleQboMappingFormArray = mappinglist.map((mapping: MappingList) => {
      return formBuilder.group({
        searchOption: [''],
        source: [mapping.fyle.value],
        destination: [mapping.qbo.value]
      });
    });
    component.form = formBuilder.group({
      map: [''],
      fyleQboMapping: formBuilder.array(component.fyleQboMappingFormArray),
      searchOption: [''],
      filterOption: [[' dh ', 'fyle']],
      cardUpdated: [false]
    });
    fixture.detectChanges();
    expect((component as any).setupForm([' dh '])).toBeUndefined();
    fixture.detectChanges();
    component.form.controls.searchOption.patchValue(' dh ');
    expect((component as any).setupForm([' dh '])).toBeUndefined();
    fixture.detectChanges();
    component.form.controls.searchOption.patchValue('');
    expect((component as any).setupForm()).toBeUndefined();
  });

  it('getMappings function check', () => {
    component.employeeFieldMapping = EmployeeFieldMapping.VENDOR;
    component.form = formBuilder.group({
      map: [''],
      fyleQboMapping: formBuilder.array(component.fyleQboMappingFormArray),
      searchOption: [[' fyle ']],
      filterOption: [[' dh ', 'fyle']],
      cardUpdated: [false]
    });
    fixture.detectChanges();
    const parameter:Paginator = {
      limit: 3,
      offset: 3
    };
    expect(component.getMappings(parameter)).toBeUndefined();
    expect(component.isLoading).toBeFalse();
  });
  it('getMappings function check', () => {
    component.qboData = qboData2.results.slice(0, 1);
    component.employeeFieldMapping = EmployeeFieldMapping.EMPLOYEE;
    component.form = formBuilder.group({
      map: [''],
      fyleQboMapping: formBuilder.array(component.fyleQboMappingFormArray),
      searchOption: [[' fyle ']],
      filterOption: [[' dh ', 'fyle']],
      cardUpdated: [false]
    });
    fixture.detectChanges();
    const parameter:Paginator = {
      limit: 3,
      offset: 3
    };
    spyOn(mappingService, 'getEmployeeMappings').and.returnValue(of(getEmployeeMappingResponse));
    expect(component.getMappings(parameter)).toBeUndefined();
    fixture.detectChanges();
    expect(mappingService.getEmployeeMappings).toHaveBeenCalled();
  });
});