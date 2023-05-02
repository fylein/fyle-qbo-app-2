import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { MatLegacyDialogModule as MatDialogModule, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { DashboardResolveMappingErrorDialogComponent } from './dashboard-resolve-mapping-error-dialog.component';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { environment } from 'src/environments/environment';
import { destinationAttributes, expenseAttribute, getWorkspaceGeneralSettingsResponse, mappinglist, model, model2, response } from './dashboard-resolve-mapping.fixture';
import { of } from 'rxjs';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MappingList } from 'src/app/core/models/db/mapping.model';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';

describe('DashboardResolveMappingErrorDialogComponent', () => {
  let component: DashboardResolveMappingErrorDialogComponent;
  let fixture: ComponentFixture<DashboardResolveMappingErrorDialogComponent>;
  let service: MappingService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let formBuilder: UntypedFormBuilder;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' }; // Attach componentInstance to the spy object...
  beforeEach(async () => {
    const service1= {
      getWorkspaceGeneralSettings: () => of(getWorkspaceGeneralSettingsResponse),
      getWorkspaceId: () => workspace_id
    };
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, SharedModule, HttpClientTestingModule, MatSnackBarModule],
      providers: [MappingService, UntypedFormBuilder, {
        // I was expecting this will pass the desired value
        provide: MAT_DIALOG_DATA,
        useValue: model
      },
      {
        // I was expecting this will pass the desired value
        provide: MatDialogRef,
        useValue: {}
      },
      { provide: WorkspaceService, useValue: service1 }
    ],
      declarations: [ DashboardResolveMappingErrorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    injector = getTestBed();
    service = injector.inject(MappingService);
    httpMock = injector.inject(HttpTestingController);
    fixture = TestBed.createComponent(DashboardResolveMappingErrorDialogComponent);
    formBuilder = TestBed.inject(UntypedFormBuilder);
    component = fixture.componentInstance;
    dialogSpy = spyOn(TestBed.get(MatSnackBar), 'open').and.returnValue(dialogRefSpyObj);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/qbo/destination_attributes/?attribute_types=VENDOR`
    });
      req.flush([]);
  });

  it('saveMapping function check', () => {
    component.fyleQboMappingFormArray = mappinglist.map((mapping: MappingList) => {
      return formBuilder.group({
        searchOption: [''],
        source: [mapping.fyle.value],
        destination: [mapping.qbo.value]
      });
    });
    const form = formBuilder.group({
      map: [''],
      fyleQboMapping: formBuilder.array(component.fyleQboMappingFormArray)
    });

    const mappingForm = form.controls.fyleQboMapping as UntypedFormArray;
    component.mappingForm = mappingForm.controls as UntypedFormGroup[];
    fixture.detectChanges();
    component.saveMapping(mappinglist[0], destinationAttributes, component.mappingForm[0]);
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/employee/`
    });
      req.flush(response);
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('saveMapping function check', () => {
    component.data = model2;
    component.fyleQboMappingFormArray = mappinglist.map((mapping: MappingList) => {
      return formBuilder.group({
        searchOption: [''],
        source: [mapping.fyle.value],
        destination: [mapping.qbo.value]
      });
    });
    const form = formBuilder.group({
      map: [''],
      fyleQboMapping: formBuilder.array(component.fyleQboMappingFormArray)
    });

    const mappingForm = form.controls.fyleQboMapping as UntypedFormArray;
    component.mappingForm = mappingForm.controls as UntypedFormGroup[];
    fixture.detectChanges();
    component.saveMapping(mappinglist[0], destinationAttributes, component.mappingForm[0]);
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/`
    });
      req.flush(response);
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('PostMapping function check', () => {
    component.data = model2;
    fixture.detectChanges();
    expect((component as any).postMapping(mappinglist[0])).toBeUndefined();
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/`
    });
      req.flush(response);
  });
});
