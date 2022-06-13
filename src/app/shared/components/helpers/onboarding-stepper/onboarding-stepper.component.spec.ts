import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { OnboardingStepperComponent } from './onboarding-stepper.component';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

describe('OnboardingStepperComponent', () => {
  let component: OnboardingStepperComponent;
  let fixture: ComponentFixture<OnboardingStepperComponent>;
  let router = {
    navigate: jasmine.createSpy('navigate')
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [ OnboardingStepperComponent ],
      providers: [WorkspaceService,
        { provide: Router, useValue: router }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingStepperComponent);
    component = fixture.componentInstance;
    component.currentStep = 'Connect to QBO'
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('Stepper check', () => {
    spyOn(component, 'ngOnInit');
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.onboardingSteps[0].active).toBeTrue();
    expect(component.ngOnInit).toHaveBeenCalled();
    const onboardingImg = fixture.debugElement.query(By.css('.stepper--icon')).nativeElement;
    expect(onboardingImg.clientHeight).toBeGreaterThanOrEqual(14);
    expect(onboardingImg.clientWidth).toBeGreaterThanOrEqual(20);
  });

  it('Navigation function check', () => {
    component.navigate(true,'/login');
    expect(component.navigate).toBeTruthy();
  });
});
