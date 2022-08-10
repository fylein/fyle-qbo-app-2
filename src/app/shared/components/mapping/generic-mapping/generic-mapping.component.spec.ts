import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { GenericMappingComponent } from './generic-mapping.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MappingSettingResponse } from 'src/app/core/models/db/mapping-setting.model';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { MappingList, MappingStats } from 'src/app/core/models/db/mapping.model';
import { ActivatedRoute } from '@angular/router';
import { mappinglist, mappingSetting, minimaMappingSetting, response } from './generic-mapping.fixture';
import { of } from 'rxjs';
import { PaginatorPage } from 'src/app/core/models/enum/enum.model';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { PaginatorService } from 'src/app/core/services/core/paginator.service';

describe('GenericMappingComponent', () => {
  let component: GenericMappingComponent;
  let fixture: ComponentFixture<GenericMappingComponent>;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let formBuilder: FormBuilder;
  let activatedRoute: ActivatedRoute;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };
  const mappingState: MappingStats = {
    all_attributes_count: 5,
    unmapped_attributes_count: 4
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenericMappingComponent],
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule, HttpClientModule, MatSnackBarModule, SharedModule, HttpClientTestingModule],
      providers: [FormBuilder, Validators, MappingService, PaginatorService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericMappingComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    injector = getTestBed();
    httpMock = injector.inject(HttpTestingController);
    activatedRoute = TestBed.inject(ActivatedRoute);
    dialogSpy = spyOn(TestBed.get(MatSnackBar), 'open').and.returnValue(dialogRefSpyObj);
    component.fyleQboMappingFormArray = mappinglist.map((mapping: MappingList) => {
      return formBuilder.group({
        searchOption: [''],
        source: [mapping.fyle.value],
        destination: [mapping.qbo.value]
      });
    });
    const form = formBuilder.group({
      map: [''],
      fyleQboMapping: formBuilder.array(component.fyleQboMappingFormArray),
      filterOption: [['dh', 'fy']],
      sourceUpdated: [true],
      searchOption: [[' fyle ']]
    });
    component.form = form;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.fyleQboMappingFormArray = mappinglist.map((mapping: MappingList) => {
      return formBuilder.group({
        searchOption: [''],
        source: [mapping.fyle.value],
        destination: [mapping.qbo.value]
      });
    });
    const form = formBuilder.group({
      map: [''],
      fyleQboMapping: formBuilder.array(component.fyleQboMappingFormArray),
      filterOption: [['dh', 'fy']],
      sourceUpdated: [true],
      searchOption: [[' fyle ']]
    });
    component.form = form;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('nqOninte function', () => {
    component.sourceType = 'project';
    fixture.detectChanges();
    expect(component).toBeTruthy();
    const response: MappingSettingResponse = {
      count: 0, next: 'aa', previous: 'aa', results: mappingSetting
    };
    const response2: MappingStats = {
      all_attributes_count: 3,
      unmapped_attributes_count: 3
    };
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/settings/`
    });
    req.flush(response);
    const req2 = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/stats/?source_type=PROJECT&destination_type=CUSTOMER`
    });
    req2.flush(response2);
    const req3 = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/qbo/destination_attributes/?attribute_types=CUSTOMER`
    });
    req3.flush([]);
  });

  it('nqOninte with form function', () => {
    component.sourceType = 'project';
    activatedRoute.snapshot.params = { source_field: 'project'};
    const form = formBuilder.group({
      filterOption: [['dh', 'fy']],
      sourceUpdated: [true],
      searchOption: [[' fyle ']]
    });
    component.form = form;
    fixture.detectChanges();
    expect(component.ngOnInit()).toBeUndefined();
    fixture.detectChanges();
    const response: MappingSettingResponse = {
      count: 0, next: 'aa', previous: 'aa', results: []
    };
    const response2: MappingStats = {
      all_attributes_count: 3,
      unmapped_attributes_count: 3
    };
    const req = httpMock.match({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/settings/`
    });
    req[0].flush(response);
    const req2 = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/stats/?source_type=PROJECT&destination_type=ACCOUNT`
    });
    req2.flush(response2);
    const req3 = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/qbo/destination_attributes/?attribute_types=ACCOUNT`
    });
    req3.flush([]);
  });

  it('Save function check', () => {
    component.mappingSetting = minimaMappingSetting;
    fixture.detectChanges();
    component.save(mappinglist[0]);
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/`
    });
    req.flush(response);
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('Save function check 2', () => {
    component.mappingSetting = minimaMappingSetting;
    component.mappingStats = mappingState;
    fixture.detectChanges();
    component.save(mappinglist[1]);
    fixture.detectChanges();
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/`
    });
    req.flush(response);
    expect(component.mappingStats.unmapped_attributes_count).toBeLessThanOrEqual(4);
    expect(mappinglist[1].state).toEqual('MAPPED');
  });
  it('getMapping function check', () => {
    const form = formBuilder.group({
      filterOption: [['dh', 'fy']],
      sourceUpdated: [true],
      searchOption: [[' fyle ']]
    });
    component.PaginatorPage = PaginatorPage;
    component.form = form;
    const page = {
      limit: 10,
      offset: 3
    };
    component.mappingSetting = minimaMappingSetting;
    fixture.detectChanges();
    expect(component.getMappings(page)).toBeUndefined();
    const response = {
      "count": 125,
      "next": `${API_BASE_URL}/workspaces/${workspace_id}/mappings/expense_attributes/?all_alphabets=true&destination_type=ACCOUNT&limit=3&mapped=ALL&mapping_source_alphabets=null&offset=6&source_type=CATEGORY`,
      "previous": `${API_BASE_URL}/workspaces/${workspace_id}/mappings/expense_attributes/?all_alphabets=true&destination_type=ACCOUNT&limit=3&mapped=ALL&mapping_source_alphabets=null&source_type=CATEGORY`,
      "results": [
        {
          "id": 36,
          "mapping": [],
          "attribute_type": "CUSTOMER",
          "display_name": "Customer",
          "value": "Advertising",
          "source_id": 186449,
          "auto_mapped": false,
          "auto_created": false,
          "active": false,
          "detail": null,
          "created_at": new Date("2022-04-29T07:14:58.746099Z"),
          "updated_at": new Date("2022-04-29T07:14:58.746128Z"),
          "workspace": 2
        }
      ]
    };
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/expense_attributes/?limit=10&offset=3&all_alphabets=false&mapped=ALL&mapping_source_alphabets=dh,fy&source_type=${minimaMappingSetting.source_field}&destination_type=${minimaMappingSetting.destination_field}`
    });
    req.flush(response);
  });

  it('getMapping function check', () => {
    component.mappingSetting = minimaMappingSetting;
    fixture.detectChanges();
    expect(component.getMappings()).toBeUndefined();
    const response = {
      "count": 125,
      "next": `${API_BASE_URL}/workspaces/${workspace_id}/mappings/expense_attributes/?all_alphabets=true&destination_type=ACCOUNT&limit=3&mapped=ALL&mapping_source_alphabets=null&offset=6&source_type=CATEGORY`,
      "previous": `${API_BASE_URL}/workspaces/${workspace_id}/mappings/expense_attributes/?all_alphabets=true&destination_type=ACCOUNT&limit=3&mapped=ALL&mapping_source_alphabets=null&source_type=CATEGORY`,
      "results": [
        {
          mapping: [{
            id: 1,
            source: {
              id: 1,
              attribute_type: 'string',
              display_name: 'string',
              value: 'string',
              source_id: 1,
              auto_mapped: true,
              active: true,
              created_at: new Date(),
              updated_at: new Date(),
              workspace: 1,
              detail: {
                location: 'string',
                full_name: 'string',
                department_id: 'string',
                department: 'string',
                department_code: 'string',
                employee_code: 'string'
              }
            },
            destination: {
              id: 1,
              attribute_type: 'VENDOR',
              display_name: 'Vendor',
              value: 'dummy',
              destination_id: '1',
              active: true,
              created_at: new Date(),
              updated_at: new Date(),
              workspace: +workspace_id,
              detail: {
                email: 'dummy@gmail.com',
                fully_qualified_name: 'Fyle'
              }
            },
            created_at: new Date(),
            updated_at: new Date(),
            workspace: 2
          }
          ]

        }
      ]
    };
    const limit = localStorage.getItem(`page-size.${PaginatorPage.MAPPING}`) || 50;
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/expense_attributes/?limit=${limit}&offset=0&all_alphabets=true&mapped=ALL&mapping_source_alphabets=null&source_type=PROJECT&destination_type=CUSTOMER`
    });
    req.flush(response);
  });

  it('mappingCardUpdateHandler function check', () => {
    const form = formBuilder.group({
      filterOption: [['dh', 'fy']],
      sourceUpdated: [true],
      searchOption: [[' fyle ']]
    });
    component.form = form;
    component.mappingSetting = minimaMappingSetting;
    component.page = 'Onboarding';
    fixture.detectChanges();
    component.mappingCardUpdateHandler(true);
    fixture.detectChanges();
    expect(component.totalCardActive).toBeTrue();
    expect(component.form.value.sourceUpdated).toBeTrue();
  });

  it('mappingCardUpdateHandler function check', () => {
    const form = formBuilder.group({
      filterOption: [['dh', 'fy']],
      sourceUpdated: [true],
      searchOption: [[' fyle ']]
    });
    component.form = form;
    component.mappingSetting = minimaMappingSetting;
    component.page = 'Onboarding';
    fixture.detectChanges();
    component.mappingCardUpdateHandler(false);
    fixture.detectChanges();
    expect(component.totalCardActive).toBeFalse();
    expect(component.form.value.sourceUpdated).toBeTrue();
  });
  it('searchByText function check', () => {
    const ans = (component as any).searchByText(mappinglist[0], 'string');
    expect(ans).toBeTrue();
    const ans1 = (component as any).searchByText(mappinglist[0], 'fyle');
    expect(ans1).toBeFalse();
  });
  it('setupForm function check', () => {
    component.fyleQboMappingFormArray = mappinglist.map((mapping: MappingList) => {
      return formBuilder.group({
        searchOption: [''],
        source: [mapping.fyle.value],
        destination: [mapping.qbo.value]
      });
    });
    const form = formBuilder.group({
      map: [''],
      fyleQboMapping: formBuilder.array(component.fyleQboMappingFormArray),
      filterOption: [['dh', 'fy']],
      sourceUpdated: [true],
      searchOption: ['']
    });
    component.form = form;
    fixture.detectChanges();
    expect((component as any).setupForm([' dh '])).toBeUndefined();
    fixture.detectChanges();
    component.form.controls.searchOption.patchValue(' dh ');
    expect((component as any).setupForm([' dh '])).toBeUndefined();
  });
});
