import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { WorkspacesGuard } from './workspaces.guard';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { QboConnectorService } from '../services/configuration/qbo-connector.service';
import { of, throwError } from 'rxjs';
import { WorkspaceService } from '../services/workspace/workspace.service';
import { QBOPreferenceresponse, QBOresponse } from './workspace.fixture';
import { environment } from 'src/environments/environment';
import { errorResponse } from 'src/app/integration/integration.fixture';

describe('WorkspacesGuard', () => {
  let guard: WorkspacesGuard;
  let act: ActivatedRouteSnapshot;
  let route: RouterStateSnapshot;
  let qbo: QboConnectorService;
  let workspace: WorkspaceService;
  const router = {
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  };
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };
  beforeEach(() => {
    const service1 = {
      getQBOCredentials: () => of(QBOresponse),
      getPreferences: () => of(QBOPreferenceresponse)
    };
    const service2 = {
      getOnboardingState: () => 'COMPLETE',
      getWorkspaceId: () => null
    };
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, MatSnackBarModule],
      providers: [
        { provide: QboConnectorService, useValue: service1 },
        { provide: WorkspaceService, useValue: service2 },
        { provide: Router, useValue: router }
      ]
    });
    guard = TestBed.inject(WorkspacesGuard);
    qbo = TestBed.inject(QboConnectorService);
    workspace = TestBed.inject(WorkspaceService);
    dialogSpy = spyOn(TestBed.get(MatSnackBar), 'open').and.returnValue(dialogRefSpyObj);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('canActivate function check', () => {
    spyOn(qbo, 'getQBOCredentials').and.callThrough();
    spyOn(qbo, 'getPreferences').and.callThrough();
    spyOn(workspace, 'getWorkspaceId').and.returnValue(environment.tests.workspaceId);
    const rest = guard.canActivate(act, route).valueOf();
    expect(rest).toBeDefined();
    expect(qbo.getQBOCredentials).toHaveBeenCalled();
    expect(qbo.getPreferences).toHaveBeenCalled();
    expect(workspace.getWorkspaceId).toHaveBeenCalled();
  });

  it('canActivate function check2', () => {
    spyOn(workspace, 'getWorkspaceId').and.callThrough();
    expect(guard.canActivate(act, route)).toBeUndefined();
    expect(workspace.getWorkspaceId).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('workspaces');
  });

  it('canActivate function check3', () => {
    spyOn(qbo, 'getQBOCredentials').and.returnValue(throwError(errorResponse));
    spyOn(qbo, 'getPreferences').and.returnValue(throwError(errorResponse));
    spyOn(workspace, 'getWorkspaceId').and.returnValue(environment.tests.workspaceId);
    spyOn(workspace, 'getOnboardingState').and.callThrough();
    expect(guard.canActivate(act, route)).toBeDefined();
    expect(qbo.getQBOCredentials).toHaveBeenCalled();
    expect(qbo.getPreferences).toHaveBeenCalled();
    expect(workspace.getWorkspaceId).toHaveBeenCalled();
    // Expect(workspace.getOnboardingState).toHaveBeenCalled();
    // Expect(router.navigateByUrl).toHaveBeenCalledWith('workspaces/onboarding/qbo_connector');
  });

});
