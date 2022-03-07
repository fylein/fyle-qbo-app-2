import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingFooterComponent } from './onboarding-footer.component';

describe('OnboardingFooterComponent', () => {
  let component: OnboardingFooterComponent;
  let fixture: ComponentFixture<OnboardingFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
