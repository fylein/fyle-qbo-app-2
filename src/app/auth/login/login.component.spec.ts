import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login.component';
import { AuthService } from 'src/app/core/services/core/auth.service';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  beforeEach(async () => {
    const service1 = {
      redirectToFyleOAuth: () => undefined,
      isLoggedIn: () => true
    };
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {path: 'auth/login', component: LoginComponent}
        ]), HttpClientModule
      ],
      declarations: [ LoginComponent ],
      providers: [
        { provide: AuthService, useValue: service1},
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/', 'workspaces']);
  });

  it('login function check', () => {
    expect(component.login()).toBeUndefined();
  });
});
