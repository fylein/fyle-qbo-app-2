import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingHeaderComponent } from './onboarding-header.component';

describe('OnboardingHeaderComponent', () => {
  let component: OnboardingHeaderComponent;
  let fixture: ComponentFixture<OnboardingHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
