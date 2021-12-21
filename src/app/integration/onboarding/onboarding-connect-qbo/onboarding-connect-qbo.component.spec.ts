import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingConnectQboComponent } from './onboarding-connect-qbo.component';

describe('OnboardingConnectQboComponent', () => {
  let component: OnboardingConnectQboComponent;
  let fixture: ComponentFixture<OnboardingConnectQboComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingConnectQboComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingConnectQboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
