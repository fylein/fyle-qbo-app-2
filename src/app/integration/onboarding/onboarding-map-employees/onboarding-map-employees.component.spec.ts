import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingMapEmployeesComponent } from './onboarding-map-employees.component';

describe('OnboardingMapEmployeesComponent', () => {
  let component: OnboardingMapEmployeesComponent;
  let fixture: ComponentFixture<OnboardingMapEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingMapEmployeesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingMapEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
