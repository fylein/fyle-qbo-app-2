import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { OnboardingLandingComponent } from './onboarding-landing.component';
import { AuthService } from 'src/app/core/services/core/auth.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { OnboardingState } from 'src/app/core/models/enum/enum.model';

describe('OnboardingLandingComponent', () => {
  let component: OnboardingLandingComponent;
  let fixture: ComponentFixture<OnboardingLandingComponent>;
  let authService: AuthService;
  let workspace: WorkspaceService;
  beforeEach(async () => {
    const service1 = {
      redirectToQboOAuth: () => undefined
    };
    const service2 = {
      getOnboardingState: () => OnboardingState.COMPLETE
    };
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [ OnboardingLandingComponent ],
      providers: [
        { provide: AuthService, useValue: service1},
        { provide: WorkspaceService, useValue: service2}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingLandingComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    workspace = TestBed.inject(WorkspaceService);
    fixture.detectChanges();
  });

  it('should create', () => {
    spyOn(workspace, 'getOnboardingState').and.callThrough();
    expect(component.ngOnInit()).toBeUndefined();
    fixture.detectChanges();
    expect(workspace.getOnboardingState).toHaveBeenCalled();
  });

  it('should create', () => {
    spyOn(workspace, 'getOnboardingState').and.returnValue(OnboardingState.ADVANCED_CONFIGURATION);
    expect(component.ngOnInit()).toBeUndefined();
    fixture.detectChanges();
    expect(workspace.getOnboardingState).toHaveBeenCalled();
  });

  it('connectQbo function check', () => {
    spyOn(authService, 'redirectToQboOAuth').and.callThrough();
    expect(component.connectQbo()).toBeUndefined();
    fixture.detectChanges();
    expect(authService.redirectToQboOAuth).toHaveBeenCalled();
  });
});
