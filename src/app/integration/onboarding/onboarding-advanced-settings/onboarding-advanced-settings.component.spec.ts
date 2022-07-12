import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingAdvancedSettingsComponent } from './onboarding-advanced-settings.component';

describe('OnboardingAdvancedSettingsComponent', () => {
  let component: OnboardingAdvancedSettingsComponent;
  let fixture: ComponentFixture<OnboardingAdvancedSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingAdvancedSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingAdvancedSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
