import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';

import { GenericMappingComponent } from './generic-mapping.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MappingSettingResponse } from 'src/app/core/models/db/mapping-setting.model';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { MappingList, MappingStats } from 'src/app/core/models/db/mapping.model';
import { ActivatedRoute } from '@angular/router';
import { destinationAttribute, getMappingSettingResponse, getMappingsresponse, getMappingStats, mappinglist, mappingSetting, minimaMappingSetting, minimaMappingSetting2, postMappingsresponse, getWorkspaceGeneralSettingsResponse } from './generic-mapping.fixture';
import { of } from 'rxjs';
import { PaginatorPage } from 'src/app/core/models/enum/enum.model';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { PaginatorService } from 'src/app/core/services/core/paginator.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';

describe('GenericMappingComponent', () => {
  let component: GenericMappingComponent;
  let fixture: ComponentFixture<GenericMappingComponent>;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let formBuilder: UntypedFormBuilder;
  let activatedRoute: ActivatedRoute;
  let service: any;
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
    service = {
      getMappingSettings: () => of(getMappingSettingResponse),
      getMappingStats: () => of(getMappingStats),
      getWorkspaceGeneralSettings: () => of(getWorkspaceGeneralSettingsResponse),
      getSearchedQBODestinationAttributes: () => of(destinationAttribute),
      getMappings: () => of(getMappingsresponse),
      postMapping: () => of(postMappingsresponse)

    };
    await TestBed.configureTestingModule({
      declarations: [GenericMappingComponent],
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule, HttpClientModule, MatSnackBarModule, SharedModule, HttpClientTestingModule, NoopAnimationsModule],
      providers: [UntypedFormBuilder, Validators, PaginatorService,
        { provide: MappingService, useValue: service },
        { provide: WorkspaceService, useValue: service }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericMappingComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(UntypedFormBuilder);
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
    component.qboData = destinationAttribute;
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
  });

  it('Save function check', () => {
    component.mappingSetting = minimaMappingSetting;
    fixture.detectChanges();
    component.save(mappinglist[0]);
    fixture.detectChanges();
  });

  it('Save function check 2', () => {
    component.mappingSetting = minimaMappingSetting;
    component.mappingStats = mappingState;
    fixture.detectChanges();
    component.save(mappinglist[1]);
    fixture.detectChanges();
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
    component.mappingSetting = minimaMappingSetting2;
    fixture.detectChanges();
    expect(component.getMappings()).toBeUndefined();
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
    expect(component.form.value.sourceUpdated).toBeFalse();
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
    expect(component.form.value.sourceUpdated).toBeFalse();
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
