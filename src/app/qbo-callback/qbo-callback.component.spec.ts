import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { QboCallbackComponent } from './qbo-callback.component';
import { MatLegacyDialog as MatDialog, MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { QboConnectorService } from '../core/services/configuration/qbo-connector.service';
import { WorkspaceService } from '../core/services/workspace/workspace.service';
import { OnboardingState } from '../core/models/enum/enum.model';
import { of, throwError } from 'rxjs';
import { errorResponse, errorResponse1, response } from './qbo-callback-routing.fixture';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('QboCallbackComponent', () => {
  let component: QboCallbackComponent;
  let fixture: ComponentFixture<QboCallbackComponent>;
  let qboConnectorService: QboConnectorService;
  let workspace: WorkspaceService;
  let route: Router;
  let router: ActivatedRoute;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/onboarding' };
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({title: 'FYLE',
  primaryCtaText: 'FYLE',
  contents: 'Added successfully',
  hideSecondaryCTA: false}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };
  beforeEach(async () => {
    const service1 = {
      connectQBO: () => of(response)
    };
    const service2 = {
      getOnboardingState: () => OnboardingState.COMPLETE
    };
    await TestBed.configureTestingModule({
      imports: [ NoopAnimationsModule, RouterTestingModule.withRoutes([{path: 'qbo_callback', component: QboCallbackComponent}]), HttpClientModule, MatDialogModule, MatSnackBarModule],
      declarations: [ QboCallbackComponent ],
      providers: [
        { provide: QboConnectorService, useValue: service1 },
        { provide: WorkspaceService, useValue: service2 },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: { code: 'Fyle', realmId: 'Fyle' }
            }
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QboCallbackComponent);
    component = fixture.componentInstance;
    route = TestBed.inject(Router);
    qboConnectorService = TestBed.inject(QboConnectorService);
    router = TestBed.inject(ActivatedRoute);
    workspace = TestBed.inject(WorkspaceService);
    spyOn(route, 'navigate');
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    fixture.detectChanges();
  });

  it('should create', () => {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        code: router.snapshot.queryParams.code,
        realmId: router.snapshot.queryParams.realmId
      }
  };
    spyOn(workspace, 'getOnboardingState').and.returnValue(OnboardingState.ADVANCED_CONFIGURATION);
    expect(component.ngOnInit()).toBeUndefined();
    fixture.detectChanges();
    expect(workspace.getOnboardingState).toHaveBeenCalled();
    expect(route.navigate).toHaveBeenCalledWith(['workspaces/onboarding/qbo_connector'], navigationExtras);
  });

  it('should create', () => {
    spyOn(workspace, 'getOnboardingState').and.callThrough();
    spyOn(qboConnectorService, 'connectQBO').and.callThrough();
    expect(component.ngOnInit()).toBeUndefined();
    fixture.detectChanges();
    expect(workspace.getOnboardingState).toHaveBeenCalled();
    expect(qboConnectorService.connectQBO).toHaveBeenCalled();
    expect(route.navigate).toHaveBeenCalledWith([`/workspaces/main/dashboard`]);
  });

  it('should create', () => {
    spyOn(workspace, 'getOnboardingState').and.callThrough();
    spyOn(qboConnectorService, 'connectQBO').and.returnValue(throwError(errorResponse));
    expect(component.ngOnInit()).toBeUndefined();
    fixture.detectChanges();
    expect(workspace.getOnboardingState).toHaveBeenCalled();
    expect(qboConnectorService.connectQBO).toHaveBeenCalled();
    expect(route.navigate).toHaveBeenCalledWith([`/workspaces/onboarding/landing`]);
  });

  it('should create', () => {
    spyOn(workspace, 'getOnboardingState').and.callThrough();
    spyOn(qboConnectorService, 'connectQBO').and.returnValue(throwError(errorResponse1));
    expect(component.ngOnInit()).toBeUndefined();
    fixture.detectChanges();
    expect(workspace.getOnboardingState).toHaveBeenCalled();
    expect(qboConnectorService.connectQBO).toHaveBeenCalled();
    // Expect(route.navigate).toHaveBeenCalledWith([`/workspaces/onboarding/landing`]);
  });
});
