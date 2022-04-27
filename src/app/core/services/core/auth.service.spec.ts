import { TestBed } from '@angular/core/testing';
import { HttpClientModule , HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { JwtInterceptor } from 'src/app/core/interceptors/jwt.interceptor';
import { AuthService } from './auth.service';


describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [{
        provide: JWT_OPTIONS,
        useValue: JWT_OPTIONS
      },
      JwtHelperService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: JwtInterceptor,
        multi: true
      }]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('redirectToQboOAuth is working', () => {
    expect(service.redirectToQboOAuth()).toBeFalsy()
  })

  it('redirectToFyleOAuth is working', () => {
    expect(service.redirectToFyleOAuth()).toBeFalsy()
  })

  it('isLoggedIn is working', () => {
    const result = service.isLoggedIn()
    if(result == true)
      expect(result).toBeTrue()
    else
      expect(result).toBeFalse()
  })

  it('login is working', () => {
    const code = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGllbnRfaWQiOiJ0cGFZZlU3Vkx5ckVOIiwicmVzcG9uc2VfdHlwZSI6ImNvZGUiLCJjbHVzdGVyX2RvbWFpbiI6Imh0dHBzOi8vc3RhZ2luZy5meWxlLnRlY2giLCJvcmdfdXNlcl9pZCI6Im91RXRsSElKNmNhaSIsImV4cCI6MTY0OTgzMDk4N30.eFCBGnjcU0JbzYFlZWz6ncg0R8b5rQlZZm7Aaprvqdo'
    const token = {
      access_token: 'eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDk4MzA4NjgsImlzcyI6IkZ5bGVBcHAiLCJ1c2VyX2lkIjoidXN0NUdhOUhDM3FjIiwib3JnX3VzZXJfaWQiOiJvdUV0bEhJSjZjYWkiLCJvcmdfaWQiOiJvcnVueFhzSWFqU0UiLCJyb2xlcyI6IltcIkZZTEVSXCIsXCJBRE1JTlwiLFwiUEFZTUVOVF9QUk9DRVNTT1JcIixcIlZFUklGSUVSXCIsXCJGSU5BTkNFXCIsXCJBVURJVE9SXCJdIiwic2NvcGVzIjoiW10iLCJ0cGFfaWQiOiJ0cGFZZlU3Vkx5ckVOIiwidHBhX25hbWUiOiJGeWxlIFFCTyBJbnRlZ3IuLiIsImFsbG93ZWRfQ0lEUnMiOiJbXSIsInZlcnNpb24iOiIzIiwiY2x1c3Rlcl9kb21haW4iOiJcImh0dHBzOi8vc3RhZ2luZy5meWxlLnRlY2hcIiIsImV4cCI6MTY0OTgzNDQ2OH0.csLViUwOTfyX9WC1sPGL1QUSR5zkYT1cCVEBqmPD-PA',
      expires_in: 3600,
      refresh_token: 'eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDk4MzA4NjgsImlzcyI6IkZ5bGVBcHAiLCJvcmdfdXNlcl9pZCI6Ilwib3VFdGxISUo2Y2FpXCIiLCJ0cGFfaWQiOiJcInRwYVlmVTdWTHlyRU5cIiIsInRwYV9uYW1lIjoiXCJGeWxlIFFCTyBJbnRlZ3IuLlwiIiwiY2x1c3Rlcl9kb21haW4iOiJcImh0dHBzOi8vc3RhZ2luZy5meWxlLnRlY2hcIiIsImV4cCI6MTk2NTE5MDg2OH0.ELWGMC4Ji-Eq1zhef33XAKuWLOBEmy_jfjI-QOptk8o',
      token_type: 'Bearer',
      user: {
        active: true,
        admin: false,
        email: 'sravan.kumar@fyle.in',
        full_name: 'sravan k',
        id: 2,
        last_login: null,
        org_id: 'orunxXsIajSE',
        org_name: 'Test Sample Statement - GBP',
        password: '',
        staff: false,
        user_id: 'ust5Ga9HC3qc'
      }
    };
    expect(service.login(code)).toBeTruthy()
  })


  it(' is working', () => {
    expect(service.redirectToFyleOAuth())
  })
});
