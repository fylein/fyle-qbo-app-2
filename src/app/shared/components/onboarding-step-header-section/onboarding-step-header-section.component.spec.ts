import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingStepHeaderSectionComponent } from './onboarding-step-header-section.component';

describe('OnboardingStepHeaderSectionComponent', () => {
  let component: OnboardingStepHeaderSectionComponent;
  let fixture: ComponentFixture<OnboardingStepHeaderSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingStepHeaderSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingStepHeaderSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
