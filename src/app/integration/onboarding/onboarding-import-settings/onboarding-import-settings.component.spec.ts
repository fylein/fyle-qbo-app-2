import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingImportSettingsComponent } from './onboarding-import-settings.component';

xdescribe('OnboardingImportSettingsComponent', () => {
  let component: OnboardingImportSettingsComponent;
  let fixture: ComponentFixture<OnboardingImportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingImportSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingImportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
