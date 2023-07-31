import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { QboConnectorComponent } from './qbo-connector.component';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { QboConnectorService } from 'src/app/core/services/configuration/qbo-connector.service';
import { of, throwError } from 'rxjs';
import { errorResponse, errorResponse2, exportResponse, response } from './qbo-connector.fixture';
import { ExportSettingService } from 'src/app/core/services/configuration/export-setting.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { ConfirmationDialog } from 'src/app/core/models/misc/confirmation-dialog.model';
import { MatLegacyDialog as MatDialog, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { AuthService } from 'src/app/core/services/core/auth.service';
import { environment } from 'src/environments/environment';

describe('QboConnectorComponent', () => {
  let component: QboConnectorComponent;
  let fixture: ComponentFixture<QboConnectorComponent>;
  let router: Router;
  let qboService: QboConnectorService;
  let exportService: ExportSettingService;
  let workspaceService: WorkspaceService ;
  let authService: AuthService;
  let service: any;
  let service2: any;
  let service3: any;
  let service4: any;
  let activatedRoute: ActivatedRoute;
  const model: ConfirmationDialog = {
    title: 'FYLE',
    primaryCtaText: 'FYLE',
    contents: 'Added successfully',
    hideSecondaryCTA: false
  };
  let dialogSpy: jasmine.Spy;
  let dialogSpy1: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: '' });
  dialogRefSpyObj.componentInstance = { body: '' };
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
      setOnboardingState: () => undefined,
      getWorkspaceId: () => environment.tests.workspaceId
    };
    service4 = {
      logout: () => undefined,
      redirectToFyleOAuth: () => undefined,
      redirectToQboOAuth: () => undefined
    };
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, SharedModule, MatSnackBarModule],
      declarations: [QboConnectorComponent],
      providers: [
        { provide: QboConnectorService, useValue: service },
        { provide: ExportSettingService, useValue: service2 },
        { provide: WorkspaceService, useValue: service3 },
        { provide: AuthService, useValue: service4},
        { provide: MAT_DIALOG_DATA, useValue: model }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QboConnectorComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    qboService = TestBed.inject(QboConnectorService);
    exportService = TestBed.inject(ExportSettingService);
    workspaceService = TestBed.inject(WorkspaceService);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    dialogSpy1 = spyOn(TestBed.get(MatSnackBar), 'open').and.returnValue(dialogRefSpyObj);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should create, export ervice fails', () => {
    spyOn(qboService, 'getQBOCredentials').and.callThrough();
    spyOn(exportService, 'getExportSettings').and.returnValue(throwError(errorResponse));
    expect(component.ngOnInit()).toBeUndefined();
    fixture.detectChanges();
    expect(component.isLoading).toBeFalse();
    expect(component.showDisconnectQBO).toBeTrue();
    expect(qboService.getQBOCredentials).toHaveBeenCalled();
    expect(exportService.getExportSettings).toHaveBeenCalled();
  });

  it('should create', () => {
    spyOn(qboService, 'getQBOCredentials').and.callThrough();
    spyOn(exportService, "getExportSettings").and.callThrough();
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

  it('postQBOCredential function connectQBO success check', () => {
    component.qboConnectionInProgress = true;
    spyOn(qboService, 'connectQBO').and.callThrough();
    spyOn(workspaceService, 'refreshQBODimensions').and.callThrough();
    expect((component as any).postQboCredentials('ssdsdsdsdsd', 'dsdsdsdsdsds')).toBeUndefined();
    fixture.detectChanges();
    expect(qboService.connectQBO).toHaveBeenCalled();
    expect(workspaceService.refreshQBODimensions).toHaveBeenCalled();
  });

  it('postQBOCredential function connectQBO failure check', () => {
    component.qboConnectionInProgress = true;
    spyOn(qboService, 'connectQBO').and.returnValue(throwError(errorResponse));
    spyOn(router, 'navigate');
    expect((component as any).postQboCredentials('ssdsdsdsdsd', 'dsdsdsdsdsds')).toBeUndefined();
    fixture.detectChanges();
    expect(qboService.connectQBO).toHaveBeenCalled();
    expect(dialogSpy1).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/workspaces/onboarding/landing']);
  });

  it('postQBOCredential function connectQBO failure with message check', () => {
    component.qboConnectionInProgress = true;
    spyOn(qboService, 'connectQBO').and.returnValue(throwError(errorResponse2));
    spyOn(router, 'navigate');
    expect((component as any).postQboCredentials('ssdsdsdsdsd', 'dsdsdsdsdsds')).toBeUndefined();
    fixture.detectChanges();
    expect(qboService.connectQBO).toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/workspaces/onboarding/landing']);
  });

  it('showWarningDialog function check', () => {
    spyOn(router, 'navigate');
    expect((component as any).showWarningDialog()).toBeUndefined();
    fixture.detectChanges();
    expect(dialogSpy).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/workspaces/onboarding/landing']);
  });

  it('switchFyleOrg() function check', () => {
    spyOn(authService, 'logout').and.callThrough();
    spyOn(authService, 'redirectToFyleOAuth').and.callThrough();
    expect(component.switchFyleOrg()).toBeUndefined();
    fixture.detectChanges();
    expect(authService.logout).toHaveBeenCalled();
    expect(authService.redirectToFyleOAuth).toHaveBeenCalled();
  });

  it('connectQbo() function check', () => {
    spyOn(authService, 'redirectToQboOAuth').and.callThrough();
    expect(component.connectQbo()).toBeUndefined();
    fixture.detectChanges();
    expect(authService.redirectToQboOAuth).toHaveBeenCalled();
  });

  it('Activerouter values', () => {
    activatedRoute.snapshot.queryParams = { code: 'bar', realmId: 'bar' };
    expect(component.ngOnInit()).toBeUndefined();
    fixture.detectChanges();
    expect(component.isLoading).toBeFalse();
  });
});
