import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingEmployeeSettingsComponent } from './onboarding-employee-settings.component';

xdescribe('OnboardingEmployeeSettingsComponent', () => {
  let component: OnboardingEmployeeSettingsComponent;
  let fixture: ComponentFixture<OnboardingEmployeeSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingEmployeeSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingEmployeeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
