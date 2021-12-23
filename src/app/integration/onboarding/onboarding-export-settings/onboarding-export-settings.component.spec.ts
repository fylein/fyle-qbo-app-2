import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingExportSettingsComponent } from './onboarding-export-settings.component';

describe('OnboardingExportSettingsComponent', () => {
  let component: OnboardingExportSettingsComponent;
  let fixture: ComponentFixture<OnboardingExportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingExportSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingExportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
