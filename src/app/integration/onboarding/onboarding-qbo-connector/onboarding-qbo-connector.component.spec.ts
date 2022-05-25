import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingQboConnectorComponent } from './onboarding-qbo-connector.component';

xdescribe('OnboardingQboConnectorComponent', () => {
  let component: OnboardingQboConnectorComponent;
  let fixture: ComponentFixture<OnboardingQboConnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingQboConnectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingQboConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
