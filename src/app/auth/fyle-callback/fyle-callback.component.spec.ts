import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FyleCallbackComponent } from './fyle-callback.component';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarModule as MatSnackBarModule} from '@angular/material/legacy-snack-bar';
import { AuthService } from 'src/app/core/services/core/auth.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { of, throwError } from 'rxjs';
import { errorResponse, response } from './fyle-callback.fixture';
import { ActivatedRoute, Router } from '@angular/router';

describe('FyleCallbackComponent', () => {
  let component: FyleCallbackComponent;
  let fixture: ComponentFixture<FyleCallbackComponent>;
  let authService: AuthService;
  let userService: UserService;
  let activatedRoute: ActivatedRoute;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/onboarding' };
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };
  beforeEach(async () => {
    const service1 = {
      checkLoginStatusAndLogout: () => undefined,
      login: () => of(response),
      logout: () => undefined
    };
    const service2 = {
      storeUserProfile: () => undefined,
      storeFyleOrgsCount: () => 1
    };
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, MatSnackBarModule],
      declarations: [ FyleCallbackComponent ],
      providers: [
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              code: 'eeee'
            })
          }
        },
        { provide: AuthService, useValue: service1},
        { provide: UserService, useValue: service2}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FyleCallbackComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.inject(ActivatedRoute);
    authService = TestBed.inject(AuthService);
    dialogSpy = spyOn(TestBed.get(MatSnackBar), 'open').and.returnValue(dialogRefSpyObj);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/workspaces']);
  });

  it('should create with failure', () => {
    spyOn(authService, 'login').and.returnValue(throwError(errorResponse));
    expect(component.ngOnInit()).toBeUndefined();
    fixture.detectChanges();
    expect(authService.login).toHaveBeenCalled();
  });

  it('ngonite function check', () => {
    activatedRoute.queryParams=of({
      error: 'eeee'
    });
    expect(component.ngOnInit()).toBeUndefined();
    fixture.detectChanges();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['auth/login']);
    expect(dialogSpy).toHaveBeenCalled();
  });
});
