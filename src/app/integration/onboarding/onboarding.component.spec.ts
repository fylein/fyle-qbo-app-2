import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { WindowService } from 'src/app/core/services/core/window.service';
import { OnboardingComponent } from './onboarding.component';

describe('OnboardingComponent', () => {
  let component: OnboardingComponent;
  let fixture: ComponentFixture<OnboardingComponent>;
  let router: Router;
  const mockNavigator = jasmine.createSpyObj({location: {pathname: '/workspaces/onboarding'}});
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/onboarding' };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ OnboardingComponent ],
      providers: [
        { prodive: WindowService, useValue: mockNavigator},
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { workspace_id: 2 }
            }
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const mockNavigator = jasmine.createSpyObj({location: {pathname: '/workspaces/onboarding'}});
    // Here we use the mockNavigator to simulate behavior
    spyOnProperty(window, 'navigator', 'get').and.returnValue(mockNavigator);
    expect(component).toBeTruthy();
  });
});
