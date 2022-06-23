import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { QboConnectorComponent } from './qbo-connector.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { QboConnectorService } from 'src/app/core/services/configuration/qbo-connector.service';
import { of, throwError } from 'rxjs';
import { errorResponse, exportResponse, response } from './qbo-connector.fixture';
import { ExportSettingService } from 'src/app/core/services/configuration/export-setting.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';

describe('QboConnectorComponent', () => {
  let component: QboConnectorComponent;
  let fixture: ComponentFixture<QboConnectorComponent>;
  let router: Router;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let req: any;
  let qboService:QboConnectorService;
  let exportService:ExportSettingService;
  let workspaceService: WorkspaceService;
  let service: any;
  let service2: any;
  let service3: any;
  let spyobj:any[]=[];
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;
  beforeEach(async () => {
    localStorage.setItem('user', JSON.stringify({ org_id: 'dummy', org_name: 'Fyle' }));
    service = {
      getQBOCredentials: () => of(response),
      connectQBO: () => of(response),
      disconnectQBOConnection: () => of(response)
    };
    service2 = {
      getExportSettings: () => of(exportResponse)
    };
    service3 = {
      refreshQBODimensions: () => of({}),
      setOnboardingState: () => undefined
    }
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, SharedModule, MatSnackBarModule],
      declarations: [QboConnectorComponent],
      providers: [
        { provide: QboConnectorService, useValue: service },
      { provide: ExportSettingService, useValue: service2 },
      { provide: workspaceService, useValue: service3}
    ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QboConnectorComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    injector = getTestBed();
    httpMock = injector.inject(HttpTestingController);
    qboService = TestBed.inject(QboConnectorService);
    exportService = TestBed.inject(ExportSettingService);
    workspaceService = TestBed.inject(WorkspaceService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should create, export ervice fails', () => {
    spyOn(qboService, 'getQBOCredentials').and.callThrough();
    spyOn(exportService,'getExportSettings').and.returnValue(throwError(errorResponse));
    expect(component.ngOnInit()).toBeUndefined();
    fixture.detectChanges();
    expect(component.isLoading).toBeFalse();
    expect(component.showDisconnectQBO).toBeTrue();
    expect(qboService.getQBOCredentials).toHaveBeenCalled();
    expect(exportService.getExportSettings).toHaveBeenCalled();
  });

  it('should create', () => {
    spyOn(qboService, 'getQBOCredentials').and.callThrough();
    spyOn(exportService,"getExportSettings").and.callThrough();
    expect(component.ngOnInit()).toBeUndefined();
    fixture.detectChanges();
    expect(component.showDisconnectQBO).toBeTrue();
    expect(component.isLoading).toBeFalse();
    expect(component.isContinueDisabled).toBeFalse();
    expect(qboService.getQBOCredentials).toHaveBeenCalled();
    expect(exportService.getExportSettings).toHaveBeenCalled();
  });

  it('should create in failure', () => {
    spyOn(qboService, 'getQBOCredentials').and.returnValue(throwError(errorResponse));
    expect(component.ngOnInit()).toBeUndefined();
    fixture.detectChanges();
    expect(component.isLoading).toBeFalse();
    expect(component.isQboConnected).toBeFalsy();
    expect(component.isContinueDisabled).toBeTrue();
    expect(qboService.getQBOCredentials).toHaveBeenCalled();
  });

  it('continueToNextStep=> isContinueDisabled = false function check', () => {
    spyOn(router, 'navigate');
    component.isContinueDisabled = false;
    fixture.detectChanges();
    expect(component.continueToNextStep()).toBeUndefined();
    expect(router.navigate).toHaveBeenCalledWith([`/workspaces/onboarding/employee_settings`]);
  });

  it('continueToNextStep => isContinueDisabled = true function check', () => {
    component.isContinueDisabled = true;
    fixture.detectChanges();
    expect(component.continueToNextStep()).toBeUndefined();
  });

  it('disconnectQBO function check', () => {
    spyOn(qboService, 'disconnectQBOConnection').and.callThrough();
    component.qboCompanyName = 'QBO-Fyle';
    fixture.detectChanges();
    expect(component.disconnectQbo()).toBeUndefined();
    expect(qboService.disconnectQBOConnection).toHaveBeenCalled();
  });

  it('postQBOCredential function check', () => {
    component.qboConnectionInProgress = true;
    spyOn(qboService, 'connectQBO').and.callThrough();
    spyOn(workspaceService, 'refreshQBODimensions').and.returnValue(throwError(errorResponse));
    expect((component as any).postQboCredentials('ssdsdsdsdsd','dsdsdsdsdsds')).toBeUndefined();
    fixture.detectChanges();
    expect(qboService.connectQBO).toHaveBeenCalled();
    expect(workspaceService.refreshQBODimensions).toHaveBeenCalled();
  });
});
