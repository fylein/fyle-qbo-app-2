import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostOnboardingComponent } from './post-onboarding.component';

describe('PostOnboardingComponent', () => {
  let component: PostOnboardingComponent;
  let fixture: ComponentFixture<PostOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostOnboardingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
